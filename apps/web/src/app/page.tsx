"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconArrowLeftLine,
  IconChevronRightSmallLine,
  IconGridLine,
  IconHouseLine,
  IconMagnifyingglassLine,
  IconStarFill,
  IconStarLine,
  IconXmarkLine,
} from "@karrotmarket/react-monochrome-icon";
import { marketSnapshot } from "../data/prototype";
import { ThemeRankingWheel } from "../components/ThemeRankingWheel";
import styles from "./page.module.css";

const footerItems = [
  { id: "home", Icon: IconHouseLine, label: "홈" },
  { id: "realtime", Icon: IconGridLine, label: "실시간" },
  { id: "saved", Icon: IconStarLine, label: "즐겨찾기" },
  { id: "natural", Icon: IconMagnifyingglassLine, label: "리서치" },
];

const LOADING_DURATION_MS = 4000;
const homeThemes = marketSnapshot.themes.slice(0, 10);

type ThemeHistoryItem = {
  name: string;
  value: string;
  metadata: string;
  rank: number;
};

function normalizeThemeHistory(value: unknown): ThemeHistoryItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): ThemeHistoryItem[] => {
    if (typeof item === "string") return [{ name: item, value: "", metadata: "", rank: 0 }];
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.name !== "string") return [];
    return [{
      name: record.name,
      value: typeof record.value === "string" ? record.value : "",
      metadata: typeof record.metadata === "string" ? record.metadata : "",
      rank: typeof record.rank === "number" ? record.rank : 0,
    }];
  }).slice(0, 10);
}

const leaderRows = [
  { name: "두산에너빌리티", volume: "거래대금 6,240억", change: "+14.2%" },
  { name: "한전기술", volume: "거래대금 1,820억", change: "+7.1%" },
  { name: "우리기술", volume: "거래대금 940억", change: "+5.8%" },
  { name: "우진", volume: "거래대금 720억", change: "+4.9%" },
  { name: "보성파워텍", volume: "거래대금 610억", change: "+4.2%" },
  { name: "한전산업", volume: "거래대금 480억", change: "+3.6%" },
];

