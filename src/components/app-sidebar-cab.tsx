import {
  Home,
  FileText,
  Inbox,
  Send,
  ChevronRight,
  BellOffIcon,
  Car,
  Verified,
  StickyNote,
  Forward,
  Mailbox,
  PlaneTakeoffIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const menu = [
  {
    title: "Beranda",
    url: "/",
    icon: Home,
  },
];

const arsip = [
  {
    title: "Arsip Surat Masuk",
    url: "/arsip-surat-masuk/",
    icon: Mailbox,
  },
  {
    title: "Arsip Surat Keluar",
    url: "/arsip-surat-keluar/",
    icon: PlaneTakeoffIcon,
  },
];

const suratKeluarEksternalMenu = [
  { title: "Pemberitahuan Penolakan", url: "/cab/surat-keluar/penolakan/" },
  { title: "Surat Penghapusan Roya", url: "/cab/surat-keluar/hapus-roya/" },
  { title: "Surat Permohonan Appraisal", url: "/cab/surat-keluar/appraisal/" },
  { title: "Surat Panggilan Anggota", url: "/cab/surat-keluar/panggilan-agt/" },
  { title: "Surat Keluar Lainnya", url: "/cab/surat-keluar/lainnya/" },
];

const STORAGE_KEY = "sidebar-collapse-state";

function loadState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveState(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const KEY = {
  surat: "surat",
  keluar: "surat-keluar",
  tugas: "surat-tugas",
  sk: "surat-sk",
  user: "admin",
};

export default function AppSidebarCab() {
  const location = useLocation();

  const [openState, setOpenState] = useState<Record<string, boolean>>(() =>
    loadState(),
  );

  useEffect(() => {
    saveState(openState);
  }, [openState]);

  useEffect(() => {
    const path = location.pathname;

    setOpenState((prev) => {
      const next = { ...prev };

      if (path.startsWith("/surat")) next[KEY.surat] = true;
      if (path.startsWith("/surat-keluar")) next[KEY.keluar] = true;
      if (path.startsWith("/surat-tugas")) next[KEY.tugas] = true;
      if (path.startsWith("/surat-sk")) next[KEY.sk] = true;
      if (path.startsWith("/admin")) next[KEY.user] = true;

      return next;
    });
  }, [location.pathname]);

  return (
    <Sidebar>
      <div className="flex h-16 items-center border-b border-slate-200/80 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 shadow-sm ring-1 ring-white/20 backdrop-blur">
            <FileText className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Surat
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-indigo-100">
              Manajemen Surat
            </p>
          </div>
        </div>
      </div>

      <SidebarContent className="bg-slate-50/80 text-sm dark:bg-slate-950">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                  >
                    <Link
                      to={item.url}
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible
                open={openState[KEY.surat] ?? false}
                onOpenChange={(val) =>
                  setOpenState((prev) => ({
                    ...prev,
                    [KEY.surat]: val,
                  }))
                }
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild className="hover:bg-secondary">
                    <SidebarMenuButton className="group transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                      <FileText />
                      <span>Buat Surat</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                <CollapsibleContent>
                  <SidebarMenu className="ml-5">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-secondary/60"
                      >
                        <Link
                          to="/cab/permohonan-disposisi"
                          activeProps={{
                            className:
                              "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                          }}
                        >
                          <Send />
                          <span>Permohonan Disposisi</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-secondary/60"
                      >
                        <Link
                          to="/surat-keluar/internal/create"
                          activeProps={{
                            className:
                              "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                          }}
                        >
                          <StickyNote />
                          <span>Surat Keluar Internal</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Collapsible
                      open={openState[KEY.keluar] ?? false}
                      onOpenChange={(val) =>
                        setOpenState((prev) => ({
                          ...prev,
                          [KEY.keluar]: val,
                        }))
                      }
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="group transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                            <Inbox />
                            <span>Surat Keluar Eksternal</span>
                            <ChevronRight className="mr-3 ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenu className="ml-5">
                            {suratKeluarEksternalMenu.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  asChild
                                  className="hover:bg-secondary/60"
                                >
                                  <Link
                                    to={item.url}
                                    activeProps={{
                                      className:
                                        "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                                    }}
                                  >
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-secondary/60"
                      >
                        <Link
                          to="/cab/surat-tugas"
                          activeProps={{
                            className:
                              "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                          }}
                        >
                          <Car />
                          <span>Surat Tugas</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-secondary/60"
                      >
                        <Link
                          to="/cab/surat-pengantar"
                          activeProps={{
                            className:
                              "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                          }}
                        >
                          <Forward />
                          <span>Surat Pengantar</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                >
                  <Link
                    to="/cab/persetujuan-surat"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                    }}
                  >
                    <Verified />
                    <span>Persetujuan Surat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                >
                  <Link
                    to="/cab/disposisi-surat"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                    }}
                  >
                    <BellOffIcon />
                    <span>Disposisi Surat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {arsip.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                  >
                    <Link
                      to={item.url}
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300 dark:ring-indigo-900/50",
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
