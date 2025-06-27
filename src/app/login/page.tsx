"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/context/language-context';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError(t('error_passwords_mismatch'));
        return;
      }
      try {
        await signup(username, password);
        router.push('/');
      } catch (err: any) {
        // Use translation for known errors
        if (err.message === "Username already exists.") {
            setError(t('error_username_exists'));
        } else {
            setError(err.message);
        }
      }
    } else {
      try {
        await login(username, password);
        router.push('/');
      } catch (err: any) {
         // Use translation for known errors
        if (err.message === "Invalid username or password.") {
            setError(t('error_invalid_credentials'));
        } else {
            setError(err.message);
        }
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Sprout className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-headline font-bold">Domnam</h1>
              </div>
              <CardTitle className="text-2xl font-headline">
                {t(mode === 'login' ? 'login_welcome' : 'login_create_account')}
              </CardTitle>
              <CardDescription>
                {t(mode === 'login' ? 'login_description' : 'signup_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">{t('username_label')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password_label')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('confirm_password_label')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full">
                {t(mode === 'login' ? 'login_button' : 'signup_button')}
              </Button>
              <Button type="button" variant="link" onClick={toggleMode}>
                {t(mode === 'login' ? 'login_toggle' : 'signup_toggle')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
