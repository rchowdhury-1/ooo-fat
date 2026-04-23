import type { Metadata } from "next";
import { Archivo_Black, Permanent_Marker, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
    <html lang="en" className={`${archivoBlack.variable} ${permanentMarker.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
