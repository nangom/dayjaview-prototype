"use client";

import { useEffect, useState } from "react";
import {
  IconChevronRightSmallLine,
  IconGridLine,
  IconHouseLine,
  IconMagnifyingglassLine,
  IconStarFill,
  IconStarLine,
} from "@karrotmarket/react-monochrome-icon";
import { marketSnapshot } from "../data/prototype";
import { ThemeRankingWheel } from "../components/ThemeRankingWheel";
import styles from "./page.module.css";

const footerItems = [
  { id: "home", Icon: IconHouseLine, label: "홈" },
  { id: "realtime", Icon: IconGridLine, label: "실시간 테마주" },
  { id: "saved", Icon: IconStarLine, label: "즐겨찾기" },
  { id: "natural", Icon: IconMagnifyingglassLine, label: "자연어 검색" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [currentScreen, setCurrentScreen] = useState("screen-home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 2600);
    setIsSaved(window.localStorage.getItem("dayjaview:saved:원전수출") === "true");
    try {
      setSearchHistory(JSON.parse(window.localStorage.getItem("dayjaview:search-history") ?? "[]"));
    } catch {
      setSearchHistory([]);
    }
    return () => window.clearTimeout(timer);
  }, []);

  const goTo = (screen: string) => {
    if (screen === "screen-home") setActiveTab("home");
    if (screen === "screen-realtime") setActiveTab("realtime");
    if (screen === "screen-natural") setActiveTab("natural");
    if (screen === "screen-saved") {
      setActiveTab("saved");
      setCurrentScreen("screen-home");
      return;
    }
    setCurrentScreen(screen);
  };

  const toggleSaved = () => {
    setIsSaved((current) => {
      const next = !current;
      window.localStorage.setItem("dayjaview:saved:원전수출", String(next));
      return next;
    });
  };

  const submitSearch = () => {
    const value = query.trim();
    if (!value) return;
    setSearchHistory((current) => {
      const next = [value, ...current.filter((item) => item !== value)].slice(0, 10);
      window.localStorage.setItem("dayjaview:search-history", JSON.stringify(next));
      return next;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    window.localStorage.removeItem("dayjaview:search-history");
  };

  return (
    <main className={styles.preview}>
      <section id="screen-home" className={`${styles.phone} ${currentScreen === "screen-home" ? styles.activePhone : ""}`} aria-label="DAY-JA-VIEW 모바일 목업">
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.loadingHalo} />
            <div className={styles.loadingLogo} aria-label="DAY-JA-VIEW"><svg viewBox="0 0 48 64" aria-hidden="true"><path d="M9 5h30c0 12-6 17-15 27C15 22 9 17 9 5Zm0 54h30c0-12-6-17-15-27C15 42 9 47 9 59Z" /></svg><b /></div>
            <div className={styles.loadingFooter}><span>오늘의 시장을, 과거의 기록으로</span><b><i /></b></div>
          </div>
        ) : (
          <div className={styles.app}>
            <div className={styles.content}>
              {activeTab === "home" ? (
                <div className={styles.home}>
                  <div className={styles.statusBar} aria-hidden="true">
                    <strong>9:41</strong><i /><span className={styles.signal}>▮▮▮</span><span className={styles.wifi}>⌁</span><span className={styles.battery} />
                  </div>
                  <header className={styles.orangeHomeHeader}>
                    <button className={styles.menuButton} type="button" aria-label="메뉴 열기"><span /><span /><span /></button>
                    <svg className={styles.homeMark} viewBox="0 0 48 64" role="img" aria-label="DAY-JA-VIEW"><path d="M9 5h30c0 12-6 17-15 27C15 22 9 17 9 5Zm0 54h30c0-12-6-17-15-27C15 42 9 47 9 59Z" /></svg>
                    <span className={styles.homeHeaderSpacer} />
                  </header>
                  <div className={styles.orangeHomeTitle}><strong>2026년 08월 12일</strong><h1>오늘의 요약</h1></div>

                  <ThemeRankingWheel themes={marketSnapshot.themes.slice(0, 10)} onSelect={() => goTo("screen-detail")} />
                </div>
              ) : activeTab === "saved" ? (
                <SavedLibrary
                  isSaved={isSaved}
                  history={searchHistory}
                  onOpenSaved={() => goTo("screen-detail")}
                  onRemoveSaved={toggleSaved}
                  onOpenHistory={(item) => { setQuery(item); setIsSearchOpen(true); }}
                  onClearHistory={clearSearchHistory}
                />
              ) : (
                <div className={styles.placeholder}>
                  <h1>{activeTab === "realtime" ? "실시간 테마주" : activeTab === "saved" ? "즐겨찾기" : "자연어 검색"}</h1>
                  <p>이 화면의 내용은 다음 단계에서 채울 예정이에요.</p>
                </div>
              )}
            </div>

            {activeTab !== "home" && <nav className={styles.footer} aria-label="주요 메뉴">
              {footerItems.map(({ id, Icon, label }) => (
                <button key={id} type="button" className={activeTab === id ? styles.active : ""} onClick={() => { setActiveTab(id); if (id === "realtime") goTo("screen-realtime"); if (id === "saved") goTo("screen-saved"); if (id === "natural") goTo("screen-natural"); }}>
                  <Icon className={styles.navIcon} size={20} aria-hidden="true" /><small>{label}</small>
                </button>
              ))}
            </nav>}

            {isSearchOpen && <button className={styles.scrim} type="button" aria-label="검색 닫기" onClick={() => setIsSearchOpen(false)} />}
            <aside className={`${styles.searchDrawer} ${isSearchOpen ? styles.drawerOpen : ""}`} aria-hidden={!isSearchOpen}>
              <div className={styles.drawerHeader}>
                <h2>검색</h2>
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="검색 닫기">×</button>
              </div>
              <form onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="테마나 종목을 검색하세요" aria-label="테마 또는 종목 검색" />
                <button type="submit">검색</button>
              </form>
              <section className={styles.history}>
                <div><h3>최근 검색</h3>{searchHistory.length > 0 && <button type="button" onClick={clearSearchHistory}>전체 삭제</button>}</div>
                {searchHistory.length === 0 ? <p className={styles.emptyHistory}>검색 기록이 없어요.</p> : searchHistory.map((item) => <button key={item} type="button" onClick={() => setQuery(item)}><span>{item}</span><small>›</small></button>)}
              </section>
            </aside>
          </div>
        )}
      </section>

      {!isLoading && (
        <section id="screen-detail" className={`${styles.phone} ${currentScreen === "screen-detail" ? styles.activePhone : ""}`} aria-label="원전수출 테마 상세 목업">
          <div className={styles.detail}>
            <header className={styles.detailHeader}>
              <button type="button" aria-label="뒤로 가기" onClick={() => goTo("screen-home")}>←</button>
              <span>8월 14일 장중 기준</span>
              <button type="button" aria-label={isSaved ? "즐겨찾기에서 제거" : "즐겨찾기에 추가"} className={isSaved ? styles.savedStar : ""} onClick={toggleSaved}>{isSaved ? <IconStarFill size={24} /> : <IconStarLine size={24} />}</button>
            </header>

            <div className={styles.detailScroll}>
              <section className={styles.themeSummary}>
                <div><span>오늘 상승 1위</span><h1>원전수출</h1></div>
                <strong>+2.7%</strong>
                <p>오전 10:18 기준 · 1분 전 갱신</p>
              </section>

              <section className={styles.metrics}>
                <h2>현재 테마 상태</h2>
                <div>
                  <article><span>상승 종목</span><strong>17/21</strong><small>81%</small></article>
                  <article><span>거래 관심</span><strong>2.4배</strong><small>20일 평균 대비</small></article>
                  <article><span>테마 거래대금</span><strong>1.8조</strong><small>장중 누적</small></article>
                </div>
              </section>

              <section className={styles.reason}>
                <div className={styles.sectionHeading}><h2>오늘 왜 올랐을까요?</h2><span>근거 3건</span></div>
                <p>체코 신규 원전 사업 관련 기대가 다시 부각되며 설계·기자재 종목으로 상승이 확산됐어요.</p>
                <ul>
                  <li><span>10:06</span><p>체코 원전 계약 관련 후속 일정 보도</p><small>특징주 뉴스</small></li>
                  <li><span>09:42</span><p>국내 원전 공급망 수출 지원 정책 발표</p><small>정책 뉴스</small></li>
                </ul>
              </section>

              <section className={styles.catalystSection}>
                <div className={styles.sectionHeading}><h2>오늘의 상승 소재 Top 3</h2><span>근거 기반</span></div>
                <ol className={styles.catalysts}>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>1</b><div><strong>체코 원전 수주</strong><p>오늘 뉴스 3건 · 관련 종목 12개</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>2</b><div><strong>원전 수출 정책</strong><p>오늘 뉴스 2건 · 관련 종목 8개</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>3</b><div><strong>원전 기자재 공급</strong><p>오늘 뉴스 2건 · 관련 종목 6개</p></div><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></li>
                </ol>
              </section>

              <section className={styles.leaderSection}>
                <div className={styles.sectionHeading}><h2>오늘의 주도 종목</h2><span>등락률 순</span></div>
                <div className={styles.leaders}>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>두산에너빌리티<small>거래대금 6,240억</small></span><strong>+14.2%</strong><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></div>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>한전기술<small>거래대금 1,820억</small></span><strong>+7.1%</strong><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></div>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>우리기술<small>거래대금 940억</small></span><strong>+5.8%</strong><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></div>
                </div>
              </section>

              <section className={styles.pastSummarySection}>
                <div className={styles.sectionHeading}><h2>과거엔 어땠을까요?</h2><span>이벤트 스터디</span></div>
                <p className={styles.helper}>유사 사건 34건에서 주도 종목의 평균 움직임을 계산했어요.</p>
                <div className={styles.horizons}>
                  <article><span>T+1</span><strong>+0.4%</strong><small>18/34 상승</small></article>
                  <article><span>T+5</span><strong>+1.3%</strong><small>20/34 상승</small></article>
                  <article><span>T+20</span><strong>+2.8%</strong><small>21/34 상승</small></article>
                </div>
              </section>

              <section className={styles.similarSection}>
                <div className={styles.sectionHeading}><h2>오늘과 비슷했던 과거</h2><button type="button" onClick={() => goTo("screen-cases")}>전체 보기</button></div>
                <div className={styles.cases}>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2024.07.18 · 유사도 87%</span><strong>체코 원전 우선협상대상자 선정</strong><small>T+5 +4.6%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2023.04.25 · 유사도 74%</span><strong>한미 원전 협력 확대 발표</strong><small className={styles.downValue}>T+5 -1.2%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2022.10.31 · 유사도 69%</span><strong>폴란드 원전 개발계획 협력</strong><small>T+5 +3.3%</small><IconChevronRightSmallLine className={styles.rowChevron} size={18} /></article>
                </div>
              </section>

              <p className={styles.notice}>장중 정보는 이후 정정될 수 있습니다. 과거 데이터 기반 참고 정보이며 투자 자문이나 종목 추천이 아닙니다.</p>
            </div>
            <nav className={styles.miniFooter} aria-label="테마 상세 주요 메뉴">
              <button type="button" onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button>
              <button type="button" onClick={() => goTo("screen-realtime")}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button>
              <button type="button" onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button>
              <button type="button" onClick={() => goTo("screen-natural")}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>자연어</small></button>
            </nav>
          </div>
        </section>
      )}

      {!isLoading && <RealtimeThemeScreen goTo={goTo} active={currentScreen === "screen-realtime"} />}
      {!isLoading && <CaseListScreen goTo={goTo} active={currentScreen === "screen-cases"} />}
      {!isLoading && <CaseDetailScreen goTo={goTo} active={currentScreen === "screen-case-detail"} />}
      {!isLoading && <CatalystDetailScreen goTo={goTo} active={currentScreen === "screen-catalyst"} />}
      {!isLoading && <LeaderDetailScreen goTo={goTo} active={currentScreen === "screen-leader"} />}
      {!isLoading && <NaturalSearchScreen goTo={goTo} active={currentScreen === "screen-natural"} />}
    </main>
  );
}

