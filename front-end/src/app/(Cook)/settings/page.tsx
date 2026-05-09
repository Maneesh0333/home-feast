import Header from "@/components/shared/Header";

export default function Settings() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-6 pb-6 space-y-6">
      <Header
        title="Settings"
        description="Manage settings"
      />
    </div>
  );
}
