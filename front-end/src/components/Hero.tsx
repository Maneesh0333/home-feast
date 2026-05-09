import { SignupModal } from "./modal/SignupModal";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative grid md:grid-cols-2 gap-12 items-center">
      {/* LEFT */}
      <div>
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
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
            size="xl"
            className="px-6 cursor-pointer rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:-translate-y-0.5 transition"
          >
            Find cooks nearby
          </Button>

          <SignupModal role="Cook">
            <Button
              size="xl"
              className="px-6 cursor-pointer rounded-xl border border-blue-900 bg-white text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition"
            >
              Become a cook
            </Button>
          </SignupModal>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-10 pt-8 border-t">
          <div>
            <div className="text-2xl font-serif font-bold text-blue-900">
              1,240+
            </div>
            <div className="text-sm text-gray-500">Home cooks</div>
          </div>

          <div>
            <div className="text-2xl font-serif font-bold text-blue-900">
              18,000+
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

      {/* RIGHT */}
      <div className="relative h-[420px]">
        {/* Main Card */}
        <div className="absolute right-0 top-0 w-80 bg-white rounded-2xl shadow-xl p-5 border z-30">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-3">
            👩‍🍳
          </div>

          <div className="font-semibold text-gray-900">Meera's Kitchen</div>
          <div className="text-xs text-gray-500">
            South Indian specialist · Thrissur
          </div>

          <div className="mt-3 inline-flex items-center gap-1 text-black bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="text-yellow-500">★</span> 4.8 · 340 subscribers
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-black">Sambar rice + papad</span>
              <span className="text-orange-500 font-semibold">₹90</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Idli (4) + chutney</span>
              <span className="text-orange-500 font-semibold">₹70</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Fish curry + rice</span>
              <span className="text-orange-500 font-semibold">₹120</span>
            </div>
          </div>

          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
            View profile & subscribe
          </button>
        </div>

        {/* Floating Card 1 */}
        <div className="absolute bottom-10 left-0 w-52 bg-blue-900 text-white rounded-2xl p-4 shadow-lg z-20">
          <div className="text-2xl font-serif font-bold">₹24.8k</div>
          <div className="text-xs opacity-70">Monthly earnings</div>
          <div className="text-xs opacity-50 mt-2">↑ 18% from last month</div>
        </div>

        {/* Floating Card 2 */}
        <div className="absolute top-16 left-6 w-44 bg-white rounded-2xl p-4 shadow-md border z-10">
          <div className="text-xs text-black font-semibold mb-2">
            Live activity
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Anjali subscribed
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Rahul renewed
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-900 rounded-full"></span>3 new
              reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
