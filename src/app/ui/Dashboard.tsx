"use client";

import { useMemo, useState } from "react";

type Service = "Compute" | "Database" | "Search" | "Cache";
type Locale = "en" | "ko";
type Focus = "cost" | "balanced" | "performance" | "reliability";
type Provider = "AWS" | "GCP" | "Azure" | "NCP" | "Vultr";

const workloadTypes = ["Web / API", "E-commerce", "Community", "SaaS", "AI / Data", "Game / Realtime"];
const languages = ["Java / Kotlin", "JavaScript / TypeScript", "Python", "Go", ".NET", "PHP"];
const frameworks: Record<string, string[]> = {
  "Java / Kotlin": ["Spring Boot", "Ktor", "Other"],
  "JavaScript / TypeScript": ["Next.js", "NestJS", "Express"],
  Python: ["FastAPI", "Django", "Flask"], Go: ["Gin", "Echo", "Standard library"],
  ".NET": ["ASP.NET Core", "Blazor", "Other"], PHP: ["Laravel", "Symfony", "Other"],
};
const regions = ["South Korea", "Asia Pacific", "North America", "Europe", "Global"];

const services: Record<Service, { caption: string; mark: string; products: string[] }> = {
  Compute: { caption: "Run your application", mark: "▣", products: ["EC2", "ECS on Fargate", "EKS", "Lambda"] },
  Database: { caption: "Store relational data", mark: "◉", products: ["Aurora PostgreSQL", "RDS PostgreSQL", "RDS MySQL", "Aurora Serverless v2"] },
  Search: { caption: "Index & analyze", mark: "⌕", products: ["OpenSearch Managed", "OpenSearch Serverless", "OpenSearch on EC2"] },
  Cache: { caption: "Accelerate responses", mark: "◇", products: ["ElastiCache Valkey", "ElastiCache Redis OSS", "MemoryDB"] },
};

type Option = { tag: string; name: string; note: string; base: number; cpu: string; memory: string; fit: string };
const catalog: Record<Service, Option[]> = {
  Compute: [
    { tag: "LOWEST COST", name: "t4g.medium", note: "EC2 · Burstable", base: 24.53, cpu: "2 vCPU", memory: "4 GiB", fit: "Dev, MVP, irregular traffic" },
    { tag: "RECOMMENDED", name: "m7g.large", note: "EC2 · Graviton3", base: 59.42, cpu: "2 vCPU", memory: "8 GiB", fit: "Steady production traffic" },
    { tag: "PERFORMANCE", name: "c7g.xlarge", note: "EC2 · Compute optimized", base: 105.49, cpu: "4 vCPU", memory: "8 GiB", fit: "CPU-heavy APIs & workers" },
  ],
  Database: [
    { tag: "LOWEST COST", name: "db.t4g.medium", note: "RDS PostgreSQL 16", base: 49.06, cpu: "2 vCPU", memory: "4 GiB", fit: "Small databases & staging" },
    { tag: "RECOMMENDED", name: "db.m7g.large", note: "RDS PostgreSQL 16", base: 142.8, cpu: "2 vCPU", memory: "8 GiB", fit: "Predictable production load" },
    { tag: "HIGH AVAILABILITY", name: "Aurora I/O-Optimized", note: "Aurora PostgreSQL", base: 246.38, cpu: "2 ACU+", memory: "Auto scales", fit: "Critical, variable workloads" },
  ],
  Search: [
    { tag: "LOWEST COST", name: "t3.small.search", note: "OpenSearch Managed", base: 36.5, cpu: "2 vCPU", memory: "2 GiB", fit: "Small catalogs & logs" },
    { tag: "RECOMMENDED", name: "m7g.large.search", note: "3 data nodes", base: 314.7, cpu: "6 vCPU", memory: "24 GiB", fit: "Production search clusters" },
    { tag: "LOW OPERATIONS", name: "Serverless", note: "OpenSearch Serverless", base: 350.4, cpu: "Auto", memory: "Auto", fit: "Spiky, unpredictable search" },
  ],
  Cache: [
    { tag: "LOWEST COST", name: "cache.t4g.small", note: "ElastiCache Valkey", base: 25.55, cpu: "2 vCPU", memory: "1.37 GiB", fit: "Small session cache" },
    { tag: "RECOMMENDED", name: "cache.r7g.large", note: "ElastiCache Valkey", base: 120.35, cpu: "2 vCPU", memory: "13.07 GiB", fit: "Production application cache" },
    { tag: "DURABLE", name: "MemoryDB r7g.large", note: "Multi-AZ transaction log", base: 260.61, cpu: "2 vCPU", memory: "13.07 GiB", fit: "Cache used as a database" },
  ],
};

