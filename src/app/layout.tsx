import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Chess — Сад Стратегий",
  description:
    "Когнитивная платформа на базе ИИ, геймифицирующая стратегическое мышление с помощью шахмат и RPG-механик. Тренируйте ум, растите свой сад.",
  keywords: ["шахматы", "ИИ", "когнитивные тренировки", "RPG", "стратегия", "сад"],
  openGraph: {
    title: "Aura Chess — Сад Стратегий",
    description: "Тренируйте ум. Растите свой сад. Совершенствуйте стратегию.",
    type: "website",
  },
};

import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-aura-bg text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
