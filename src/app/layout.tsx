import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/main-layout';

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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 102.05 100'><path fill='%23a4d08b' d='M28.43,0c-11.83.29-14.73,3.69-14.73,3.69L0,18.06V81.94l13.7,14.37s2.9,3.69,14.73,3.69H72.43c18.8,0,29.62-12.78,29.62-29.18S91.23,32.06,72.43,32.06c-4.1,0-7.68.55-10.59.83a23.06,23.06,0,0,1-11.67-19.46C50.17,7.5,42.53,0,28.43,0Zm20.4,43.26c2.69,0,5.12-.24,5.12-.24,10.46,0,13.58,7.22,13.58,16.39,0,9.67-2.9,16.63-13.4,16.63H48.83Z'/></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
