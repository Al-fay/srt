import {
  createRootRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import AppSidebarCab from "@/components/app-sidebar-cab";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import RouteLoadingBar from "@/components/route-loading-bar";
import { Toaster } from "@/components/ui/sonner";
import { checkAuth, meService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

function NotFound() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">404 - Page Not Found</h1>
          <p>Halaman yang kamu cari tidak ada.</p>
          <Button asChild className="mt-5">
            <Link to="." className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const isAuthPage = location.pathname.startsWith("/auth");

    const auth = await checkAuth();

    if (!auth.authenticated && !isAuthPage) {
      throw redirect({
        to: "/auth/sign-in",
      });
    }

    if (auth.authenticated && isAuthPage) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const [open, setOpen] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: meService,
  });

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");

    if (saved !== null) {
      setOpen(JSON.parse(saved));
    }
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    localStorage.setItem("sidebar-open", JSON.stringify(value));
  };

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname === "/auth/sign-in") {
    return (
      <ThemeProvider defaultTheme="light" storageKey="surat-theme">
        <Toaster position="top-right" offset="50px" />
        <Outlet />
      </ThemeProvider>
    );
  }

  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="surat-theme">
      <Toaster position="top-right" offset="50px" />
      <RouteLoadingBar />
      <SidebarProvider open={open} onOpenChange={handleOpenChange}>
        {user?.wil_code !== "9000" ? <AppSidebarCab /> : <AppSidebar />}

        <SidebarInset className="min-w-0">
          <AppHeader />
          <main className="min-w-0 flex-1 overflow-x-clip px-10 py-5 bg-slate-200/70 dark:bg-gray-900/10">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