const productCatalog: Record<string, Option[]> = {
  EC2: catalog.Compute,
  "ECS on Fargate": [
    { tag: "LOWEST COST", name: "0.5 vCPU task", note: "ECS Fargate · 1 GiB", base: 18.02, cpu: "0.5 vCPU", memory: "1 GiB", fit: "Small APIs and workers" },
    { tag: "RECOMMENDED", name: "1 vCPU task", note: "ECS Fargate · 2 GiB", base: 36.04, cpu: "1 vCPU", memory: "2 GiB", fit: "Containerized web services" },
    { tag: "PERFORMANCE", name: "2 vCPU task", note: "ECS Fargate · 4 GiB", base: 72.09, cpu: "2 vCPU", memory: "4 GiB", fit: "Busy APIs and background jobs" },
  ],
  EKS: [
    { tag: "LOWEST COST", name: "2× t4g.medium", note: "EKS managed node group", base: 122.05, cpu: "4 vCPU", memory: "8 GiB", fit: "Learning and small clusters" },
    { tag: "RECOMMENDED", name: "3× m7g.large", note: "EKS · Multi-AZ nodes", base: 251.26, cpu: "6 vCPU", memory: "24 GiB", fit: "Production Kubernetes" },
    { tag: "PERFORMANCE", name: "3× c7g.xlarge", note: "EKS · Compute nodes", base: 389.47, cpu: "12 vCPU", memory: "24 GiB", fit: "High-throughput workloads" },
  ],
  Lambda: [
    { tag: "LOWEST COST", name: "512 MB Lambda", note: "ARM64 · On demand", base: 4.2, cpu: "Shared", memory: "512 MiB", fit: "Light event handlers" },
    { tag: "RECOMMENDED", name: "1 GB Lambda", note: "ARM64 · On demand", base: 12.6, cpu: "~0.6 vCPU", memory: "1 GiB", fit: "APIs and async jobs" },
    { tag: "LOW LATENCY", name: "2 GB + Provisioned", note: "ARM64 · Warm instances", base: 74.8, cpu: "~1.2 vCPU", memory: "2 GiB", fit: "Latency-sensitive APIs" },
  ],
  "Aurora PostgreSQL": [
    { tag: "LOWEST COST", name: "db.t4g.medium", note: "Aurora PostgreSQL", base: 69.35, cpu: "2 vCPU", memory: "4 GiB", fit: "Small production databases" },
    { tag: "RECOMMENDED", name: "db.r7g.large", note: "Aurora PostgreSQL", base: 211.7, cpu: "2 vCPU", memory: "16 GiB", fit: "Production transactional data" },
    { tag: "HIGH AVAILABILITY", name: "Writer + reader", note: "Aurora Multi-AZ", base: 423.4, cpu: "4 vCPU", memory: "32 GiB", fit: "Critical databases" },
  ],
  "RDS PostgreSQL": catalog.Database,
  "RDS MySQL": [
    { tag: "LOWEST COST", name: "db.t4g.medium", note: "RDS MySQL 8.4", base: 48.18, cpu: "2 vCPU", memory: "4 GiB", fit: "Small MySQL databases" },
    { tag: "RECOMMENDED", name: "db.m7g.large", note: "RDS MySQL 8.4", base: 139.43, cpu: "2 vCPU", memory: "8 GiB", fit: "Steady production traffic" },
    { tag: "HIGH AVAILABILITY", name: "db.r7g.large Multi-AZ", note: "RDS MySQL 8.4", base: 306.6, cpu: "2 vCPU", memory: "16 GiB", fit: "Critical MySQL workloads" },
  ],
  "Aurora Serverless v2": [
    { tag: "LOWEST COST", name: "0.5–2 ACU", note: "Aurora Serverless v2", base: 43.8, cpu: "Auto", memory: "1–4 GiB", fit: "Dev and intermittent traffic" },
    { tag: "RECOMMENDED", name: "0.5–8 ACU", note: "Aurora Serverless v2", base: 116.8, cpu: "Auto", memory: "1–16 GiB", fit: "Variable production traffic" },
    { tag: "HIGH SCALE", name: "2–32 ACU", note: "Aurora Serverless v2", base: 292, cpu: "Auto", memory: "4–64 GiB", fit: "Large unpredictable demand" },
  ],
  "OpenSearch Managed": catalog.Search,
  "OpenSearch Serverless": [
    { tag: "LOWEST COST", name: "Dev/test collection", note: "OpenSearch Serverless", base: 174.2, cpu: "Shared OCU", memory: "Managed", fit: "Development search" },
    { tag: "RECOMMENDED", name: "Search collection", note: "2 OCU baseline", base: 350.4, cpu: "Auto", memory: "Auto", fit: "Variable production search" },
    { tag: "PERFORMANCE", name: "Search + redundancy", note: "4 OCU baseline", base: 700.8, cpu: "Auto", memory: "Auto", fit: "High availability search" },
  ],
  "OpenSearch on EC2": [
    { tag: "LOWEST COST", name: "1× r7g.large", note: "Self-managed OpenSearch", base: 132.5, cpu: "2 vCPU", memory: "16 GiB", fit: "Non-critical search" },
    { tag: "RECOMMENDED", name: "3× r7g.large", note: "Self-managed cluster", base: 397.5, cpu: "6 vCPU", memory: "48 GiB", fit: "Production with ops expertise" },
    { tag: "PERFORMANCE", name: "3× r7g.xlarge", note: "Self-managed cluster", base: 795, cpu: "12 vCPU", memory: "96 GiB", fit: "Heavy indexing and queries" },
  ],
  "ElastiCache Valkey": catalog.Cache,
  "ElastiCache Redis OSS": [
    { tag: "LOWEST COST", name: "cache.t4g.small", note: "Redis OSS 7", base: 27.01, cpu: "2 vCPU", memory: "1.37 GiB", fit: "Small cache workloads" },
    { tag: "RECOMMENDED", name: "cache.r7g.large", note: "Redis OSS 7", base: 128.48, cpu: "2 vCPU", memory: "13.07 GiB", fit: "Production application cache" },
    { tag: "HIGH AVAILABILITY", name: "r7g.large + replica", note: "Redis OSS Multi-AZ", base: 256.96, cpu: "4 vCPU", memory: "26.14 GiB", fit: "Critical cache workloads" },
  ],
  MemoryDB: [
    { tag: "LOWEST COST", name: "db.t4g.small", note: "MemoryDB for Valkey", base: 61.32, cpu: "2 vCPU", memory: "1.37 GiB", fit: "Small durable caches" },
    { tag: "RECOMMENDED", name: "db.r7g.large", note: "MemoryDB · Multi-AZ", base: 260.61, cpu: "2 vCPU", memory: "13.07 GiB", fit: "Durable in-memory data" },
    { tag: "PERFORMANCE", name: "db.r7g.xlarge", note: "MemoryDB · Multi-AZ", base: 521.22, cpu: "4 vCPU", memory: "26.32 GiB", fit: "High-throughput durable data" },
  ],
};

