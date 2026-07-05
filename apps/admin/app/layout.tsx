import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { ThemeProvider } from "../lib/theme";
import { SidebarProvider } from "../lib/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridian — Study Abroad OS",
  description: "Education agency management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full">
        <ThemeProvider>
          <SidebarProvider>
            <div
              className="flex h-screen w-full overflow-hidden"
              style={{ background: "var(--c-bg)" }}
            >
              <Sidebar />
              <div className="flex flex-1 flex-col min-w-0 h-full">
                <Header />
                <main
                  className="flex-1 overflow-y-auto"
                  style={{ background: "var(--c-bg)" }}
                >
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
