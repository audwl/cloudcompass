"use client";

import { useMemo, useState } from "react";

type Service = "Compute" | "Database" | "Search" | "Cache";
type Locale = "en" | "ko";
type Focus = "cost" | "balanced" | "performance" | "reliability";

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
  const [service, setService] = useState<Service>("Compute");
  const [product, setProduct] = useState("EC2");
  const [traffic, setTraffic] = useState(2);
  const [focuses, setFocuses] = useState<Focus[]>(["balanced"]);
  const t = text[locale];
  const options = useMemo(() => {
    const factor = [0.72, 0.86, 1, 1.75, 3.2][traffic];
    const targets = focuses.map((focus) => ({ cost: 0, balanced: 1, performance: 2, reliability: 2 })[focus]);
    return catalog[service].map((item, index) => {
      const matches = targets.filter((target) => target === index).length;
      const distance = targets.reduce((sum, target) => sum + Math.abs(target - index), 0) / targets.length;
      return { ...item, price: item.base * factor, score: Math.min(98, Math.round(88 + matches * 5 - distance * 6)) };
    });
  }, [service, traffic, focuses]);
  const chooseService = (next: Service) => { setService(next); setProduct(services[next].products[0]); };
  const toggleFocus = (next: Focus) => setFocuses((current) => current.includes(next) ? (current.length === 1 ? current : current.filter((item) => item !== next)) : [...current, next]);

  return <main>
    <nav className="nav shell"><button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brandMark">C</span><span>CloudCompass</span></button><div className="navLinks"><a href="#services">Services</a><a href="#advisor">Advisor</a><a href="#results">Compare</a></div><div className="navActions"><button className="language" onClick={() => setLocale(locale === "en" ? "ko" : "en")}>◎ {locale.toUpperCase()}</button><a className="navCta" href="#advisor">{t.start} <span>→</span></a></div></nav>

    <section className="hero shell compactHero"><div className="heroCopy"><p className="eyebrow"><span />AWS INFRASTRUCTURE ADVISOR</p><h1>{t.title}<br /><em>{t.title2}</em></h1><p className="subhead">{t.subtitle}</p><a className="primary" href="#advisor">{t.start} <span>→</span></a></div><div className="miniPreview"><div className="previewHeader"><span>LIVE RECOMMENDATION</span><i>● Updating</i></div><div className="previewNodes"><b>{product}</b><span>→</span><b>{options[1].name}</b></div><div className="previewChart">{bars.slice(2).map((height, i) => <i key={i} style={{ height: `${Math.min(100, height + traffic * 3)}%` }} />)}</div><div className="previewStats"><span><small>EST. MONTHLY</small><b>${options[1].price.toFixed(0)}</b></span><span><small>FIT SCORE</small><b>{options[1].score}%</b></span><span><small>HEADROOM</small><b>{Math.max(12, 52 - traffic * 8)}%</b></span></div></div></section>

    <section className="serviceStrip" id="services"><div className="shell serviceInner">{(Object.keys(services) as Service[]).map((key) => <button key={key} className={service === key ? "service active" : "service"} onClick={() => chooseService(key)}><span className="serviceIcon">{services[key].mark}</span><span><b>{key}</b><small>{services[key].caption}</small></span></button>)}</div></section>

    <section className="configurator" id="advisor"><div className="shell"><div className="sectionHeading"><p className="eyebrow"><span />01 · CONFIGURE</p><h2>{t.workload}</h2><p>{t.workloadSub}</p></div><div className="configGrid">
      <div className="configPanel productPanel"><p className="panelNumber">01</p><h3>{t.choose}</h3><p className="panelHint">{service} · {services[service].caption}</p><div className="productChoices">{services[service].products.map((item) => <button key={item} className={product === item ? "active" : ""} onClick={() => setProduct(item)}><span>{product === item ? "●" : "○"}</span><b>{item}</b><small>{item.includes("Serverless") || item.includes("Fargate") || item === "Lambda" ? "Managed scaling · lower operations" : "More control · predictable capacity"}</small></button>)}</div></div>
      <div className="configPanel loadPanel"><p className="panelNumber">02</p><h3>{t.traffic}</h3><p className="panelHint">{requests[traffic]} requests / month · {concurrency[traffic]} concurrent</p><div className="loadGraph">{bars.map((height, i) => <i key={i} style={{ height: `${Math.min(100, height * (.62 + traffic * .15))}%` }} />)}</div><input className="range" aria-label={t.traffic} type="range" min="0" max="4" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} style={{ "--progress": `${traffic * 25}%` } as React.CSSProperties} /><div className="rangeLabels">{trafficLabels.map((label, i) => <button key={label} className={traffic === i ? "active" : ""} onClick={() => setTraffic(i)}><b>{label}</b><small>{requests[i]}</small></button>)}</div></div>
      <div className="configPanel prioritiesPanel"><p className="panelNumber">03</p><h3>{t.priorities}</h3><p className="panelHint">{t.priorityHint}</p><div className="focusButtons">{([['cost', t.cost, '$', 'Spend as little as possible'], ['balanced', t.balanced, '◎', 'Best overall trade-off'], ['performance', t.performance, '↗', 'Prioritize speed & capacity'], ['reliability', t.reliability, '✓', 'Less downtime & maintenance']] as [Focus, string, string, string][]).map(([key, label, icon, hint]) => { const selected = focuses.includes(key); return <button key={key} className={selected ? "active" : ""} aria-pressed={selected} onClick={() => toggleFocus(key)}><i>{icon}</i><span><b>{label}</b><small>{hint}</small></span><em>{selected ? '✓' : '+'}</em></button>; })}</div></div>
    </div></div></section>

    <section className="results shell" id="results"><div className="resultTitle"><div><p className="eyebrow"><span />02 · LIVE RESULTS</p><h2>{t.options}</h2><p>{t.optionsSub}</p></div><div className="selectionSummary"><small>YOUR CONFIGURATION</small><b>{product}</b><span>{requests[traffic]} req/mo · {concurrency[traffic]} peak</span></div></div><div className="optionGrid">{options.map((option, index) => <article key={option.name} className={index === 1 ? "optionCard featured" : "optionCard"}><div className="optionTop"><span className="optionTag">{option.tag}</span><span className="fitScore">{option.score}% fit</span></div><h3>{option.name}</h3><p>{option.note}</p><div className="optionPrice"><strong>${option.price.toFixed(0)}</strong><span>{t.month}</span></div><div className="metricRows"><span><small>COMPUTE</small><b>{option.cpu}</b></span><span><small>MEMORY</small><b>{option.memory}</b></span></div><div className="fitFor"><small>{t.fit}</small><p>{option.fit}</p></div><div className="scoreBar"><i style={{ width: `${option.score}%` }} /></div><button>View full breakdown <span>→</span></button></article>)}</div><p className="pricingNote">Illustrative prototype pricing · us-east-1 · On-Demand · 730 hours/month. Live AWS Pricing API connection is the next data layer.</p></section>
    <footer><div className="shell"><span className="brand"><span className="brandMark">C</span><span>CloudCompass</span></span><p>Clear infrastructure decisions for teams of every size.</p></div></footer>
  </main>;
}
