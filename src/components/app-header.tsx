import { ModeToggle } from "./mode-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { ChevronDown, LogOutIcon, UserRound } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { meService, signOutService } from "@/services/auth.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: meService,
  });

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-full items-center">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </header>
    );
  }

  const user = data?.data;

  const initial = user?.pass_name
    ? user.pass_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleSignOut = async () => {
    try {
      await signOutService();

      queryClient.clear();
    } catch (error: any) {
      toast.error("Logout gagal", {
        description: error?.message || "Terjadi kesalahan saat logout",
      });
    } finally {
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      navigate({
        to: "/auth/sign-in",
      });
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50 h-16 w-full
        border-b border-slate-200/80
        bg-white/90
        px-4
        backdrop-blur-xl
        dark:border-slate-800/80
        dark:bg-slate-950/90
      "
    >
      <div className="flex h-full items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger
            className="
              h-9 w-9 rounded-xl
              text-slate-600
              transition-all
              hover:bg-indigo-50
              hover:text-indigo-600
              dark:text-slate-400
              dark:hover:bg-indigo-950/40
              dark:hover:text-indigo-400
            "
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <ModeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                  h-11
                  rounded-xl
                  px-2
                  transition-all
                  hover:bg-slate-100
                  dark:hover:bg-slate-900
                "
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 ring-2 ring-indigo-100 dark:ring-indigo-900">
                    <AvatarFallback
                      className="
                        bg-gradient-to-br
                        from-indigo-500
                        via-violet-500
                        to-purple-600
                        font-semibold
                        text-white
                      "
                    >
                      {initial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[150px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {user?.pass_name || "User"}
                    </p>

                    <p className="max-w-[150px] truncate text-[11px] text-slate-400">
                      {user?.lv_user || "Pengguna"}
                    </p>
                  </div>

                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="
                w-56
                rounded-xl
                border-slate-200
                bg-white/95
                p-2
                shadow-xl
                shadow-slate-200/50
                backdrop-blur-xl
                dark:border-slate-800
                dark:bg-slate-950/95
                dark:shadow-black/20
              "
            >
              {/* User Info */}
              <div className="mb-2 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className="
                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-600
                      font-semibold
                      text-white
                    "
                  >
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user?.pass_name || "User"}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {user?.lv_user || "Pengguna"}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="
                    cursor-pointer
                    rounded-lg
                    py-2.5
                    text-slate-600
                    focus:bg-indigo-50
                    focus:text-indigo-600
                    dark:text-slate-300
                    dark:focus:bg-indigo-950/40
                    dark:focus:text-indigo-400
                  "
                >
                  <Link to="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="
                    cursor-pointer
                    rounded-lg
                    py-2.5
                    text-red-500
                    focus:bg-red-50
                    focus:text-red-600
                    dark:text-red-400
                    dark:focus:bg-red-950/40
                    dark:focus:text-red-400
                  "
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
