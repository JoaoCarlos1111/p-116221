
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  memberSince: string;
  lastLogin: string;
  status: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Desenvolvedor Full Stack com experiência em React e Node.js. Apaixonado por tecnologia e inovação.",
    avatar: "",
    memberSince: "January 2024",
    lastLogin: "2 hours ago",
    status: "Active"
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleInputChange('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Perfil</h1>
          <p className="text-secondary-foreground">Gerencie suas informações pessoais</p>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </Button>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card p-6">
            {/* Avatar Section */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={isEditing ? editedProfile.avatar : profile.avatar} 
                    alt="Foto do perfil" 
                  />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
                    >
                      <Camera className="h-4 w-4 text-primary-foreground" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 mt-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary rounded-full">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Informações Pessoais</h3>
                <p className="text-sm text-muted-foreground">Seus dados básicos de perfil</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{profile.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{profile.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Estatísticas da Conta</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="font-medium">{profile.memberSince}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Último acesso</p>
                <p className="font-medium">{profile.lastLogin}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Status da conta</p>
                <p className="font-medium text-green-500">{profile.status}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
