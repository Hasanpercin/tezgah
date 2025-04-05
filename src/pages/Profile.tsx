
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Hero from '@/components/Hero';

// Sample user data - in a real app, this would come from authentication service
const mockUser = {
  id: "1",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  phone: "+90 555 123 4567",
  address: "İstanbul, Türkiye",
  loyaltyPoints: 350,
  memberSince: "2023-10-15",
  avatar: "/placeholder.svg"
};

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  phone: z.string().min(5, {
    message: "Geçerli bir telefon numarası giriniz.",
  }),
  address: z.string().min(5, {
    message: "Adres en az 5 karakter olmalıdır.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const [user, setUser] = useState(mockUser);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });

  function onSubmit(data: ProfileFormValues) {
    setUser({
      ...user,
      ...data
    });
    toast({
      title: "Profil güncellendi",
      description: "Profil bilgileriniz başarıyla güncellendi.",
    });
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login form schema
  const loginFormSchema = z.object({
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    password: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
  });

  // Register form schema
  const registerFormSchema = z.object({
    name: z.string().min(2, {
      message: "İsim en az 2 karakter olmalıdır.",
    }),
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    password: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
    passwordConfirm: z.string().min(6, {
      message: "Şifre en az 6 karakter olmalıdır.",
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });

  type LoginFormValues = z.infer<typeof loginFormSchema>;
  type RegisterFormValues = z.infer<typeof registerFormSchema>;

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  function handleLogin(data: LoginFormValues) {
    // In a real app, this would be a call to your authentication service
    console.log("Login data:", data);
    
    // Mock login success
    setIsAuthenticated(true);
    toast({
      title: "Giriş başarılı",
      description: "Hoş geldiniz!",
    });
  }

  function handleRegister(data: RegisterFormValues) {
    // In a real app, this would be a call to your authentication service
    console.log("Register data:", data);
    
    // Mock register success
    setIsAuthenticated(true);
    toast({
      title: "Kayıt başarılı",
      description: "Hoş geldiniz!",
    });
  }

  // Demo function to simulate logout
  function handleLogout() {
    setIsAuthenticated(false);
    toast({
      title: "Çıkış yapıldı",
      description: "Tekrar görüşmek üzere!",
    });
  }

  return (
    <>
      <Hero 
        backgroundImage="/lovable-uploads/a685bcf7-d128-4123-ab5f-581a1d6ef24f.png" 
        title="Kullanıcı Profili" 
        subtitle="Hesabınızı yönetin ve sadakat puanlarınızı görüntüleyin"
        showButtons={false}
      />

      <div className="container mx-auto px-4 py-16">
        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                      <CardDescription>Üye Olma Tarihi: {new Date(user.memberSince).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-6 space-y-4">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Telefon:</span>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Adres:</span>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>Çıkış Yap</Button>
                </CardFooter>
              </Card>
            </div>
  
            <div className="md:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="loyalty">Sadakat Programı</TabsTrigger>
                </TabsList>
  
                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profil Bilgileri</CardTitle>
                      <CardDescription>
                        Hesap bilgilerinizi güncelleyin
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>İsim</FormLabel>
                                <FormControl>
                                  <Input placeholder="İsminiz" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>E-posta</FormLabel>
                                <FormControl>
                                  <Input placeholder="E-posta adresiniz" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                  <Input placeholder="Telefon numaranız" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adres</FormLabel>
                                <FormControl>
                                  <Input placeholder="Adresiniz" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Kaydet</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
  
                <TabsContent value="loyalty">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sadakat Programı</CardTitle>
                      <CardDescription>
                        Sadakat puanlarınız ve kazanımlarınız
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center p-4 border rounded-lg">
                        <h3 className="text-xl font-medium">Toplam Puanınız</h3>
                        <p className="text-4xl font-bold text-secondary mt-2">{user.loyaltyPoints}</p>
                        <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                          <div
                            className="bg-secondary h-2.5 rounded-full"
                            style={{ width: `${Math.min((user.loyaltyPoints / 500) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Bir sonraki ödüle {500 - (user.loyaltyPoints % 500)} puan kaldı
                        </p>
                      </div>
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Nasıl Puan Kazanılır?</h4>
                          <ul className="mt-2 space-y-2 text-sm">
                            <li className="flex items-start">
                              <span className="bg-secondary text-secondary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">1</span>
                              <span>Her 100₺ harcama için 10 puan</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-secondary text-secondary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">2</span>
                              <span>Doğum gününüzde ekstra 50 puan</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-secondary text-secondary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">3</span>
                              <span>Arkadaş tavsiyesinde 25 puan</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-secondary text-secondary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">4</span>
                              <span>Online rezervasyonlarda 5 ekstra puan</span>
                            </li>
                          </ul>
                        </div>
  
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Ödüller</h4>
                          <ul className="mt-2 space-y-2 text-sm">
                            <li className="flex items-start">
                              <span className="bg-muted text-muted-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">100</span>
                              <span>Ücretsiz İçecek</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-muted text-muted-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">250</span>
                              <span>Ücretsiz Tatlı</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-muted text-muted-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">500</span>
                              <span>%15 İndirim Kuponu</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-muted text-muted-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">1000</span>
                              <span>Ücretsiz Ana Yemek</span>
                            </li>
                          </ul>
                        </div>
                      </div>
  
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Son Hareketler</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-accent rounded">
                            <span>Restoran Ziyareti</span>
                            <span className="text-secondary font-medium">+30 puan</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-accent rounded">
                            <span>Online Rezervasyon</span>
                            <span className="text-secondary font-medium">+5 puan</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-accent rounded">
                            <span>Tatlı Ödülü Kullanımı</span>
                            <span className="text-destructive font-medium">-250 puan</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register">Üye Ol</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Giriş Yap</CardTitle>
                    <CardDescription>
                      Hesabınıza giriş yaparak sadakat puanlarınızı takip edin ve özel tekliflerden yararlanın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-posta</FormLabel>
                              <FormControl>
                                <Input placeholder="ornek@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Şifre</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">Giriş Yap</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Üye Ol</CardTitle>
                    <CardDescription>
                      Üye olarak sadakat programına katılın ve özel avantajlardan yararlanın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>İsim</FormLabel>
                              <FormControl>
                                <Input placeholder="İsminiz" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-posta</FormLabel>
                              <FormControl>
                                <Input placeholder="ornek@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Şifre</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="passwordConfirm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Şifre Tekrar</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">Üye Ol</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
}