function SavedLibrary({
  isSaved,
  history,
  onOpenSaved,
  onRemoveSaved,
  onOpenHistory,
  onClearHistory,
}: {
  isSaved: boolean;
  history: string[];
  onOpenSaved: () => void;
  onRemoveSaved: () => void;
  onOpenHistory: (item: string) => void;
  onClearHistory: () => void;
}) {
  return (
    <div className={styles.library}>
      <header>
        <p>나중에 다시 볼 항목과 검색 기록이에요.</p>
        <h1>즐겨찾기</h1>
      </header>

      <section>
        <div className={styles.libraryHeading}><h2>저장한 항목</h2><span>{isSaved ? "1개" : "0개"}</span></div>
        {isSaved ? (
          <article className={styles.savedRow}>
            <button type="button" onClick={onOpenSaved}>
              <span><small>테마 · 8월 14일 장중 기준</small><strong>원전수출</strong></span>
              <b>+2.7%</b>
            </button>
            <button type="button" className={styles.removeSaved} onClick={onRemoveSaved} aria-label="원전수출 즐겨찾기에서 제거"><IconStarFill size={20} /></button>
          </article>
        ) : <div className={styles.libraryEmpty}><IconStarLine size={28} /><strong>저장한 항목이 없어요.</strong><p>테마 상세의 별을 누르면 여기에 모아볼 수 있어요.</p></div>}
      </section>

      <div className={styles.libraryDivider}><span>검색 히스토리</span></div>

      <section>
        <div className={styles.libraryHeading}><h2>최근 검색</h2>{history.length > 0 && <button type="button" onClick={onClearHistory}>전체 삭제</button>}</div>
        {history.length > 0 ? (
          <div className={styles.libraryHistory}>
            {history.map((item) => <button type="button" key={item} onClick={() => onOpenHistory(item)}><IconMagnifyingglassLine size={18} /><span>{item}</span><small>›</small></button>)}
          </div>
        ) : <p className={styles.libraryHistoryEmpty}>검색 기록이 없어요.</p>}
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
  return <header className={styles.wireHeader}><button type="button" onClick={onBack}>←</button><strong>{title}</strong><button type="button" className={styles.savedStar} aria-label="즐겨찾기에서 제거"><IconStarFill size={24} /></button></header>;
}

function RealtimeThemeScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-realtime" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="실시간 테마주 와이어프레임">
      <div className={`${styles.wireScreen} ${styles.realtimeScreen}`}>
        <header className={styles.wireTitle}><div><small>장중 관찰 화면</small><h1>실시간 테마주</h1><p>현재 움직임이 강한 테마를 모아봐요.</p></div></header>
        <div className={styles.stateNote}>면적은 테마의 실시간 강도에 따라 달라져요.</div>
        <div className={styles.treemap} aria-label="실시간 테마 강도 트리맵">
          <div className={styles.treeTop}>
            <button className={styles.treePrimary} onClick={() => goTo("screen-detail")}><strong>원전수출</strong><b>+2.7%</b><small>17/21 상승</small></button>
            <button className={styles.treeSecondary} onClick={() => goTo("screen-detail")}><strong>전력설비</strong><b>+2.3%</b><small>14/19 상승</small></button>
          </div>
          <div className={styles.treeMiddle}>
            <button><strong>조선기자재</strong><b>+1.9%</b></button>
            <button><strong>방산</strong><b>+1.6%</b></button>
            <button><strong>반도체 장비</strong><b>+1.4%</b></button>
          </div>
          <div className={styles.treeBottom}>
            <button><strong>로봇</strong><b>+1.2%</b></button>
            <button><strong>바이오</strong><b>+0.9%</b></button>
            <button><strong>2차전지</strong><b>+0.7%</b></button>
          </div>
        </div>
        <div className={styles.treeLegend}><span><i />면적: 테마 강도</span><span>수치는 장중 갱신</span></div>
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button><button className={styles.selected}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button><button onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button><button onClick={() => goTo("screen-natural")}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>자연어</small></button></nav>
      </div>
    </section>
  );
}

function CaseListScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-cases" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="과거 사례 전체보기 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="과거 사례 전체보기" onBack={() => goTo("screen-detail")} />
        <div className={styles.wireBody}>
          <div className={styles.pageIntro}><small>원전수출</small><h1>과거에는 이런 일이 있었어요</h1><p>DB에 저장된 과거 사건을 날짜순으로 보여줘요.</p></div>
          <div className={styles.filterRow}><button className={styles.filterActive}>전체 34건</button><button>수주</button><button>정책</button><button>기자재</button></div>
          <div className={styles.caseList}>{caseRows.map(([date, title, members, result]) => <button type="button" key={date} onClick={() => goTo("screen-case-detail")}><span><small>{date}</small><strong>{title}</strong><em>{members}</em></span><b>{result}</b><i>›</i></button>)}</div>
        </div>
      </div>
    </section>
  );
}

function CaseDetailScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-case-detail" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="과거 개별 사례 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="과거 사례" onBack={() => goTo("screen-detail")} />
        <div className={styles.wireBody}>
          <div className={`${styles.pageIntro} ${styles.caseHero}`}><small>2024.07.18 · 원전수출</small><h1>체코 원전 우선협상대상자 선정</h1><p>당시 기록된 사건과 종목의 실제 이후 흐름이에요.</p></div>
          <section className={styles.dataBlock}><h2>사건 기록</h2><p>체코 정부가 신규 원전 사업의 우선협상대상자로 한국수력원자력을 선정하며 원전 관련주가 부각됐어요.</p><small>인포스탁 원본 · 수집 기록 보유</small></section>
          <section className={styles.dataBlock}><h2>당시 주도 종목의 이후 흐름</h2><div className={styles.statGrid}><article><span>T+1</span><strong>+2.1%</strong></article><article><span>T+5</span><strong>+4.6%</strong></article><article><span>T+20</span><strong>+7.2%</strong></article></div></section>
          <section className={styles.dataBlock}><h2>당시 기록된 종목</h2><div className={styles.simpleRows}><button>두산에너빌리티 <b>+14.2%</b></button><button>한전기술 <b>+7.1%</b></button><button>우리기술 <b>+5.8%</b></button></div></section>
          <p className={styles.disclaimer}>과거 관측 결과이며 현재의 수익률을 예측하거나 종목을 추천하지 않아요.</p>
        </div>
      </div>
    </section>
  );
}

function CatalystDetailScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-catalyst" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="상승 소재 상세 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="상승 소재" onBack={() => goTo("screen-detail")} />
        <div className={styles.wireBody}>
          <div className={styles.pageIntro}><small>원전수출 · 상승 동반 소재</small><h1>체코 원전 수주</h1><p>이 소재가 과거 같은 테마와 함께 등장했던 기록을 모았어요.</p></div>
          <section className={styles.dataBlock}><div className={styles.blockHeading}><h2>과거 동반 기록</h2><span>키워드 통계</span></div><div className={styles.statGrid}><article><span>발생</span><strong>9회</strong></article><article><span>상승 동반</span><strong>78%</strong></article><article><span>D+5 차이</span><strong>+2.6%p</strong></article></div></section>
          <section className={styles.dataBlock}><h2>기간별 평균 반응</h2><div className={styles.statGrid}><article><span>D+1</span><strong>+0.8%</strong></article><article><span>D+5</span><strong>+2.6%</strong></article><article><span>D+20</span><strong>+3.1%</strong></article></div></section>
          <section className={styles.dataBlock}><div className={styles.blockHeading}><h2>연결된 과거 사건</h2><button>전체 보기</button></div><div className={styles.simpleRows}><button>2024.07.18 · 체코 원전 우선협상자 <b>›</b></button><button>2022.10.31 · 폴란드 원전 협력 <b>›</b></button></div></section>
          <p className={styles.disclaimer}>현재 룰 기반 키워드는 검수 전 노이즈가 있을 수 있어요.</p>
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
          <section className={styles.lockedBlock}><strong>현재 종목 상세 정보</strong><p>현재가·기업정보·실시간 차트는 서비스 API가 연결된 뒤 제공할 영역이에요.</p></section>
        </div>
      </div>
    </section>
  );
}

