import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useLogout, useGetCurrentUser } from "@workspace/api-client-react";
import { LayoutDashboard, FolderKanban, Settings, CreditCard, User, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetCurrentUser();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "EMPLOYEE")) {
      setLocation("/employee/login");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) return <div className="min-h-screen bg-background" />;
  if (!user || user.role !== "EMPLOYEE") return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/employee/login");
      }
    });
  };

  const navItems = [
    { href: "/employee", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/employee/projects", icon: FolderKanban, label: "My Projects" },
    { href: "/employee/payout-settings", icon: Settings, label: "Payout Settings" },
    { href: "/employee/payment-history", icon: CreditCard, label: "Payment History" },
    { href: "/employee/account", icon: User, label: "Account" },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-extrabold text-xl tracking-tighter">Trivinex<span className="text-primary">.Team</span></span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map(item => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/employee");
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-3 px-2 truncate">{user.email}</div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {logout.isPending ? "Logging out…" : "Logout"}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex bg-muted/10 selection:bg-primary/20">
      <aside className="w-72 border-r border-border/50 bg-card flex flex-col hidden lg:flex sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 lg:hidden">
          <span className="font-extrabold text-lg">Trivinex.Team</span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
