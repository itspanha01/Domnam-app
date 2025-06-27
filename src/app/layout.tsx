import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { LayoutDecider } from '@/components/layout-decider';
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Domnam - Smart Farm Management',
  description: 'AI-powered smart farm management dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%2390EE90' fill-rule='evenodd' d='M213.333,42.667H85.333c-23.5,0-42.667,19.167-42.667,42.667v128c0,23.5,19.167,42.667,42.667,42.667h85.333 C213.333,256,256,213.333,256,170.667V85.333C256,61.833,236.833,42.667,213.333,42.667z M224,170.667c0,28.167-28.167,53.333-53.333,53.333H85.333c-5.833,0-10.667-4.833-10.667-10.667v-128 c0-5.833,4.833-10.667,10.667-10.667h128c5.833,0,10.667,4.833,10.667,10.667V170.667z M170.667,128 c0,23.5-19.167,42.667-42.667,42.667s-42.667-19.167-42.667-42.667s19.167-42.667,42.667-42.667 C155.667,85.333,170.667,100.333,170.667,128z M128,96c-11.667,0-22.333,5.833-28.167,14.833 C105.667,104.833,116.333,96,128,96c17.667,0,32,14.333,32,32c0,11.667-5.833,22.333-14.833,28.167 C152.167,150.333,160,140.667,160,128C160,110.333,145.667,96,128,96z'/%3e%3c/svg%3e" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <LayoutDecider>{children}</LayoutDecider>
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
