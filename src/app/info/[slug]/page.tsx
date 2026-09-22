import Link from "next/link";
import { notFound } from "next/navigation";

type Section = { heading: string; body: string[] };
type PageContent = { label: string; title: string; intro: string; sections: Section[] };

const pages: Record<string, PageContent> = {
  about: {
    label: "ABOUT CLOUDCOMPASS", title: "Cloud decisions should be understandable.",
    intro: "CloudCompass is an independent infrastructure planning prototype that turns product context into clear, explainable cloud options.",
    sections: [
      { heading: "What we are building", body: ["Instead of asking you to understand every instance family first, CloudCompass starts with your service, technology stack, audience, traffic, and priorities.", "It then presents several infrastructure options with estimated cost, trade-offs, and plain-language reasons."] },
      { heading: "Who it is for", body: ["Founders, product managers, junior developers, and small teams evaluating cloud infrastructure before speaking with a specialist."] },
      { heading: "Current scope", body: ["AWS is the primary provider in this prototype. Support for Google Cloud, Microsoft Azure, Naver Cloud Platform, and Vultr is planned but not yet active."] },
    ],
  },
  guides: {
    label: "LEARNING CENTER", title: "Cloud infrastructure, without the fog.",
    intro: "Short explanations for the decisions CloudCompass makes. These guides are educational and do not replace workload testing.",
    sections: [
      { heading: "Virtual machines, containers, or serverless?", body: ["Virtual machines offer control, containers package applications consistently, and serverless products reduce operations for event-driven or variable traffic. The best option depends as much on your team as your traffic."] },
      { heading: "Why database memory matters", body: ["Databases use memory to cache frequently accessed data. Too little memory can cause repeated disk access and slower queries, even when CPU usage looks low."] },
      { heading: "Why estimates differ from your bill", body: ["Cloud bills can include storage, data transfer, load balancers, backups, monitoring, taxes, and discounts. An instance price is only one part of the architecture."] },
      { heading: "When to choose high availability", body: ["Multi-zone deployments cost more but reduce the impact of a single data-center failure. They are usually justified when downtime directly affects revenue, safety, or contractual obligations."] },
    ],
  },
  privacy: {
    label: "LEGAL · DRAFT", title: "Privacy Policy",
    intro: "Effective September 22, 2026. This draft describes the current prototype and must be reviewed before accounts, analytics, advertising, or contact forms are enabled.",
    sections: [
      { heading: "Information currently processed", body: ["CloudCompass currently has no user accounts and does not intentionally collect names, email addresses, or payment details. Configuration choices are processed in your browser and are not submitted to a CloudCompass database.", "Our hosting provider may process IP addresses, request metadata, security events, and diagnostic logs to deliver and protect the site."] },
      { heading: "Cookies and advertising", body: ["The current prototype does not intentionally set advertising cookies. If Google AdSense or analytics is enabled, this policy will be updated before launch to explain Google and other vendors, advertising cookies, personalization choices, retention, and opt-out methods."] },
      { heading: "International visitors", body: ["Before serving personalized advertising in the EEA, United Kingdom, or Switzerland, CloudCompass will implement an appropriate consent mechanism where required."] },
      { heading: "Contact and changes", body: ["Privacy questions can be submitted through the project contact page. Material changes will be posted here with an updated effective date."] },
    ],
  },
  terms: {
    label: "LEGAL · DRAFT", title: "Terms of Use",
    intro: "These draft terms govern use of the CloudCompass prototype. They require operator review and identification before commercial launch.",
    sections: [
      { heading: "Informational service", body: ["CloudCompass provides automated estimates and educational comparisons. It does not provide guaranteed architecture, financial, security, legal, or availability advice."] },
      { heading: "Your responsibility", body: ["You must verify current provider documentation, pricing, compatibility, quotas, regional availability, security requirements, and workload performance before purchasing or deploying cloud resources."] },
      { heading: "Acceptable use", body: ["Do not interfere with the service, attempt unauthorized access, submit unlawful content, or use automated access in a way that degrades availability for others."] },
      { heading: "Availability and liability", body: ["The prototype is provided as available without warranties. Recommendations may be incomplete, outdated, or unsuitable for a particular workload. To the extent permitted by law, the operator is not liable for cloud charges or decisions made solely from these estimates."] },
    ],
  },
  contact: {
    label: "CONTACT", title: "Questions, corrections, or ideas?",
    intro: "CloudCompass is an early public prototype. Reports about inaccurate recommendations and confusing explanations are especially useful.",
    sections: [
      { heading: "Public feedback", body: ["Open an issue in the public GitHub repository: github.com/audwl/cloudcompass/issues", "Do not include passwords, cloud credentials, private architecture diagrams, customer data, or other sensitive information in a public issue."] },
      { heading: "Security and privacy", body: ["A private operator email must be added here before commercial launch. Until then, do not submit confidential security or privacy reports through public channels."] },
      { heading: "Response expectations", body: ["This is currently an independently operated prototype and does not provide guaranteed response times or emergency infrastructure support."] },
    ],
  },
  disclaimer: {
    label: "IMPORTANT NOTICE", title: "Independent service and pricing disclaimer",
    intro: "Read this notice before using a CloudCompass recommendation to make a purchasing or production decision.",
    sections: [
      { heading: "No provider affiliation", body: ["CloudCompass is an independent project. It is not affiliated with, endorsed by, sponsored by, or an official service of Amazon Web Services, Google Cloud, Microsoft Azure, Naver Cloud Platform, or Vultr.", "Provider names and product names are used in plain text only to identify and compare the relevant services. All trademarks belong to their respective owners."] },
      { heading: "Estimated pricing", body: ["Prices shown are illustrative estimates, not quotes. Actual charges vary by region, operating system, purchase model, currency, taxes, data transfer, storage, backups, support, discounts, and usage patterns."] },
      { heading: "Estimated performance", body: ["vCPU and memory figures do not by themselves predict application performance. CPU architecture, sustained utilization, storage, network throughput, runtime behavior, and application design can materially change results."] },
      { heading: "Verify before deployment", body: ["Review the provider's current calculator and documentation, test with a representative workload, and obtain qualified review for security-sensitive or business-critical systems."] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return <main className="infoPage">
    <nav className="nav shell"><Link className="brand" href="/"><span className="brandMark">C</span><span>CloudCompass</span></Link><div className="navLinks"><Link href="/info/about">About</Link><Link href="/info/guides">Guides</Link><Link href="/info/contact">Contact</Link></div><Link className="navCta" href="/">Open advisor <span>→</span></Link></nav>
    <header className="infoHero shell"><p className="eyebrow"><span />{page.label}</p><h1>{page.title}</h1><p>{page.intro}</p>{page.label.includes("DRAFT") && <div className="draftNotice">This is a product draft, not legal advice. Add the operator identity and obtain appropriate review before commercial launch.</div>}</header>
    <div className="infoLayout shell"><aside>{Object.entries(pages).map(([key, item]) => <Link key={key} className={slug === key ? "active" : ""} href={`/info/${key}`}>{item.title}</Link>)}</aside><article>{page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => paragraph.includes("github.com/") ? <p key={paragraph}><a href="https://github.com/audwl/cloudcompass/issues" target="_blank" rel="noreferrer">github.com/audwl/cloudcompass/issues ↗</a></p> : <p key={paragraph}>{paragraph}</p>)}</section>)}<p className="legalFooter">Last updated September 22, 2026 · CloudCompass prototype</p></article></div>
  </main>;
}
