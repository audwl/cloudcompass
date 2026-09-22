import { notFound } from "next/navigation";
import InfoView from "./InfoView";

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

const pagesKo: Record<string, PageContent> = {
  about: { label: "CLOUDCOMPASS 소개", title: "클라우드 선택은 이해하기 쉬워야 합니다.", intro: "CloudCompass는 서비스 상황을 이해하기 쉬운 클라우드 선택지로 바꾸어 주는 독립적인 인프라 설계 프로토타입입니다.", sections: [
    { heading: "우리가 만드는 것", body: ["사용자에게 인스턴스 제품군을 먼저 공부하라고 요구하지 않습니다. 서비스 유형, 기술 스택, 고객 지역, 트래픽과 우선순위부터 파악합니다.", "그 결과를 바탕으로 예상 비용과 장단점, 쉬운 선정 이유가 포함된 여러 인프라 구성을 제시합니다."] },
    { heading: "누구를 위한 서비스인가요?", body: ["전문가와 상담하기 전에 클라우드 구성을 검토하려는 창업자, 기획자, 주니어 개발자와 소규모 팀을 위한 서비스입니다."] },
    { heading: "현재 지원 범위", body: ["현재 프로토타입은 AWS를 중심으로 제공합니다. Google Cloud, Microsoft Azure, 네이버 클라우드 플랫폼과 Vultr 지원은 향후 추가할 예정입니다."] },
  ] },
  guides: { label: "클라우드 학습 센터", title: "어려운 클라우드를 명확하게.", intro: "CloudCompass가 어떤 기준으로 판단하는지 쉽게 설명합니다. 교육 목적의 콘텐츠이며 실제 워크로드 테스트를 대신하지 않습니다.", sections: [
    { heading: "가상 서버, 컨테이너, 서버리스의 차이", body: ["가상 서버는 높은 제어권을 제공하고, 컨테이너는 애플리케이션을 일관되게 배포할 수 있게 합니다. 서버리스는 이벤트 중심이거나 트래픽 변화가 큰 서비스의 운영 부담을 줄입니다. 최적의 선택은 트래픽뿐 아니라 팀의 운영 역량에도 달려 있습니다."] },
    { heading: "데이터베이스 메모리가 중요한 이유", body: ["데이터베이스는 자주 사용하는 데이터를 메모리에 보관합니다. 메모리가 부족하면 디스크 접근이 반복되어 CPU 사용량이 낮아 보여도 쿼리가 느려질 수 있습니다."] },
    { heading: "예상 비용과 실제 청구액이 다른 이유", body: ["실제 클라우드 비용에는 스토리지, 데이터 전송, 로드밸런서, 백업, 모니터링, 세금과 할인 등이 포함될 수 있습니다. 인스턴스 가격은 전체 아키텍처 비용의 일부일 뿐입니다."] },
    { heading: "고가용성이 필요한 시점", body: ["다중 가용 영역 구성은 비용이 더 들지만 단일 데이터센터 장애의 영향을 줄입니다. 장애가 매출, 안전 또는 계약상 의무에 직접 영향을 줄 때 주로 선택합니다."] },
  ] },
  privacy: { label: "법률 문서 · 초안", title: "개인정보처리방침", intro: "시행일: 2026년 9월 22일. 현재 프로토타입 기준의 초안이며 회원가입, 분석, 광고 또는 문의 기능 도입 전에 검토와 수정이 필요합니다.", sections: [
    { heading: "현재 처리하는 정보", body: ["현재 CloudCompass에는 회원 계정이 없으며 이름, 이메일 또는 결제 정보를 의도적으로 수집하지 않습니다. 설정값은 브라우저에서 처리되며 CloudCompass 데이터베이스로 전송되지 않습니다.", "호스팅 제공자는 사이트 제공과 보안을 위해 IP 주소, 요청 메타데이터, 보안 이벤트와 진단 로그를 처리할 수 있습니다."] },
    { heading: "쿠키와 광고", body: ["현재 프로토타입은 광고 쿠키를 의도적으로 설정하지 않습니다. Google AdSense 또는 분석 도구를 도입하면 광고 쿠키, 맞춤 설정, 보유 기간과 거부 방법을 포함하도록 본 방침을 업데이트합니다."] },
    { heading: "해외 방문자", body: ["유럽경제지역, 영국 또는 스위스 방문자에게 맞춤 광고를 제공하기 전 필요한 경우 적절한 동의 관리 수단을 적용합니다."] },
    { heading: "문의와 변경", body: ["개인정보 관련 문의는 문의 페이지를 이용할 수 있습니다. 중요한 변경사항은 새로운 시행일과 함께 이 페이지에 게시합니다."] },
  ] },
  terms: { label: "법률 문서 · 초안", title: "이용약관", intro: "CloudCompass 프로토타입 이용에 관한 초안입니다. 상용 출시 전 운영자 정보 추가와 적절한 검토가 필요합니다.", sections: [
    { heading: "정보 제공 서비스", body: ["CloudCompass는 자동화된 추정치와 교육 목적의 비교 정보를 제공합니다. 특정 아키텍처, 비용, 보안, 법률 또는 가용성을 보장하지 않습니다."] },
    { heading: "사용자의 책임", body: ["클라우드 리소스를 구매하거나 배포하기 전에 공식 문서, 가격, 호환성, 할당량, 리전 지원, 보안 요건과 실제 성능을 직접 확인해야 합니다."] },
    { heading: "허용되는 이용", body: ["서비스를 방해하거나 무단 접근을 시도해서는 안 되며, 불법 콘텐츠를 제출하거나 다른 사용자의 이용을 방해하는 자동 접근을 해서는 안 됩니다."] },
    { heading: "가용성과 책임", body: ["프로토타입은 보증 없이 현재 상태로 제공됩니다. 추천이 불완전하거나 오래되었거나 특정 워크로드에 적합하지 않을 수 있습니다. 법률이 허용하는 범위에서 운영자는 추정치만을 근거로 발생한 클라우드 비용이나 결정에 책임지지 않습니다."] },
  ] },
  contact: { label: "문의", title: "질문, 수정 제안 또는 아이디어가 있나요?", intro: "CloudCompass는 초기 공개 프로토타입입니다. 부정확한 추천이나 이해하기 어려운 설명에 관한 제보를 환영합니다.", sections: [
    { heading: "공개 피드백", body: ["GitHub 공개 저장소에 이슈를 등록할 수 있습니다: github.com/audwl/cloudcompass/issues", "공개 이슈에 비밀번호, 클라우드 인증정보, 비공개 아키텍처, 고객정보 등 민감한 내용을 포함하지 마세요."] },
    { heading: "보안 및 개인정보", body: ["상용 출시 전 비공개 운영자 이메일을 추가해야 합니다. 그전에는 공개 채널로 기밀 보안 또는 개인정보 내용을 보내지 마세요."] },
    { heading: "답변 안내", body: ["현재 독립적으로 운영되는 프로토타입으로 답변 시간이나 긴급 인프라 지원을 보장하지 않습니다."] },
  ] },
  disclaimer: { label: "중요 안내", title: "독립 서비스 및 가격 면책 고지", intro: "CloudCompass 추천을 구매 또는 운영 환경 결정에 사용하기 전에 확인하세요.", sections: [
    { heading: "클라우드 제공사와 무관한 독립 서비스", body: ["CloudCompass는 독립 프로젝트이며 Amazon Web Services, Google Cloud, Microsoft Azure, 네이버 클라우드 플랫폼 또는 Vultr의 공식·제휴·후원 서비스가 아닙니다.", "제공사와 제품명은 서비스 식별과 비교를 위해 일반 텍스트로만 사용하며 모든 상표권은 각 소유자에게 있습니다."] },
    { heading: "예상 가격", body: ["표시된 가격은 설명을 위한 추정치이며 견적이 아닙니다. 실제 비용은 리전, 운영체제, 구매 방식, 통화, 세금, 데이터 전송, 스토리지, 백업, 지원, 할인과 사용 패턴에 따라 달라집니다."] },
    { heading: "예상 성능", body: ["vCPU와 메모리만으로 애플리케이션 성능을 예측할 수 없습니다. CPU 아키텍처, 지속 사용률, 스토리지, 네트워크, 런타임과 애플리케이션 구조에 따라 결과가 달라집니다."] },
    { heading: "배포 전 확인", body: ["공식 계산기와 문서를 확인하고 실제와 유사한 부하로 테스트하세요. 보안이 중요하거나 핵심 업무 시스템이라면 전문가의 검토를 받아야 합니다."] },
  ] },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages[slug] || !pagesKo[slug]) notFound();
  const englishMenu = Object.fromEntries(Object.entries(pages).map(([key, item]) => [key, item.title]));
  const koreanMenu = Object.fromEntries(Object.entries(pagesKo).map(([key, item]) => [key, item.title]));
  return <InfoView slug={slug} english={pages[slug]} korean={pagesKo[slug]} englishMenu={englishMenu} koreanMenu={koreanMenu} />;
}
