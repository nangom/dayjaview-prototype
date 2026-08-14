export const marketSnapshot = {
  asOf: "2026.08.14 10:18",
  status: "실시간",
  indices: [
    { name: "KOSPI", value: "2,615.32", change: "+0.8%", direction: "up" as const },
    { name: "KOSDAQ", value: "772.14", change: "+0.3%", direction: "up" as const },
  ],
  themes: [
    { rank: 1, name: "원전수출", metadata: "17 / 21종목 상승 · 거래 관심 2.4배", value: "+2.7%", direction: "up" as const },
    { rank: 2, name: "반도체 장비", metadata: "14 / 18종목 상승 · 거래 관심 1.9배", value: "+2.4%", direction: "up" as const },
    { rank: 3, name: "전력설비", metadata: "11 / 15종목 상승 · 거래 관심 1.7배", value: "+2.1%", direction: "up" as const },
    { rank: 4, name: "방산", metadata: "9 / 13종목 상승 · 거래 관심 1.5배", value: "+1.8%", direction: "up" as const },
    { rank: 5, name: "로봇", metadata: "8 / 12종목 상승 · 거래 관심 1.4배", value: "+1.4%", direction: "up" as const },
    { rank: 6, name: "전선", metadata: "7 / 11종목 상승 · 거래 관심 1.3배", value: "+1.2%", direction: "up" as const },
    { rank: 7, name: "LED 장비", metadata: "9 / 16종목 상승 · 거래 관심 1.2배", value: "+1.1%", direction: "up" as const },
    { rank: 8, name: "건설 중소형", metadata: "12 / 22종목 상승 · 거래 관심 1.1배", value: "+0.9%", direction: "up" as const },
    { rank: 9, name: "반도체 기판", metadata: "6 / 10종목 상승 · 거래 관심 1.1배", value: "+0.8%", direction: "up" as const },
    { rank: 10, name: "AI 인프라", metadata: "8 / 17종목 상승 · 거래 관심 1.0배", value: "+0.7%", direction: "up" as const },
  ],
};

export const themeDetail = {
  name: "원전수출",
  value: "+2.7%",
  rank: 1,
  reason: "체코 신규 원전 관련 보도가 확인되며 관련 종목 전반으로 움직임이 확산됐어요.",
  evidence: "뉴스 기반 추정 · 10:16",
  leaders: ["두산에너빌리티 +14.2%", "한전기술 +7.1%", "우리기술 +5.8%"],
  metrics: ["17 / 21종목 상승", "평소 거래의 2.4배", "163거래일 만에 부각"],
};

export const savedItems = [
  { title: "원전수출", meta: "테마 · 2026.08.14 저장", value: "+2.7%" },
  { title: "두산에너빌리티", meta: "종목 · 2026.08.14 저장", value: "+14.2%" },
];

export const historicalCases = [
  {
    date: "2024.07.18",
    title: "체코 원전 우선협상대상자 선정",
    similarity: "87%",
    summary: "수주 기대가 현실화되며 원전 설계·기자재 종목으로 상승이 확산된 사례예요.",
    keywords: ["체코", "원전 수주", "우선협상"],
    returns: [{ label: "T+1", value: "+1.8%" }, { label: "T+5", value: "+4.6%" }, { label: "T+20", value: "+7.2%" }],
  },
  {
    date: "2023.04.25",
    title: "한미 원전 협력 확대 발표",
    similarity: "74%",
    summary: "정책 협력 뉴스가 원전 수출 기대를 높였지만 단기 반응은 일부 되돌림을 보였어요.",
    keywords: ["한미 협력", "원전 수출", "정책"],
    returns: [{ label: "T+1", value: "+0.9%" }, { label: "T+5", value: "-1.2%" }, { label: "T+20", value: "+2.4%" }],
  },
  {
    date: "2022.10.31",
    title: "폴란드 원전 개발계획 협력",
    similarity: "69%",
    summary: "해외 원전 사업 참여 기대가 주요 원전 관련주에 반영된 사례예요.",
    keywords: ["폴란드", "해외 수주", "원전 개발"],
    returns: [{ label: "T+1", value: "+2.1%" }, { label: "T+5", value: "+3.3%" }, { label: "T+20", value: "-0.8%" }],
  },
];
