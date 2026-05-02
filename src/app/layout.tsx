import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Chess — The Garden of Strategy",
  description:
    "An AI-powered cognitive training platform that gamifies strategic thinking using chess and RPG mechanics. Train your mind, grow your garden.",
  keywords: ["chess", "AI", "cognitive training", "RPG", "strategy", "garden"],
  openGraph: {
    title: "Aura Chess — The Garden of Strategy",
    description: "Train your mind. Grow your garden. Master strategy.",
    type: "website",
  },
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-aura-bg text-white">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