const intradayReasonNews = [
  { time: "10:06", title: "체코 원전 계약 관련 후속 일정 보도", source: "특징주 뉴스" },
  { time: "09:42", title: "국내 원전 공급망 수출 지원 정책 발표", source: "정책 뉴스" },
  { time: "09:31", title: "유럽 원전 프로젝트 수주 기대 재부각", source: "산업 뉴스" },
  { time: "09:18", title: "원전 기자재 기업으로 매수세 확산", source: "시장 뉴스" },
  { time: "09:07", title: "원전 수출 지원 관련 발언 보도", source: "정책 뉴스" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginIntent, setLoginIntent] = useState<"save" | "library" | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [currentScreen, setCurrentScreen] = useState("screen-home");
  const [isSaved, setIsSaved] = useState(false);
  const [showAllLeaders, setShowAllLeaders] = useState(false);
  const [reasonSource, setReasonSource] = useState<"live" | "infostock">("live");
  const [showAllReasons, setShowAllReasons] = useState(false);
  const [themeHistory, setThemeHistory] = useState<ThemeHistoryItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
    setIsSaved(window.localStorage.getItem("dayjaview:saved:원전수출") === "true");
    try {
      setThemeHistory(normalizeThemeHistory(JSON.parse(window.localStorage.getItem("dayjaview:theme-history") ?? "[]")));
    } catch {
      setThemeHistory([]);
    }
    return () => window.clearTimeout(timer);
  }, []);

  const resetPageScroll = (screen: string) => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const root = document.getElementById(screen);
      if (screen === "screen-home") {
        const wheel = root?.querySelector<HTMLElement>('[class*="wheel"]');
        const cards = wheel?.querySelectorAll<HTMLElement>("[data-theme-card]");
        const firstRankCard = cards?.[homeThemes.length + 1];
        if (wheel && firstRankCard) {
          wheel.scrollTop = Math.max(0, firstRankCard.offsetTop - (wheel.clientHeight - firstRankCard.offsetHeight) / 2);
        }
        return;
      }
      const scrollTarget = root?.querySelector<HTMLElement>('[class*="detailScroll"], [class*="wireBody"]');
      scrollTarget?.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  const goTo = (screen: string) => {
    if (screen === "screen-saved" && !isLoggedIn) {
      setIsLoading(false);
      setCurrentScreen("screen-home");
      setLoginIntent("library");
      return;
    }
    if (screen === "screen-home") setActiveTab("home");
    if (screen === "screen-realtime") setActiveTab("realtime");
    if (screen === "screen-natural") setActiveTab("natural");
    if (screen === "screen-saved") {
      setActiveTab("saved");
      setCurrentScreen("screen-home");
      return;
    }
    setCurrentScreen(screen);
    resetPageScroll(screen);
  };

  const recordThemeVisit = (theme: ThemeHistoryItem) => {
    setThemeHistory((current) => {
      const next = [theme, ...current.filter((item) => item.name !== theme.name)].slice(0, 10);
      window.localStorage.setItem("dayjaview:theme-history", JSON.stringify(next));
      return next;
    });
  };

  const selectTheme = (theme: ThemeHistoryItem) => {
    recordThemeVisit(theme);
    goTo("screen-detail");
  };

  const selectThemeByName = (name: string) => {
    const theme = homeThemes.find((item) => item.name === name);
    if (theme) {
      selectTheme(theme);
      return;
    }
    recordThemeVisit({ name, value: "", metadata: "", rank: 0 });
    goTo("screen-detail");
  };

  const toggleSaved = () => {
    setIsSaved((current) => {
      const next = !current;
      window.localStorage.setItem("dayjaview:saved:원전수출", String(next));
      return next;
    });
  };

  const requestToggleSaved = () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setCurrentScreen("screen-home");
      setLoginIntent("save");
      return;
    }
    toggleSaved();
  };

  const requestSavedLibrary = () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setCurrentScreen("screen-home");
      setLoginIntent("library");
      return;
    }
    goTo("screen-saved");
  };

  const completeLogin = () => {
    setIsLoggedIn(true);
    if (loginIntent === "save" && !isSaved) toggleSaved();
    if (loginIntent === "library") {
      setActiveTab("saved");
      setCurrentScreen("screen-home");
    }
    setLoginIntent(null);
  };

  const savedStateVisible = isLoggedIn && isSaved;

  const clearThemeHistory = () => {
    setThemeHistory([]);
    window.localStorage.removeItem("dayjaview:theme-history");
  };

  return (
    <main className={styles.preview}>
      <section id="screen-home" className={`${styles.phone} ${currentScreen === "screen-home" ? styles.activePhone : ""}`} aria-label="DAY-JA-VIEW 모바일 목업">
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.loadingHalo} />
            <div className={styles.loadingLogo} aria-label="DAY-JA-VIEW">
              <i className={styles.loadingLogoBase} />
              <span className={styles.loadingGlowSweep}><i /></span>
              <span className={styles.loadingSharpSweep}><i /></span>
              <span className={styles.loadingLateSweep}><i /></span>
            </div>
            <div className={styles.loadingFooter}><span>오늘의 시장을, 과거의 기록으로</span><b><i /></b></div>
          </div>
        ) : loginIntent ? (
          <form className={styles.login} onSubmit={(event) => { event.preventDefault(); completeLogin(); }}>
            <button className={styles.loginClose} type="button" onClick={() => setLoginIntent(null)} aria-label="로그인 닫기"><IconXmarkLine size={22} /></button>
            <Image className={styles.loginMark} src="/dejavu-mark.png" alt="DAY-JA-VIEW" width={38} height={48} />
            <div className={styles.loginCopy}>
              <small>DAY-JA-VIEW</small>
              <h1>{loginIntent === "save" ? "이 분석을 저장할까요?" : "저장한 분석을 확인하세요"}</h1>
              <p>{loginIntent === "save" ? "로그인하면 현재 분석과 관심 테마를 보관할 수 있어요." : "저장해 둔 테마와 분석 기록을 이어서 살펴보세요."}</p>
            </div>
            <label><span>이메일</span><input type="email" defaultValue="demo@dayjaview.kr" /></label>
            <label><span>비밀번호</span><input type="password" defaultValue="dayjaview" /></label>
            <button className={styles.loginSubmit} type="submit">로그인</button>
            <em>데모 계정이 입력되어 있어 바로 시작할 수 있어요.</em>
          </form>
        ) : (
          <div className={styles.app}>
            <div className={styles.content}>
              {activeTab === "home" ? (
                <div className={styles.home}>
                  <header className={styles.orangeHomeHeader}>
                    <span className={styles.homeMark} role="img" aria-label="DAY-JA-VIEW" />
                  </header>
                  <div className={styles.orangeHomeTitle}><strong>2026년 08월 12일</strong><h1>오늘 많이 오른 테마예요</h1></div>

                  <ThemeRankingWheel themes={homeThemes} onSelect={selectTheme} />
                </div>
              ) : activeTab === "saved" ? (
                <SavedLibrary
                  isSaved={isSaved}
                  themeHistory={themeHistory}
                  onOpenSaved={() => goTo("screen-detail")}
                  onRemoveSaved={requestToggleSaved}
                  onOpenTheme={(item) => selectThemeByName(item.name)}
                  onClearThemeHistory={clearThemeHistory}
                />
              ) : (
                <div className={styles.placeholder}>
                  <h1>{activeTab === "saved" ? "저장" : "분석"}</h1>
                  <p>이 화면의 내용은 다음 단계에서 채울 예정이에요.</p>
                </div>
              )}
            </div>

            <nav className={styles.footer} aria-label="주요 메뉴">
              {footerItems.map(({ id, Icon, label }) => (
                <button key={id} type="button" className={activeTab === id ? styles.active : ""} onClick={() => { if (id === "home") goTo("screen-home"); if (id === "realtime") goTo("screen-realtime"); if (id === "saved") requestSavedLibrary(); if (id === "natural") goTo("screen-natural"); }}>
                  <Icon className={styles.navIcon} size={20} aria-hidden="true" /><small>{label}</small>
                </button>
              ))}
            </nav>

          </div>
        )}
      </section>

      {!isLoading && !loginIntent && (
        <section id="screen-detail" className={`${styles.phone} ${currentScreen === "screen-detail" ? styles.activePhone : ""}`} aria-label="원전수출 테마 상세 목업">
          <div className={styles.detail}>
            <header className={styles.detailHeader}>
              <button type="button" aria-label="뒤로 가기" onClick={() => goTo("screen-home")}><IconArrowLeftLine size={24} /></button>
              <span>원전수출</span>
              <button type="button" aria-label={savedStateVisible ? "저장 목록에서 제거" : "분석 결과 저장"} className={savedStateVisible ? styles.savedStar : ""} onClick={requestToggleSaved}>{savedStateVisible ? <IconStarFill size={24} /> : <IconStarLine size={24} />}</button>
            </header>

            <div className={styles.detailScroll}>
              <section className={styles.themeSummary}>
                <div className={styles.themeTitle}><span className={styles.themeRankPill}>오늘 상승 1위</span><h1>원전수출</h1></div>
                <div className={styles.themeReturnRow}><strong>+2.7%</strong><p className={styles.themeReturnPill}>오늘 평균 등락률</p></div>
              </section>

              <div className={styles.detailContentCard}>
              <section className={styles.metrics}>
                <h2>현재 테마 상태</h2>
                <div>
                  <article><span>상승 종목</span><strong>17/21</strong><small>81%</small></article>
                  <article><span>거래 관심</span><strong>2.4배</strong><small>20일 평균 대비</small></article>
                  <article><span>테마 거래대금</span><strong>1.8조</strong><small>장중 누적</small></article>
                </div>
                <div className={styles.interestGap}><strong>8개월 만에 다시 주목받고 있어요</strong><span>이전 관심 구간 이후 163거래일</span></div>
              </section>

              <section className={styles.reason}>
                <div className={styles.sectionHeading}><h2>오늘 왜 올랐을까요?</h2></div>
                <div className={styles.reasonTabs} role="tablist" aria-label="상승 이유 분석 시점"><button type="button" role="tab" aria-selected={reasonSource === "live"} className={reasonSource === "live" ? styles.reasonTabActive : ""} onClick={() => setReasonSource("live")}>실시간 분석</button><button type="button" role="tab" aria-selected={reasonSource === "infostock"} className={reasonSource === "infostock" ? styles.reasonTabActive : ""} onClick={() => setReasonSource("infostock")}>장 마감 후 분석</button></div>
                {reasonSource === "live" ? <>
                  <div className={styles.sourceStatus}><span className={styles.liveDot} />실시간 분석 중</div>
                  <p>체코 신규 원전 사업 관련 기대가 다시 부각되며 설계·기자재 종목으로 상승이 확산됐어요.</p>
                  <ul>{intradayReasonNews.slice(0, showAllReasons ? intradayReasonNews.length : 3).map((news) => <li key={`${news.time}-${news.title}`}><span>{news.time}</span><p>{news.title}</p><small>{news.source}</small></li>)}</ul>
                  {intradayReasonNews.length > 3 ? <button type="button" className={styles.reasonMore} aria-expanded={showAllReasons} onClick={() => setShowAllReasons((current) => !current)}><span>{showAllReasons ? "근거 접기" : `근거 ${intradayReasonNews.length - 3}건 더 보기`}</span><i aria-hidden="true" data-open={showAllReasons ? "true" : "false"} /></button> : null}
                  <p className={styles.confirmationNote}>뉴스 근거는 장중 계속 갱신되며 이후 정정될 수 있습니다.</p>
                </> : <div className={styles.infostockPending}><strong>장 마감 후 오늘 하루를 다시 분석해요</strong><p>장중 가격 움직임과 마감 후 확인된 시장 기록을 함께 살펴 상승 배경을 정리해 보여드려요.</p><small>장중 분석과 달라진 내용이 있다면 마감 후 분석을 기준으로 안내합니다.</small></div>}
              </section>

              <section className={styles.leaderSection}>
                <div className={styles.sectionHeading}><h2>오늘의 주도 종목</h2></div>
                <div className={styles.leaders}>
                  {leaderRows.slice(0, showAllLeaders ? leaderRows.length : 3).map((leader) => (
                    <div key={leader.name}><span>{leader.name}<small>{leader.volume}</small></span><strong>{leader.change}</strong></div>
                  ))}
                </div>
                {leaderRows.length > 3 ? <button type="button" className={styles.reasonMore} aria-expanded={showAllLeaders} onClick={() => setShowAllLeaders((current) => !current)}><span>{showAllLeaders ? "종목 접기" : `종목 ${leaderRows.length - 3}개 더 보기`}</span><i aria-hidden="true" data-open={showAllLeaders ? "true" : "false"} /></button> : null}
              </section>

              <section className={styles.catalystSection}>
                <div className={styles.sectionHeading}><h2>과거 상승 소재 Top 3</h2><span>과거 시장 기록 기준</span></div>
                <ol className={styles.catalysts}>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>1</b><div><strong>체코 원전 수주</strong><p>과거 9건 · 상승 동반 78%</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>2</b><div><strong>원전 수출 정책</strong><p>과거 12건 · 상승 동반 67%</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>3</b><div><strong>원전 기자재 공급</strong><p>과거 14건 · 상승 동반 64%</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                </ol>
              </section>

              <section className={styles.pastSummarySection}>
                <div className={styles.sectionHeading}><h2>과거엔 어땠을까요?</h2><span>이벤트 스터디</span></div>
                <p className={styles.helper}>유사 사건 34건에서 주도 종목의 평균 움직임을 계산했어요.</p>
                <div className={styles.horizons}>
                  <article><span>T+1</span><strong>+0.4%</strong><small>18/34 상승</small></article>
                  <article><span>T+5</span><strong>+1.3%</strong><small>20/34 상승</small></article>
                  <article><span>T+20</span><strong>+2.8%</strong><small>21/34 상승</small></article>
                </div>
                <div className={styles.peakObservation}><span>관측 최대 상승폭</span><strong>+8.6%</strong><small>과거 34건의 사건별 최고 반응 중앙값 · T+20 관측</small></div>
              </section>

              <section className={styles.similarSection}>
                <div className={styles.sectionHeading}><div className={styles.caseHeadingCopy}><h2>DAY-JA-VIEW 케이스</h2><small>오늘과 비슷했던 과거</small></div><button type="button" onClick={() => goTo("screen-cases")}>전체 보기</button></div>
                <div className={styles.cases}>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2024.07.18</span><strong>체코 원전 우선협상대상자 선정</strong><div className={styles.matchTags}><i>수출 계약</i><i>정책 지원</i></div><small>T+5 +4.6%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2023.04.25</span><strong>한미 원전 협력 확대 발표</strong><div className={styles.matchTags}><i>국가 협력</i><i>원전 수출</i></div><small className={styles.downValue}>T+5 -1.2%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2022.10.31</span><strong>폴란드 원전 개발계획 협력</strong><div className={styles.matchTags}><i>해외 수주</i><i>개발 계획</i></div><small>T+5 +3.3%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                </div>
              </section>
              </div>

              <p className={styles.notice}>장중 정보는 이후 정정될 수 있습니다. 과거에 관측된 데이터와 확인된 뉴스 근거를 함께 보여줍니다.</p>
            </div>
            <nav className={styles.miniFooter} aria-label="테마 상세 주요 메뉴">
              <button type="button" onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button>
              <button type="button" onClick={() => goTo("screen-realtime")}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button>
              <button type="button" onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button>
              <button type="button" onClick={() => goTo("screen-natural")}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>리서치</small></button>
            </nav>
          </div>
        </section>
      )}

      {!isLoading && !loginIntent && <RealtimeThemeScreen goTo={goTo} onSelectTheme={selectThemeByName} active={currentScreen === "screen-realtime"} />}
      {!isLoading && !loginIntent && <CaseListScreen goTo={goTo} active={currentScreen === "screen-cases"} />}
      {!isLoading && !loginIntent && <CaseDetailScreen goTo={goTo} active={currentScreen === "screen-case-detail"} />}
      {!isLoading && !loginIntent && <CatalystDetailScreen goTo={goTo} active={currentScreen === "screen-catalyst"} />}
      {!isLoading && !loginIntent && <LeaderDetailScreen goTo={goTo} active={currentScreen === "screen-leader"} />}
      {!isLoading && !loginIntent && <NaturalSearchScreen goTo={goTo} active={currentScreen === "screen-natural"} />}
    </main>
  );
}

