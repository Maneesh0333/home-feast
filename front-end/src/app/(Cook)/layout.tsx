import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function CookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full antialiased flex flex-col">
      <SidebarProvider>
        <AppSidebar role="Cook" />

        <main className="flex-1 flex flex-col p-6 gap-2">
          <header className="flex justify-between">
            <SidebarTrigger />
            <ModeToggle />
          </header>

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
