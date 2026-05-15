import { useHomeStats } from "@/hooks/user/useHomeStats";
import { SignupModal } from "./modal/SignupModal";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  scrollRef: React.RefObject<HTMLElement | null>;
};

export default function Hero({ scrollRef }: Props) {
  const { data: stats } = useHomeStats();
  const handleClick = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section  className="relative grid md:grid-cols-2 gap-12 items-center px-16 max-md:px-6 py-10">
      <img src="/home-feast-banner.png.png" alt="home-feast-banner" className="absolute object-cover inset-0 w-full h-full -z-10"/>
      
      {/* LEFT */}
      <div>
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-card border text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
          Trusted home food platform
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 leading-tight mb-5">
          Fresh <span className="text-orange-500">homemade</span> meals,
          delivered daily
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md mb-8">
          Connect with verified home cooks near you. Choose daily, weekly, or
          monthly meal plans tailored to your taste.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleClick}
            size="xl"
            className="px-6 cursor-pointer rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:-translate-y-0.5 transition"
          >
            Find cooks nearby
          </Button>

          <SignupModal role="Cook">
            <Button
              size="xl"
              className="px-6 cursor-pointer rounded-xl border border-blue-900 bg-card text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition"
            >
              Become a cook
            </Button>
          </SignupModal>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-10 pt-8 border-t">
          <div>
            <div className="text-2xl font-serif font-bold text-blue-900">
              {stats?.VerifiedCooks || 0}
            </div>
            <div className="text-sm text-gray-500">Home cooks</div>
          </div>

          <div>
            <div className="text-2xl font-serif font-bold text-blue-900">
              {stats?.Subscription || 0}
            </div>
            <div className="text-sm text-gray-500">Happy subscribers</div>
          </div>

          <div>
            <div className="text-2xl font-serif font-bold text-blue-900">
              12 cities
            </div>
            <div className="text-sm text-gray-500">And growing</div>
          </div>
        </div>
      </div>

      {stats?.TopCook && (
        <div className="relative h-[420px] max-md:hidden">
          {/* Main Card */}
          <div className="flex flex-col absolute right-0 top-0 w-80 bg-card rounded-2xl shadow-xl p-5 border z-30">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-3">
              👩‍🍳
            </div>

            <div className="font-semibold">
              {stats?.TopCook?.kitchenName}
            </div>
            <div className="text-xs">
              {stats?.TopCook?.user.name} · {stats?.TopCook?.user.city}
            </div>

            <div className="mt-3 w-fit inline-flex items-center gap-1 bg-foreground/10 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="text-yellow-500">★</span>{" "}
              {stats?.TopCook?.average} · {stats?.TopCook?.totalReviews} Reviews
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {stats?.TopCook?.plans?.map((plan) => (
                <div key={plan.type} className="flex justify-between">
                  <span>
                    {plan?.type[0].toUpperCase() + plan?.type.slice(1)}
                  </span>
                  <span className="text-orange-500 font-semibold">
                    ₹{plan?.price}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/cook-profile/${stats?.TopCook?.user._id}`}
              className="mt-4 w-full text-center bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              View profile & subscribe
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
