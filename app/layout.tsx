import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";
import { ProgramPersistenceProvider } from "@/components/program/ProgramPersistenceProvider";

export const metadata: Metadata = {
  title: "Dynasty Blueprint HQ",
  description: "A premium football operations center for Dynasty Mode decisions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProgramPersistenceProvider>
          <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="min-w-0">
              <TopNavigation />
              <main className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                <div className="mx-auto w-full max-w-7xl">{children}</div>
              </main>
            </div>
          </div>
        </ProgramPersistenceProvider>
      </body>
    </html>
  );
}