function SavedLibrary({
  isSaved,
  themeHistory,
  onOpenSaved,
  onRemoveSaved,
  onOpenTheme,
  onClearThemeHistory,
}: {
  isSaved: boolean;
  themeHistory: ThemeHistoryItem[];
  onOpenSaved: () => void;
  onRemoveSaved: () => void;
  onOpenTheme: (item: ThemeHistoryItem) => void;
  onClearThemeHistory: () => void;
}) {
  return (
    <div className={styles.library}>
      <header>
        <h1>저장</h1>
      </header>

      <section>
        <div className={styles.libraryHeading}><h2>저장한 분석</h2><span>{isSaved ? "1개" : "0개"}</span></div>
        {isSaved ? (
          <article className={styles.savedRow}>
            <button type="button" onClick={onOpenSaved}>
              <span><small>테마 · 8월 14일 장중 기준</small><strong>원전수출</strong></span>
              <b>+2.7%</b>
            </button>
                <button type="button" className={styles.removeSaved} onClick={onRemoveSaved} aria-label="원전수출 저장 목록에서 제거" title="저장 해제"><IconXmarkLine size={14} /></button>
          </article>
        ) : <div className={styles.libraryEmpty}><IconStarLine size={28} /><strong>저장한 테마가 없어요.</strong><p>다시 보고 싶은 테마를 저장해 두고 한곳에서 다시 확인할 수 있어요.</p></div>}
      </section>

      <div className={styles.libraryDivider}><span>최근 본 테마</span></div>

      <section>
        <div className={styles.libraryHeading}><h2>내가 눌러본 테마</h2>{themeHistory.length > 0 && <button type="button" onClick={onClearThemeHistory}>전체 삭제</button>}</div>
        {themeHistory.length > 0 ? (
          <div className={styles.libraryHistory}>
            {themeHistory.map((item) => <button type="button" key={`${item.name}-${item.rank}`} onClick={() => onOpenTheme(item)}><span><strong>{item.name}</strong><small>{item.metadata || "최근 확인한 테마"}</small></span><b>{item.value}</b><small>›</small></button>)}
          </div>
        ) : <p className={styles.libraryHistoryEmpty}>아직 눌러본 테마가 없어요.</p>}
      </section>
    </div>
  );
}

