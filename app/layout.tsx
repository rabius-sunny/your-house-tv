import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/lib/auth';
import getUserSession from '@/lib/auth/getUser';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: {
    default: 'Your House TV',
    template: '%s - Your House TV'
  },
  description: 'Generated by Your House TV'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getUserSession();

  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className={`${montserrat.className} antialiased`}
      >
        <NextTopLoader
          color='#9b7aff'
          showSpinner={false}
          height={5}
        />
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
        <Toaster
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
