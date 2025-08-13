import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "~/components/header/header";

export const metadata: Metadata = {
  title: "Cricket Data Analytics",
  description: "Cricket Data Analytics",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col items-center bg-gray-50 px-5">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
