import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-full flex flex-1">
        <AppSidebar role="Admin" />
        
        <main className="flex-1 flex flex-col p-6 gap-2">
          <header className="flex justify-between ">
            <SidebarTrigger size="xllite" />
            <ModeToggle />
          </header>

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}