const text = {
  en: { title: "Build for today.", title2: "Ready for tomorrow.", subtitle: "Choose a service, shape your workload, and compare clear AWS options instantly.", start: "Build my recommendation", workload: "Shape your workload", workloadSub: "Move the controls — every recommendation updates instantly.", choose: "Choose an AWS approach", traffic: "Traffic volume", priorities: "What matters most?", priorityHint: "Choose one or more. We will find the best overlap.", cost: "Lowest cost", balanced: "Balanced", performance: "Performance", reliability: "Reliable & easy", options: "Compare your best options", optionsSub: "Three different trade-offs, shown side by side.", month: "/ month", fit: "BEST FOR" },
  ko: { title: "오늘에 맞게.", title2: "내일도 문제없게.", subtitle: "서비스를 고르고 예상 부하를 움직이면 적합한 AWS 옵션을 바로 비교해 드려요.", start: "추천 구성 만들기", workload: "워크로드 조정하기", workloadSub: "컨트롤을 움직이면 모든 추천이 즉시 바뀝니다.", choose: "AWS 운영 방식 선택", traffic: "트래픽 규모", priorities: "무엇이 가장 중요한가요?", priorityHint: "하나 이상 선택하세요. 조건이 겹치는 최적점을 찾아드려요.", cost: "최저 비용", balanced: "균형", performance: "최고 성능", reliability: "안정성·운영 편의", options: "추천 옵션 비교", optionsSub: "서로 다른 장단점의 세 가지 선택지를 한눈에 비교하세요.", month: "/ 월", fit: "적합한 용도" },
};

