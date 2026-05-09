import Subscribers from "@/components/cook/Subscribers";
import Header from "@/components/shared/Header";


export default function Subscriber() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header
        title="Subscribers"
        description="All your active subscribers"
      />

      <Subscribers />
    </div>
  );
}
