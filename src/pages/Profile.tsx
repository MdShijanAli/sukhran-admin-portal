import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          {t('profile.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('profile.avatar')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-4xl bg-gradient-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('profile.information')}</CardTitle>
            <CardDescription>{t('profile.informationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('profile.name')}
                </Label>
                <Input id="name" defaultValue={user.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('profile.email')}
                </Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('profile.phone')}
                </Label>
                <Input id="phone" defaultValue="+880 1712-345678" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('profile.location')}
                </Label>
                <Input id="location" defaultValue="Dhaka, Bangladesh" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('profile.role')}
                </Label>
                <Input id="role" defaultValue={user.role} disabled className="capitalize" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>{t('common.save')}</Button>
              <Button variant="outline">{t('common.cancel')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
