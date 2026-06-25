import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "THE OLDVERSE | Every Story Deserves A Stage",
  description: "A premium cinematic streaming platform and creator ecosystem for independent filmmakers, visual artists, writers, and storytellers.",
  keywords: "streaming, independent film, creators, director portfolio, behind the scenes, casting calls, cinematic platform",
  openGraph: {
    title: "THE OLDVERSE | Every Story Deserves A Stage",
    description: "Discover premium independent cinema, explore behind-the-scenes diaries, and connect with global creators.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-oldverse-bg text-oldverse-text selection:bg-oldverse-accent selection:text-oldverse-bg">
      <body className="min-h-full flex flex-col noise-bg">
        <AuthWrapper>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