const trafficLabels = ["Tiny", "Small", "Growing", "Large", "Massive"];
const requests = ["100K", "1M", "10M", "100M", "1B+"];
const concurrency = ["10", "100", "500", "2,000", "10,000+"];
const bars = [25, 36, 29, 44, 39, 55, 48, 66, 58, 78, 68, 86, 74, 92];

export default function Dashboard() {
  const [locale, setLocale] = useState<Locale>("en");
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<Provider>("AWS");
  const [workload, setWorkload] = useState("Web / API");
  const [language, setLanguage] = useState("JavaScript / TypeScript");
  const [framework, setFramework] = useState("Next.js");
  const [region, setRegion] = useState("South Korea");
  const [teamSize, setTeamSize] = useState(2);
  const [service, setService] = useState<Service>("Compute");
  const [product, setProduct] = useState("EC2");
  const [traffic, setTraffic] = useState(2);
  const [focuses, setFocuses] = useState<Focus[]>(["balanced"]);
  const t = text[locale];
  const options = useMemo(() => {
    const factor = [0.72, 0.86, 1, 1.75, 3.2][traffic];
    const targets = focuses.map((focus) => ({ cost: 0, balanced: 1, performance: 2, reliability: 2 })[focus]);
    return (productCatalog[product] ?? catalog[service]).map((item, index) => {
      const matches = targets.filter((target) => target === index).length;
      const distance = targets.reduce((sum, target) => sum + Math.abs(target - index), 0) / targets.length;
      return { ...item, price: item.base * factor, score: Math.min(98, Math.round(88 + matches * 5 - distance * 6)) };
    });
  }, [service, product, traffic, focuses]);
  const bestIndex = options.reduce((best, option, index) => option.score > options[best].score ? index : best, 0);
  const chooseService = (next: Service) => { setService(next); setProduct(services[next].products[0]); };
  const toggleFocus = (next: Focus) => setFocuses((current) => current.includes(next) ? (current.length === 1 ? current : current.filter((item) => item !== next)) : [...current, next]);
  const chooseLanguage = (next: string) => { setLanguage(next); setFramework(frameworks[next][0]); };
  const profileAdvice = teamSize <= 3
    ? `${framework} · ${region}: a small team benefits from managed services with less operational work.`
    : `${framework} · ${region}: your team can trade more operational control for lower unit costs.`;
  const rationale = (index: number) => index === bestIndex
    ? `Best overlap for ${focuses.map((item) => item.replace("reliability", "reliability & operations")).join(" + ")} at this traffic level.`
    : index < bestIndex ? "Cheaper to start, with less room for sudden growth." : "More capacity and resilience, but potentially oversized today.";
  const goStep = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => document.querySelector("#journey")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return <main>
    <nav className="nav shell"><button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brandMark">C</span><span>CloudCompass</span></button><div className="navLinks"><a href="#services">Services</a><a href="#advisor">Advisor</a><a href="#results">Compare</a></div><div className="navActions"><button className="language" onClick={() => setLocale(locale === "en" ? "ko" : "en")}>◎ {locale.toUpperCase()}</button><a className="navCta" href="#advisor">{t.start} <span>→</span></a></div></nav>

    <section className="hero shell compactHero"><div className="heroCopy"><p className="eyebrow"><span />AWS INFRASTRUCTURE ADVISOR</p><h1>{t.title}<br /><em>{t.title2}</em></h1><p className="subhead">{t.subtitle}</p><a className="primary" href="#advisor">{t.start} <span>→</span></a></div><div className="miniPreview"><div className="previewHeader"><span>LIVE RECOMMENDATION</span><i>● Updating</i></div><div className="previewNodes"><b>{product}</b><span>→</span><b>{options[bestIndex].name}</b></div><div className="previewChart">{bars.slice(2).map((height, i) => <i key={i} style={{ height: `${Math.min(100, height + traffic * 3)}%` }} />)}</div><div className="previewStats"><span><small>EST. MONTHLY</small><b>${options[bestIndex].price.toFixed(0)}</b></span><span><small>FIT SCORE</small><b>{options[bestIndex].score}%</b></span><span><small>HEADROOM</small><b>{Math.max(12, 52 - traffic * 8)}%</b></span></div></div></section>

    <div className="wizardNav" id="journey"><div className="shell">{[1, 2, 3].map((item) => <button key={item} className={step === item ? "active" : step > item ? "done" : ""} onClick={() => goStep(item)}><i>{step > item ? "✓" : item}</i><span><b>{["Your service", "Infrastructure", "Recommendation"][item - 1]}</b><small>{["Product & stack", "Cloud & workload", "Options & reasons"][item - 1]}</small></span></button>)}</div></div>

    {step === 1 && <section className="discovery" id="discovery"><div className="shell">
      <div className="sectionHeading"><p className="eyebrow"><span />01 · YOUR SERVICE</p><h2>Start with what you are building</h2><p>No cloud expertise required. Tell us about the product, not the infrastructure.</p></div>
      <div className="discoveryGrid">
        <div className="discoveryCard"><span className="stepPill">PRODUCT</span><h3>What are you building?</h3><div className="chipGrid">{workloadTypes.map((item) => <button key={item} className={workload === item ? "active" : ""} onClick={() => setWorkload(item)}>{item}</button>)}</div></div>
        <div className="discoveryCard"><span className="stepPill">TECH STACK</span><h3>What does your team use?</h3><label>Language<select value={language} onChange={(e) => chooseLanguage(e.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label><label>Framework<select value={framework} onChange={(e) => setFramework(e.target.value)}>{frameworks[language].map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="discoveryCard"><span className="stepPill">MARKET</span><h3>Who do you serve?</h3><label>Primary audience<select value={region} onChange={(e) => setRegion(e.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Developers on the team<div className="teamControl"><button onClick={() => setTeamSize(Math.max(1, teamSize - 1))}>−</button><b>{teamSize}</b><button onClick={() => setTeamSize(Math.min(20, teamSize + 1))}>+</button></div></label></div>
      </div>
      <div className="profileInsight"><span>✦</span><div><small>INITIAL ASSESSMENT</small><b>{workload} on {provider}</b><p>{profileAdvice}</p></div><button onClick={() => goStep(2)}>Continue to infrastructure →</button></div>
    </div></section>}

    {step === 2 && <><section className="providerBar"><div className="shell"><span>CLOUD PROVIDER</span>{(["AWS", "GCP", "Azure", "NCP", "Vultr"] as Provider[]).map((item) => <button key={item} className={provider === item ? "active" : ""} disabled={item !== "AWS"} onClick={() => setProvider(item)}>{item}{item !== "AWS" && <small>SOON</small>}</button>)}</div></section>

    <section className="serviceStrip" id="services"><div className="shell serviceIntro"><span>02 · INFRASTRUCTURE</span><b>What would you like to size?</b></div><div className="shell serviceInner">{(Object.keys(services) as Service[]).map((key) => <button key={key} className={service === key ? "service active" : "service"} onClick={() => chooseService(key)}><span className="serviceIcon">{services[key].mark}</span><span><b>{key}</b><small>{services[key].caption}</small></span></button>)}</div></section>

    <section className="configurator" id="advisor"><div className="shell"><div className="sectionHeading"><p className="eyebrow"><span />01 · CONFIGURE</p><h2>{t.workload}</h2><p>{t.workloadSub}</p></div><div className="configGrid">
      <div className="configPanel productPanel"><p className="panelNumber">01</p><h3>{t.choose}</h3><p className="panelHint">{service} · {services[service].caption}</p><div className="productChoices">{services[service].products.map((item) => <button key={item} className={product === item ? "active" : ""} onClick={() => setProduct(item)}><span>{product === item ? "●" : "○"}</span><b>{item}</b><small>{item.includes("Serverless") || item.includes("Fargate") || item === "Lambda" ? "Managed scaling · lower operations" : "More control · predictable capacity"}</small></button>)}</div></div>
      <div className="configPanel loadPanel"><p className="panelNumber">02</p><h3>{t.traffic}</h3><p className="panelHint">{requests[traffic]} requests / month · {concurrency[traffic]} concurrent</p><div className="loadGraph">{bars.map((height, i) => <i key={i} style={{ height: `${Math.min(100, height * (.62 + traffic * .15))}%` }} />)}</div><input className="range" aria-label={t.traffic} type="range" min="0" max="4" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} style={{ "--progress": `${traffic * 25}%` } as React.CSSProperties} /><div className="rangeLabels">{trafficLabels.map((label, i) => <button key={label} className={traffic === i ? "active" : ""} onClick={() => setTraffic(i)}><b>{label}</b><small>{requests[i]}</small></button>)}</div></div>
      <div className="configPanel prioritiesPanel"><p className="panelNumber">03</p><h3>{t.priorities}</h3><p className="panelHint">{t.priorityHint}</p><div className="focusButtons">{([['cost', t.cost, '$', 'Spend as little as possible'], ['balanced', t.balanced, '◎', 'Best overall trade-off'], ['performance', t.performance, '↗', 'Prioritize speed & capacity'], ['reliability', t.reliability, '✓', 'Less downtime & maintenance']] as [Focus, string, string, string][]).map(([key, label, icon, hint]) => { const selected = focuses.includes(key); return <button key={key} className={selected ? "active" : ""} aria-pressed={selected} onClick={() => toggleFocus(key)}><i>{icon}</i><span><b>{label}</b><small>{hint}</small></span><em>{selected ? '✓' : '+'}</em></button>; })}</div></div>
    </div><div className="stepActions"><button onClick={() => goStep(1)}>← Back</button><button className="nextStep" onClick={() => goStep(3)}>See recommendations →</button></div></div></section></>}

    {step === 3 && <section className="results shell" id="results"><button className="backLink" onClick={() => goStep(2)}>← Adjust infrastructure</button><div className="resultTitle"><div><p className="eyebrow"><span />03 · LIVE RESULTS</p><h2>{t.options}</h2><p>{t.optionsSub}</p></div><div className="selectionSummary"><small>YOUR CONFIGURATION</small><b>{product}</b><span>{requests[traffic]} req/mo · {concurrency[traffic]} peak</span></div></div><div className="optionGrid">{options.map((option, index) => <article key={option.name} className={index === bestIndex ? "optionCard featured" : "optionCard"}><div className="optionTop"><span className="optionTag">{index === bestIndex ? "BEST MATCH" : option.tag}</span><span className="fitScore">{option.score}% fit</span></div><h3>{option.name}</h3><p>{option.note}</p><div className="optionPrice"><strong>${option.price.toFixed(0)}</strong><span>{t.month}</span></div><div className="metricRows"><span><small>COMPUTE</small><b>{option.cpu}</b></span><span><small>MEMORY</small><b>{option.memory}</b></span></div><div className="fitFor"><small>{t.fit}</small><p>{option.fit}</p></div><div className="plainReason"><small>WHY {index === bestIndex ? "WE RECOMMEND IT" : "CONSIDER IT"}</small><p>{rationale(index)}</p></div><div className="scoreBar"><i style={{ width: `${option.score}%` }} /></div><button>View full breakdown <span>→</span></button></article>)}</div><p className="pricingNote">Illustrative prototype pricing · us-east-1 · On-Demand · 730 hours/month. Live AWS Pricing API connection is the next data layer.</p></section>}
    <footer><div className="shell"><span className="brand"><span className="brandMark">C</span><span>CloudCompass</span></span><p>Clear infrastructure decisions for teams of every size.</p></div></footer>
  </main>;
}
