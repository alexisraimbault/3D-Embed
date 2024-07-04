import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { KobbleProvider } from '@kobbleio/next/server';

import "./index.scss";
// import 'primeicons/primeicons.css';
// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3D Embed",
  description: "3D assets easily embedded",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KobbleProvider>
          {children}
        </KobbleProvider>
      </body>
    </html>
  );
}