import Image from "next/image";

export default function Home() {
  return (
    <div class="hero">
      <div class="hero-left">
        <div class="hero-eyebrow">Trusted home food platform</div>
        <h1>
          Fresh <em>homemade</em> meals, delivered daily
        </h1>
        <p>
          Connect with verified home cooks near you. Choose daily, weekly, or
          monthly meal plans tailored to your taste.
        </p>
        <div class="hero-ctas">
          <button
            class="btn-large primary"
            onclick="document.querySelector('.search-section').scrollIntoView({behavior:'smooth'})"
          >
            Find cooks nearby
          </button>
          <button
            class="btn-large outline"
            onclick="openModal('cook-signup-modal')"
          >
            Become a cook
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <div class="n">1,240+</div>
            <div class="l">Home cooks</div>
          </div>
          <div class="stat">
            <div class="n">18,000+</div>
            <div class="l">Happy subscribers</div>
          </div>
          <div class="stat">
            <div class="n">12 cities</div>
            <div class="l">And growing</div>
          </div>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-card-stack">
          <div class="hcard hcard-main">
            <div class="cook-avatar-lg">👩‍🍳</div>
            <div class="cook-card-name">Meera's Kitchen</div>
            <div class="cook-card-sub">South Indian specialist · Thrissur</div>
            <div class="rating-pill">
              <span class="star">★</span> 4.8 · 340 subscribers
            </div>
            <div class="menu-preview">
              <div class="menu-row">
                <span class="name">Sambar rice + papad</span>
                <span class="price">₹90</span>
              </div>
              <div class="menu-row">
                <span class="name">Idli (4) + coconut chutney</span>
                <span class="price">₹70</span>
              </div>
              <div class="menu-row">
                <span class="name">Kerala fish curry + rice</span>
                <span class="price">₹120</span>
              </div>
            </div>
            <button
              class="subscribe-btn-full"
              style="margin-top:14px"
              onclick="showProfile()"
            >
              View profile &amp; subscribe
            </button>
          </div>
          <div class="hcard hcard-float1">
            <div class="float-stat">
              <div class="fn">₹24.8k</div>
              <div class="fl">Monthly earnings</div>
              <div class="fb">↑ 18% from last month</div>
            </div>
          </div>
          <div class="hcard hcard-float2">
            <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:10px">
              Live activity
            </div>
            <div class="mini-list">
              <div class="mini-row">
                <div class="mini-dot dot-green"></div>
                <span style="font-size:12px;color:var(--text2)">
                  Anjali subscribed (weekly)
                </span>
              </div>
              <div class="mini-row">
                <div class="mini-dot dot-brand"></div>
                <span style="font-size:12px;color:var(--text2)">
                  Rahul renewed plan
                </span>
              </div>
              <div class="mini-row">
                <div class="mini-dot dot-navy"></div>
                <span style="font-size:12px;color:var(--text2)">
                  3 new reviews added
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
