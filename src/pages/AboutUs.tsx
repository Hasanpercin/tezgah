
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Skeleton } from '@/components/ui/skeleton';

const AboutUs = () => {
  const { content, isLoading } = useWebsiteContent('about');

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[40vh]" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${content.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop"})`
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {content.page_title || "Hakkımızda"}
          </h1>
        </div>
      </div>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6">Hikayemiz</h2>
            <div className="prose prose-lg max-w-none">
              <p>{content.story_text || "2010 yılında İstanbul'un kalbinde küçük bir mekânda başlayan yolculuğumuz, bugün şehrin en sevilen restoranlarından biri olmamızla devam ediyor. Kurucumuz ve şef Ahmet Yılmaz'ın geleneksel Türk mutfağına olan tutkusu ve yenilikçi yaklaşımı, Lezzet Durağı'nın temelini oluşturdu."}</p>
              <p>Her adımda kaliteyi ve özgünlüğü ön planda tutarak, misafirlerimize unutulmaz lezzet deneyimleri sunmayı amaçlıyoruz. Taze ve mevsimlik malzemelerle hazırlanan menümüz, geleneksel tarifleri modern dokunuşlarla buluşturuyor.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
              <p className="text-lg">
                {content.mission_text || "Geleneksel lezzetleri modern sunumlarla buluşturarak, her misafirimize özel bir deneyim sunmak. Kaliteli malzemeler ve özgün tariflerle, Türk mutfağının zenginliğini yansıtmak ve gastronomi dünyasına katkıda bulunmak."}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
              <p className="text-lg">
                {content.vision_text || "Türk mutfağını en iyi şekilde temsil eden, yenilikçi ve sürdürülebilir bir restoran markası olarak ulusal ve uluslararası alanda tanınmak. Misafir memnuniyetini her zaman ön planda tutarak, sürekli gelişim ve kalite odaklı bir yaklaşımla sektörde öncü olmak."}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Ekibimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-muted mb-4 overflow-hidden">
                {content.team_member_1_image ? (
                  <img 
                    src={content.team_member_1_image} 
                    alt={content.team_member_1_name || "Ahmet Yılmaz"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-4xl font-bold text-primary/40">
                      {(content.team_member_1_name || "AY").substring(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{content.team_member_1_name || "Ahmet Yılmaz"}</h3>
              <p className="text-muted-foreground">{content.team_member_1_title || "Kurucu Şef"}</p>
            </div>
            
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-muted mb-4 overflow-hidden">
                {content.team_member_2_image ? (
                  <img 
                    src={content.team_member_2_image} 
                    alt={content.team_member_2_name || "Ayşe Demir"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-4xl font-bold text-primary/40">
                      {(content.team_member_2_name || "AD").substring(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{content.team_member_2_name || "Ayşe Demir"}</h3>
              <p className="text-muted-foreground">{content.team_member_2_title || "İşletme Müdürü"}</p>
            </div>
            
            {/* Team Member 3 - Optional based on content */}
            {content.team_member_3_name && (
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-muted mb-4 overflow-hidden">
                  {content.team_member_3_image ? (
                    <img 
                      src={content.team_member_3_image} 
                      alt={content.team_member_3_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="text-4xl font-bold text-primary/40">
                        {content.team_member_3_name.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{content.team_member_3_name}</h3>
                <p className="text-muted-foreground">{content.team_member_3_title}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
