import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ooo..FAT! — Smash Burgers Birmingham",
  description: "Smashed Angus Beef. Brioche Bun. No Compromises. Drive-thru in Birmingham. Open Daily 6PM – 2AM.",
  keywords: ["smash burger", "Birmingham", "drive-thru", "burgers", "Ooo FAT"],
  openGraph: {
    title: "Ooo..FAT! — Smash Burgers Birmingham",
    description: "Smashed Angus Beef. Brioche Bun. No Compromises.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
