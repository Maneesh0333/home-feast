import Link from "next/link";
import { SignupModal } from "../modal/SignupModal";

export default function Footer() {
  return (
    <>
      <footer className="bg-blue-900 px-16 max-md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-3 md:col-span-2">
            <div className="font-playfair text-3xl font-black text-white">
              Home<span className="text-orange-500">Feast</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/45 max-w-xs">
              Connecting home cooks with customers who value home food. Built
              with MERN. Powered by community.
            </p>
          </div>

          {/* Platform */}
          <FooterColumn
            title="Platform"
            links={[
              { label: "Browse Cooks", link: "/#search" },
              { label: "How It Works", link: "" },
            ]}
          />

          {/* Artisans */}
          <FooterColumn
            title="Cooks"
            links={[
              { label: "Join as Cook", link: "/auth" },
              { label: "Success Stories", link: "" },
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", link: "/#about" },
              { label: "Contact", link: "" },
            ]}
          />
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-blue-900 border-t border-white/5 px-6 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-center">
        <div className="text-xs text-white/25 text-center">
          © 2026 HomeFeast. Empowering home cooks.
        </div>
      </div>
    </>
  );
}

/* Reusable Column Component */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; link: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-3">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.label === "Join as Cook" ? (
              <SignupModal role="Cook">
                <span className="text-sm cursor-pointer text-white/40 transition hover:text-white/20">
                  {link.label}
                </span>
              </SignupModal>
            ) : (
              <Link
                href={link.link}
                className="text-sm text-white/40 transition hover:text-white/20"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