function NaturalSearchScreen({ goTo, active }: { goTo: (screen: string) => void; active: boolean }) {
  return (
    <section id="screen-natural" className={`${styles.phone} ${active ? styles.activePhone : ""}`} aria-label="자연어 검색 와이어프레임">
      <div className={styles.wireScreen}>
        <div className={styles.wireBody}><div className={styles.pageIntro}><small>테마·종목 데이터 검색</small><h1>무엇이 궁금하세요?</h1><p>질문하면 보유한 과거 데이터 안에서 답을 찾아요.</p></div>
          <form className={styles.naturalForm} onSubmit={(event) => event.preventDefault()}><textarea defaultValue="원전수출 테마는 과거에 오른 뒤 5일 동안 어땠어?" aria-label="자연어 질문"/><button type="submit">검색</button></form>
          <section className={styles.answerBlock}><div><small>검색 결과</small><span>과거 데이터 기준</span></div><h2>과거 34개 사례에서 5일 후 평균은 +1.3%였어요.</h2><p>34개 사례 중 20개가 상승했고, 당시 주도 종목을 기준으로 계산했어요. 가장 큰 상승 사례는 2024년 7월 18일 체코 원전 우선협상대상자 선정 사건이었어요.</p><ul><li><span>평균 수익률</span><b>+1.3%</b></li><li><span>상승 사례</span><b>20/34</b></li><li><span>대표 과거 사건</span><b>2024.07.18</b></li></ul><button type="button" onClick={() => goTo("screen-cases")}>관련 과거 사례 보기</button></section>
          <p className={styles.disclaimer}>검색 결과는 DB에 저장된 사건과 가격 데이터만 사용하며 투자 자문이 아니에요.</p>
        </div>
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}><IconHouseLine className={styles.navIcon} size={20} /><small>홈</small></button><button onClick={() => goTo("screen-realtime")}><IconGridLine className={styles.navIcon} size={20} /><small>실시간</small></button><button onClick={() => goTo("screen-saved")}><IconStarLine className={styles.navIcon} size={20} /><small>즐겨찾기</small></button><button className={styles.selected}><IconMagnifyingglassLine className={styles.navIcon} size={20} /><small>자연어</small></button></nav>
      </div>
    </section>
  );
}
