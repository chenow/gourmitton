import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/context/authContext";

export const metadata: Metadata = {
  title: "Gourmitton",
  description: "Recettes de cuisine pour tous les goûts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <Navigation>{children}</Navigation>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
