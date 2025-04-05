
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export type ContentSection = 'homepage' | 'about' | 'contact' | 'gallery';

export interface WebsiteContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
  updated_at: string;
}

export const useWebsiteContent = (section: ContentSection) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch content for the specified section
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', section);

        if (fetchError) {
          throw fetchError;
        }

        // Convert array of content items to a key-value object
        const contentObj = data.reduce((acc: Record<string, string>, item: WebsiteContentItem) => {
          acc[item.key] = item.value;
          return acc;
        }, {});

        setContent(contentObj);
      } catch (err: any) {
        console.error('Error fetching website content:', err);
        setError(err.message || 'İçerik yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();

    // Set up real-time subscription
    const channel = supabase
      .channel('website_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_content',
          filter: `section=eq.${section}`,
        },
        (payload) => {
          // Update the content when changes occur
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newItem = payload.new as WebsiteContentItem;
            setContent((prev) => ({
              ...prev,
              [newItem.key]: newItem.value,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section]);

  // Function to update a content item
  const updateContent = async (key: string, value: string) => {
    try {
      const { data, error: upsertError } = await supabase
        .from('website_content')
        .upsert({
          section,
          key,
          value,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'section,key',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        throw upsertError;
      }

      toast({
        title: 'İçerik güncellendi',
        description: 'Web sitesi içeriği başarıyla kaydedildi',
      });

      return data;
    } catch (err: any) {
      console.error('Error updating website content:', err);
      toast({
        title: 'Hata',
        description: err.message || 'İçerik güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Function to update multiple content items at once
  const updateMultipleContent = async (updates: Record<string, string>) => {
    try {
      const upsertData = Object.entries(updates).map(([key, value]) => ({
        section,
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { data, error: upsertError } = await supabase
        .from('website_content')
        .upsert(upsertData, {
          onConflict: 'section,key',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        throw upsertError;
      }

      toast({
        title: 'İçerik güncellendi',
        description: 'Web sitesi içeriği başarıyla kaydedildi',
      });

      return data;
    } catch (err: any) {
      console.error('Error updating multiple website content:', err);
      toast({
        title: 'Hata',
        description: err.message || 'İçerik güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    content,
    isLoading,
    error,
    updateContent,
    updateMultipleContent,
  };
};
