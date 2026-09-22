"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PageContent = { label: string; title: string; intro: string; sections: { heading: string; body: string[] }[] };

export default function InfoView({ slug, english, korean, englishMenu, koreanMenu }: { slug: string; english: PageContent; korean: PageContent; englishMenu: Record<string, string>; koreanMenu: Record<string, string> }) {
  const [isKo, setIsKo] = useState(false);
  useEffect(() => setIsKo(new URLSearchParams(window.location.search).get("lang") === "ko"), []);
  const page = isKo ? korean : english;
  const menu = isKo ? koreanMenu : englishMenu;
  const lang = isKo ? "ko" : "en";

  const toggleLanguage = () => {
    const next = isKo ? "en" : "ko";
    window.history.replaceState(null, "", `/info/${slug}?lang=${next}`);
    setIsKo(!isKo);
  };

  return <main className="infoPage">
    <nav className="nav shell"><Link className="brand" href="/"><span className="brandMark">C</span><span>CloudCompass</span></Link><div className="navLinks"><Link href={`/info/about?lang=${lang}`}>{isKo ? "소개" : "About"}</Link><Link href={`/info/guides?lang=${lang}`}>{isKo ? "가이드" : "Guides"}</Link><Link href={`/info/contact?lang=${lang}`}>{isKo ? "문의" : "Contact"}</Link></div><div className="navActions"><button className="language" onClick={toggleLanguage}>◎ {isKo ? "KO" : "EN"}</button><Link className="navCta" href="/">{isKo ? "추천 도구 열기" : "Open advisor"} <span>→</span></Link></div></nav>
    <header className="infoHero shell"><p className="eyebrow"><span />{page.label}</p><h1>{page.title}</h1><p>{page.intro}</p>{(page.label.includes("DRAFT") || page.label.includes("초안")) && <div className="draftNotice">{isKo ? "제품 초안이며 법률 자문이 아닙니다. 상용 출시 전 운영자 정보를 추가하고 적절한 검토를 받으세요." : "This is a product draft, not legal advice. Add the operator identity and obtain appropriate review before commercial launch."}</div>}</header>
    <div className="infoLayout shell"><aside>{Object.entries(menu).map(([key, title]) => <Link key={key} className={slug === key ? "active" : ""} href={`/info/${key}?lang=${lang}`}>{title}</Link>)}</aside><article>{page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => paragraph.includes("github.com/") ? <p key={paragraph}><a href="https://github.com/audwl/cloudcompass/issues" target="_blank" rel="noreferrer">github.com/audwl/cloudcompass/issues ↗</a></p> : <p key={paragraph}>{paragraph}</p>)}</section>)}<p className="legalFooter">{isKo ? "최종 수정 2026년 9월 22일 · CloudCompass 프로토타입" : "Last updated September 22, 2026 · CloudCompass prototype"}</p></article></div>
  </main>;
}
