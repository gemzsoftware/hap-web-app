import { Urbanist } from 'next/font/google';
import './globals.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
});

export const metadata = {
  title: 'Heaven Ark Properties',
  description: 'Discover your dream home with Heaven Ark Properties. Premium real estate services.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
