import { cookies } from "next/headers"
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import { Separator } from "@/components/ui/separator"

// shud cn　パンくずリスト
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ホイクル",
  description: "制作中",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
  return (
    <html lang="ja" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}
          >
            <AppSidebar />
            <main className="min-h-screen w-full flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center relative">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">

                  <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex items-center">
                      <SidebarTrigger />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                              Building Your Application
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className="hidden md:block" />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                    {/* {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} */}
                    <div className="flex gap-5 items-center font-semibold">
                      <ThemeSwitcher />
                    </div>
                  </div>
                </nav>
                <div className="flex w-full flex-col gap-20 max-w-5xl p-5">
                  {children}
                </div>
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
                  <p>©2024　YOHAKUBUNKA, Inc.</p>
                </footer>
              </div>
            </main>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