const realtimeThemes = [
  ["1", "원전수출", "+2.7%", "17/21 상승 · 거래 활발"],
  ["2", "전력설비", "+2.3%", "14/19 상승 · 거래 증가"],
  ["3", "조선기자재", "+1.9%", "22/31 상승"],
  ["4", "방산", "+1.6%", "11/18 상승"],
  ["5", "반도체 장비", "+1.4%", "27/42 상승"],
];

const caseRows = [
  ["2024.07.18", "체코 원전 우선협상대상자 선정", "당시 주도주 12종목", "+4.6%"],
  ["2023.04.25", "한미 원전 협력 확대 발표", "당시 주도주 9종목", "-1.2%"],
  ["2022.10.31", "폴란드 원전 개발계획 협력", "당시 주도주 11종목", "+3.3%"],
  ["2022.08.25", "원전 수출전략 추진위원회 출범", "당시 주도주 8종목", "+1.8%"],
];

function WireHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className={styles.wireHeader}><button type="button" onClick={onBack} aria-label="뒤로 가기"><IconArrowLeftLine size={24} /></button><strong>{title}</strong><span className={styles.wireHeaderSpacer} aria-hidden="true" /></header>;
}

function RealtimeThemeScreen({ goTo, onSelectTheme, active }: { goTo: (screen: string) => void; onSelectTheme: (name: string) => void; active: boolean }) {
  return (
    <section id="screen-realtime" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="실시간 테마주 와이어프레임">
      <div className={`${styles.wireScreen} ${styles.realtimeScreen}`}>
        <header className={styles.wireTitle}><div><h1>실시간 테마 중계</h1><div className={styles.liveStatus}><span className={styles.liveDot} />LIVE</div></div></header>
        <div className={styles.stateNote}>면적은 테마의 실시간 강도에 따라 달라져요.</div>
        <div className={styles.treemap} aria-label="실시간 테마 강도 트리맵">
          <div className={styles.treeTop}>
            <button className={styles.treePrimary} onClick={() => onSelectTheme("원전수출")}><strong>원전수출</strong><b>+2.7%</b><small>17/21 상승</small></button>
            <button className={styles.treeSecondary} onClick={() => onSelectTheme("전력설비")}><strong>전력설비</strong><b>+2.3%</b><small>14/19 상승</small></button>
          </div>
          <div className={styles.treeMiddle}>
            <button onClick={() => onSelectTheme("조선기자재")}><strong>조선기자재</strong><b>+1.9%</b></button>
            <button onClick={() => onSelectTheme("방산")}><strong>방산</strong><b>+1.6%</b></button>
            <button onClick={() => onSelectTheme("반도체 장비")}><strong>반도체 장비</strong><b>+1.4%</b></button>
          </div>
          <div className={styles.treeBottom}>
            <button onClick={() => onSelectTheme("로봇")}><strong>로봇</strong><b>+1.2%</b></button>
            <button onClick={() => onSelectTheme("바이오")}><strong>바이오</strong><b>+0.9%</b></button>
            <button onClick={() => onSelectTheme("2차전지")}><strong>2차전지</strong><b>+0.7%</b></button>
          </div>
        </div>
        <div className={styles.treeLegend}><span><i />면적: 테마 강도</span><span>수치는 장중 갱신</span></div>
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button><button className={styles.selected}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button><button onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button><button onClick={() => goTo("screen-natural")}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>리서치</small></button></nav>
      </div>
    </section>
  );
}

function CaseListScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  const [horizon, setHorizon] = useState<1 | 5 | 20>(5);
  const horizonResults = [
    { 1: "+1.1%", 5: "+4.6%", 20: "+7.2%" },
    { 1: "-0.4%", 5: "-1.2%", 20: "+0.8%" },
    { 1: "+0.9%", 5: "+3.3%", 20: "+5.1%" },
    { 1: "+0.5%", 5: "+1.8%", 20: "+2.6%" },
  ];
  const caseTags = [["수출 계약", "정책 지원"], ["국가 협력", "원전 수출"], ["해외 수주", "개발 계획"], ["정책", "공급망"]];
  return (
    <section id="screen-cases" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="과거 사례 전체보기 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="과거 사례 전체보기" onBack={() => goTo("screen-detail")} />
        <div className={`${styles.wireBody} ${styles.caseListBody}`}>
          <div className={styles.caseListCard}>
            <div className={styles.pageIntro}><small className={styles.themeContext}>원전수출 테마</small><h1>과거에는 이런 일이 있었어요</h1></div>
            <div className={styles.horizonToggle} aria-label="사례 수익률 기간 선택">{([1, 5, 20] as const).map((day) => <button type="button" key={day} className={horizon === day ? styles.horizonActive : ""} onClick={() => setHorizon(day)}>{day}일 후</button>)}</div>
            <div className={styles.filterRow}><button className={styles.filterActive}>전체 34건</button><button>수주</button><button>정책</button><button>기자재</button></div>
            <div className={styles.caseList}>{caseRows.map(([date, title, members], index) => <button type="button" key={date} onClick={() => goTo("screen-case-detail")}><span><small>{date}</small><strong>{title}</strong><span className={styles.caseRowTags}>{caseTags[index].map((tag) => <em key={tag}>{tag}</em>)}</span><em>{members}</em></span><b><small>T+{horizon}</small>{horizonResults[index][horizon]}</b><i>›</i></button>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseDetailScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const memberRows = [
    ["두산에너빌리티", "+14.2%"],
    ["한전기술", "+7.1%"],
    ["우리기술", "+5.8%"],
    ["보성파워텍", "+4.9%"],
    ["우진", "+4.2%"],
    ["한신기계", "+3.6%"],
  ];
  const visibleMemberRows = showAllMembers ? memberRows : memberRows.slice(0, 3);

  return (
    <section id="screen-case-detail" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="과거 개별 사례 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="과거 사례" onBack={() => goTo("screen-detail")} />
        <div className={`${styles.wireBody} ${styles.caseDetailBody}`}>
          <div className={styles.caseDetailCard}>
          <div className={`${styles.pageIntro} ${styles.caseHero}`}><small>원전수출 테마 · 2024.07.18</small><h1>체코 원전 우선협상대상자 선정</h1></div>
          <section className={styles.caseMatchSummary} aria-label="데자뷰 케이스 연결 정보">
            <div><span>비슷했던 점</span><strong>원전 수출 기대와 정책 지원이 함께 나타난 사건이에요.</strong></div>
            <div><span>연결된 기록</span><strong>원전수출 테마 · 사건 당일 시장 기록</strong></div>
          </section>
          <section className={styles.dataBlock}><h2>사건 기록</h2><p>체코 정부가 신규 원전 사업의 우선협상대상자로 한국수력원자력을 선정하며 원전 관련주가 부각됐어요.</p><small>시장 사건 원문 · 수집 기록 보유</small><div className={styles.caseKeywords} aria-label="사건 키워드"><span>체코 원전</span><span>우선협상대상자</span><span>원전 수출</span></div></section>
          <section className={styles.dataBlock}><h2>당시 테마 바스켓의 이후 흐름</h2><div className={styles.statGrid}><article><span>T+1</span><strong>+2.1%</strong></article><article><span>T+5</span><strong>+4.6%</strong></article><article><span>T+20</span><strong>+7.2%</strong></article></div><small>사건 당일 기록된 종목을 동일 비중으로 계산했어요.</small></section>
          <section className={styles.dataBlock}>
            <h2>당시 기록된 종목</h2>
            <small>사건 당일 시장 기록 기준</small>
            <div className={styles.simpleRows}>
              {visibleMemberRows.map(([name, change]) => (
                <div className={styles.staticRow} key={name}>{name} <b>{change}</b></div>
              ))}
            </div>
            {memberRows.length > 3 ? (
              <button
                type="button"
                className={styles.reasonMore}
                aria-expanded={showAllMembers}
                onClick={() => setShowAllMembers((current) => !current)}
              >
                <span>{showAllMembers ? "종목 접기" : `전체 종목 ${memberRows.length - 3}개 더 보기`}</span>
                <i aria-hidden="true" data-open={showAllMembers ? "true" : "false"} />
              </button>
            ) : null}
          </section>
               <p className={styles.disclaimer}>과거에 관측된 결과를 보여주며 현재의 투자 판단을 제공하지 않아요.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalystDetailScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-catalyst" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="상승 소재 상세 와이어프레임">
      <div className={`${styles.wireScreen} ${styles.catalystScreen}`}>
        <WireHeader title="상승 소재" onBack={() => goTo("screen-detail")} />
        <div className={`${styles.wireBody} ${styles.caseDetailBody}`}>
          <div className={styles.caseDetailCard}>
          <div className={`${styles.pageIntro} ${styles.catalystHero}`}><small>원전수출 테마 · 과거 상승 소재</small><h1>체코 원전 수주</h1><p>이 소재가 과거 같은 테마와 함께 등장했던 기록을 모았어요.</p></div>
          <section className={styles.dataBlock}><div className={styles.blockHeading}><h2>과거 동반 기록</h2><span>키워드 통계</span></div><div className={styles.statGrid}><article><span>발생</span><strong>9회</strong></article><article><span>상승 동반</span><strong>78%</strong></article><article><span>D+5 차이</span><strong>+2.6%p</strong></article></div></section>
          <section className={styles.dataBlock}><h2>기간별 평균 반응</h2><div className={styles.statGrid}><article><span>D+1</span><strong>+0.8%</strong></article><article><span>D+5</span><strong>+2.6%</strong></article><article><span>D+20</span><strong>+3.1%</strong></article></div></section>
          <section className={styles.dataBlock}><div className={styles.blockHeading}><h2>연결된 과거 사건</h2><button type="button" onClick={() => goTo("screen-cases")}>전체 보기</button></div><div className={styles.simpleRows}><button type="button" onClick={() => goTo("screen-case-detail")}>2024.07.18 · 체코 원전 우선협상자 <b>›</b></button><button type="button" onClick={() => goTo("screen-case-detail")}>2022.10.31 · 폴란드 원전 협력 <b>›</b></button></div></section>
          <p className={styles.disclaimer}>현재 룰 기반 키워드는 검수 전 노이즈가 있을 수 있어요.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderDetailScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-leader" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="주도 종목 상세 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="당시 주도 종목" onBack={() => goTo("screen-detail")} />
        <div className={styles.wireBody}>
          <div className={styles.pageIntro}><small>2024.07.18 · 원전수출</small><h1>두산에너빌리티</h1><p>이 사건 당시 기록된 종목의 가격 반응이에요.</p></div>
          <section className={styles.dataBlock}><h2>사건 이후 등락률</h2><div className={styles.statGrid}><article><span>당일</span><strong>+14.2%</strong></article><article><span>T+5</span><strong>+8.4%</strong></article><article><span>T+20</span><strong>+12.1%</strong></article></div></section>
          <section className={styles.dataBlock}><h2>같은 테마에서 기록된 과거</h2><div className={styles.simpleRows}><button>원전수출 사건에 등장 <b>18회</b></button><button>보유 일봉 범위 <b>2005~2026</b></button></div></section>
          <section className={styles.lockedBlock}><strong>현재 종목 상세 정보</strong><p>현재가와 기업정보는 데이터 연결 범위를 확인한 뒤 제공할 영역이에요.</p></section>
        </div>
      </div>
    </section>
  );
}

function NaturalSearchScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <section id="screen-natural" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="리서치 와이어프레임">
      <div className={`${styles.wireScreen} ${styles.researchScreen}`}>
        <div className={styles.wireBody}>
          <div className={styles.pageIntro}><small>데이터 리서치</small><h1>무엇이 궁금하세요?</h1><p>질문하면 보유한 과거 데이터 안에서 답을 찾아요.</p></div>
          <div className={styles.researchChatBox}>
          <form className={styles.naturalForm} onSubmit={(event) => { event.preventDefault(); setHasSearched(true); }}><textarea defaultValue="원전수출 테마는 과거에 오른 뒤 5일 동안 어땠어?" aria-label="자연어 질문"/><button type="submit">검색</button></form>
          {hasSearched ? <>
            <section className={styles.answerBlock}><div><small>DAY-JA-VIEW 리서치</small><span>과거 데이터 기준</span></div><p className={styles.researchLead}>원전수출 테마는 과거 34개 사례에서 사건 발생 5거래일 후 평균 <strong>+1.3%</strong>를 기록했어요.</p><p>이 가운데 20개 사례가 상승했습니다. 결과는 사건 당시 시장 기록에 포함된 종목을 동일 비중으로 계산한 값이에요. 가장 크게 움직인 사례는 2024년 7월 18일 체코 원전 우선협상대상자 선정 사건이었습니다.</p><p>다만 과거 관측 결과이며 현재의 상승을 예측하거나 종목을 추천하는 정보는 아니에요.</p><button type="button" onClick={() => goTo("screen-cases")}>관련 DAY-JA-VIEW 케이스 보기</button></section>
            <p className={styles.disclaimer}>검색 결과는 DB에 저장된 사건과 가격 데이터만 사용해요.</p>
          </> : <p className={styles.searchHint}>질문을 확인한 뒤 검색을 눌러주세요.</p>}
          </div>
        </div>
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button><button onClick={() => goTo("screen-realtime")}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button><button onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button><button className={styles.selected}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>리서치</small></button></nav>
      </div>
    </section>
  );
}
