import { UtensilsCrossed, ShieldCheck, ChefHat } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function AboutUs() {
  const highlights = [
    {
      title: "Fresh Home-Style Meals",
      description:
        "HomeFeast connects users with trusted home cooks and tiffin providers serving freshly prepared, hygienic, and comforting meals every day.",
      icon: <UtensilsCrossed className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "Verified & Reliable",
      description:
        "Every cook and service provider is carefully verified to ensure quality, hygiene, consistency, and a safe food experience for customers.",
      icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
    },
    {
      title: "Supporting Local Kitchens",
      description:
        "HomeFeast empowers home chefs and small food businesses by helping them reach more customers and build sustainable income opportunities.",
      icon: <ChefHat className="w-10 h-10 text-green-600" />,
    },
  ];

  return (
    <section id="about" className="px-16 max-md:px-6 py-14">
      {/* Header */}
      <p className="text-xs tracking-[0.3em] font-semibold uppercase text-blue-600 mb-3">
        About HomeFeast
      </p>

      <h2 className="font-playfair text-3xl md:text-5xl font-black text-blue-900 leading-tight max-w-3xl">
        Bringing Homemade Comfort{" "}
        <em className="italic text-orange-500">to Your Everyday Meals</em>
      </h2>

      <p className="mt-6 max-w-3xl text-gray-600 leading-relaxed text-sm md:text-base">
        HomeFeast is a web-based platform designed to make healthy, home-style
        food accessible to everyone. From students and working professionals to
        elderly individuals, we connect users with trusted home cooks and tiffin
        service providers offering fresh, hygienic, and affordable meals through
        flexible daily, weekly, and monthly subscriptions.
      </p>

      {/* Highlights */}
      <div className="grid gap-6 mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item, idx) => (
          <Card key={idx} className="p-6">
            <CardHeader>
              <CardTitle>
                <div>{item.icon}</div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-bold">
                  {item.title}
                </h3>
              </CardTitle>
              <CardDescription className="mt-3">{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
