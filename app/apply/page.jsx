// app/apply/page.jsx

export const metadata = {
  title: "Apply to Join the Barracks Media Network",
  description:
    "Learn the benefits of joining the Barracks Media Network and submit your application.",
};

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfmKm2Pq0TmS1hV6tOc1wuLfZzEAPll9CwnVSABvi3UwANkTw/viewform?usp=header";

const EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfmKm2Pq0TmS1hV6tOc1wuLfZzEAPll9CwnVSABvi3UwANkTw/viewform?embedded=true";

export default function ApplyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12">
      {/* HERO */}
      <section className="container-card p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Apply to Join the Barracks Media Network
        </h1>

        <p className="mt-3 text-base md:text-lg opacity-90 max-w-3xl">
          Barracks Media Network is a curated podcast and media ecosystem built
          for creators who value integrity, impact, and long-term growth. Keep
          full ownership of your show while gaining access to discovery, analytics,
          and network promotion.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#apply"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-white/90 text-black hover:bg-white transition"
          >
            Jump to Application
          </a>

          <a
            href={FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/20 hover:bg-white/5 transition"
          >
            Open Form in New Tab
          </a>

          <a
            href="#terms"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/20 hover:bg-white/5 transition"
          >
            Read Terms
          </a>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="mt-10 grid gap-6">
        <div className="container-card p-7 md:p-8">
          <h2 className="text-2xl font-bold">Why Join the Network?</h2>
          <p className="mt-2 opacity-90 max-w-3xl">
            We’re building a network that audiences and sponsors can trust.
            This page explains what you get, what’s expected, and how to apply.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Keep Full Ownership & Creative Control"
            body="You retain full ownership and intellectual property rights to your podcast and content. Barracks Media does not take ownership of your show."
          />
          <FeatureCard
            title="Professional, Values-Driven Network"
            body="Barracks Media is built on purpose, integrity, and impact. Explicit sexual content or pornography is not accepted. We review each show for alignment and fit."
          />
          <FeatureCard
            title="Real Growth Support (No Hype)"
            body="We don’t promise instant sponsorships. We provide infrastructure: cross-promotion, discovery, and systems that help shows grow over time."
          />
          <FeatureCard
            title="Network Benefits (Eligibility-Based)"
            body="Accepted shows may be eligible for cross-promotion, website listing, social promotion, branded releases, AI discovery tools, and potential sponsorship opportunities. Benefits are not guaranteed."
          />
          <FeatureCard
            title="Simple Network Credit"
            body='Accepted shows agree to include a brief verbal acknowledgment such as: “This show is part of the Barracks Media Network.” No logos or heavy-handed branding required.'
          />
          <FeatureCard
            title="Freedom to Leave"
            body="You may exit the network at any time unless you are actively under a sponsor agreement arranged through Barracks Media. Once obligations are fulfilled, you may withdraw without penalty."
          />
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mt-10 container-card p-7 md:p-8">
        <h2 className="text-2xl font-bold">Who This Is For</h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-3 opacity-90">
          <li className="flex gap-2">
            <span className="opacity-70">•</span>
            Podcasters producing consistent, meaningful content
          </li>
          <li className="flex gap-2">
            <span className="opacity-70">•</span>
            Creators who want growth without giving up control
          </li>
          <li className="flex gap-2">
            <span className="opacity-70">•</span>
            Shows that value professionalism and credibility
          </li>
          <li className="flex gap-2">
            <span className="opacity-70">•</span>
            Voices aligned with purpose, education, service, or impact
          </li>
        </ul>
      </section>

      {/* APPLY */}
      <section id="apply" className="mt-10 container-card p-7 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Apply to Join</h2>
            <p className="mt-2 opacity-90 max-w-3xl">
              Submitting an application does not guarantee acceptance. Each show
              is reviewed individually based on quality, intent, alignment, and
              overall fit within the network.
            </p>
          </div>

          <a
            href={FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/20 hover:bg-white/5 transition"
          >
            Open Form in New Tab
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          {/* Google Form Embed */}
          <iframe
            src={EMBED_URL}
            title="Barracks Media Network Application Form"
            width="100%"
            height="1650"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            loading="lazy"
          >
            Loading…
          </iframe>
        </div>

        <p className="mt-4 text-sm opacity-70">
          If the form doesn’t load, use the “Open Form in New Tab” button above.
        </p>
      </section>

      {/* TERMS */}
      <section id="terms" className="mt-10 container-card p-7 md:p-8">
        <h2 className="text-2xl font-bold">
          Barracks Media Network – Application Terms &amp; Conditions
        </h2>
        <p className="mt-2 opacity-90">
          By submitting an application to join the Barracks Media Network, you
          acknowledge and agree to the following terms:
        </p>

        <div className="mt-6 space-y-5 opacity-90 leading-relaxed">
          <Term
            n="1"
            title="Professional Standards & Content Guidelines"
            body={[
              "Barracks Media is a professional media network built on purpose, integrity, and impact.",
              "Shows that focus on or promote sexual content, explicit material, or pornography will not be accepted.",
              "All content must align with our mission, values, and moral compass.",
              "Barracks Media reserves the right to decline any application that does not meet these standards.",
            ]}
          />
          <Term
            n="2"
            title="Application & Acceptance"
            body={[
              "Submitting an application does not guarantee approval.",
              "Each show is reviewed individually based on quality, intent, alignment, and overall fit within the network.",
              "Barracks Media retains full discretion in approving or denying any application.",
            ]}
          />
          <Term
            n="3"
            title="Ownership & Rights"
            body={[
              "Joining the Barracks Media Network does not transfer ownership or rights of your show.",
              "You retain full creative control and intellectual property rights to your podcast and all associated content.",
              "Barracks Media does not claim ownership of your show by virtue of network membership.",
            ]}
          />
          <Term
            n="4"
            title="Monetization & Sponsorships"
            body={[
              "No guarantees are made regarding sponsorships, monetization, or revenue.",
              "Any sponsorships or financial opportunities are based on a show’s performance, audience growth, and marketability.",
              "Participation in the network does not constitute an employment or compensation agreement.",
            ]}
          />
          <Term
            n="5"
            title="Removal & Compliance"
            body={[
              "Barracks Media reserves the right to remove any show from the network at any time for content or conduct that violates these terms or conflicts with our mission and values.",
              "Removal may occur without financial obligation or liability.",
            ]}
          />
          <Term
            n="6"
            title="Network Benefits"
            body={[
              "Accepted shows may be eligible for:",
              "Cross-promotion within the network",
              "Potential sponsorship opportunities",
              "AI-powered discovery and growth assistance",
              "Listing on the Barracks Media website",
              "Social media promotion and branded content releases",
              "These benefits are part of the network ecosystem and are not guaranteed.",
            ]}
          />
          <Term
            n="7"
            title="Network Attribution"
            body={[
              "Accepted shows agree to include a brief verbal acknowledgment of the Barracks Media Network within their program.",
              "This does not require: on-screen logos, “Created by” or “Presented by” branding, or visual signage/overlays.",
              "A simple spoken credit such as: “This show is part of the Barracks Media Network.” or “Proud member of the Barracks Media Network.” is sufficient.",
            ]}
          />
          <Term
            n="8"
            title="Content Responsibility"
            body={[
              "Creators are solely responsible for the accuracy, legality, and originality of their content. Barracks Media assumes no liability for statements, claims, or opinions made on any show.",
            ]}
          />
          <Term
            n="9"
            title="Distribution Rights (Non-Exclusive)"
            body={[
              "By joining, creators grant Barracks Media a non-exclusive right to feature, promote, and distribute their show within the network ecosystem, including the website, social platforms, and AI discovery tools.",
              "This does not restrict creators from distributing their show elsewhere.",
            ]}
          />
          <Term
            n="10"
            title="Professional Conduct"
            body={[
              "Creators agree to conduct themselves in a professional manner when representing the network publicly.",
              "Harassment, hate speech, illegal activity, or behavior that damages the reputation of Barracks Media may result in immediate removal.",
            ]}
          />
          <Term
            n="11"
            title="Program Changes"
            body={[
              "Barracks Media reserves the right to update network policies, benefits, and operational structure as the network evolves. Members will be notified of material changes.",
            ]}
          />
          <Term
            n="12"
            title="Active Participation & Content Release"
            body={[
              "The Barracks Media Network is an active, growth-focused platform. Members are expected to remain engaged and consistently produce content.",
              "Shows must maintain a reasonable and ongoing release schedule.",
              "Extended inactivity or failure to publish new episodes without communication may result in removal.",
              "Barracks Media reserves the right to remove any show that becomes dormant for a prolonged period.",
            ]}
          />
          <Term
            n="13"
            title="RSS Feed Integration & Analytics"
            body={[
              "Accepted shows agree to transition their podcast to a Barracks Media–managed RSS feed for network integration and analytics at no cost to the creator.",
              "This is required so Barracks Media can: track downloads, listens, and performance metrics; provide accurate analytics for growth and discovery; support network-wide sponsorships and advertising opportunities; represent your show properly to partners and advertisers.",
              "Important clarifications: RSS integration does not transfer ownership of your show. You retain full creative control and all intellectual property rights. Barracks Media will not alter episode content without consent. You remain free to distribute your show on any platform of your choosing.",
              "This requirement exists solely to enable accurate tracking, promotion, and monetization opportunities across the Barracks Media ecosystem.",
            ]}
          />
          <Term
            n="14"
            title="Voluntary Exit"
            body={[
              "Creators may remove their show from the Barracks Media Network at any time, provided they are not actively bound by a sponsorship or advertising agreement facilitated through Barracks Media.",
              "If a show is under contract with a sponsor arranged by Barracks Media, the creator agrees to fulfill the terms of that agreement before exiting.",
              "Once all obligations are completed, the creator may withdraw without penalty.",
              "Upon exit, Barracks Media will remove the show from its website, discovery tools, and promotional systems.",
              "By submitting your application, you confirm that you have read, understood, and agree to these Terms & Conditions.",
            ]}
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-10 container-card p-7 md:p-8">
        <h2 className="text-xl font-bold">Ready?</h2>
        <p className="mt-2 opacity-90 max-w-3xl">
          If your show is aligned with purpose, professionalism, and long-term growth,
          we’d love to review your application.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a
            href="#apply"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-white/90 text-black hover:bg-white transition"
          >
            Apply Now
          </a>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/20 hover:bg-white/5 transition"
          >
            Open Form in New Tab
          </a>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="container-card p-7">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 opacity-90 leading-relaxed">{body}</p>
    </div>
  );
}

function Term({ n, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/0 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="min-w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-sm font-semibold opacity-90">
          {n}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="mt-2 space-y-2">
            {body.map((line, idx) => (
              <li key={idx} className="opacity-90">
                {line.startsWith("Accepted shows may be eligible for:") ? (
                  <span className="font-semibold">{line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
