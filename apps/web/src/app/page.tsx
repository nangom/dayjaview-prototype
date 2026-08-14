"use client";

import { useEffect, useState } from "react";
import { marketSnapshot } from "../data/prototype";
import styles from "./page.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const goTo = (screen: string) => {
    if (screen === "screen-home") setActiveTab("home");
    window.requestAnimationFrame(() => document.getElementById(screen)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" }));
  };

  return (
    <main className={styles.preview}>
      <section id="screen-home" className={styles.phone} aria-label="DAY-JA-VIEW 모바일 목업">
        {isLoading ? (
          <div className={styles.loading}>
            <img src="/dejavu-mark.png" alt="DAY-JA-VIEW" />
            <span>DAY-JA-VIEW</span>
          </div>
        ) : (
          <div className={styles.app}>
            <div className={styles.content}>
              {activeTab === "home" ? (
                <div className={styles.home}>
                  <header>
                    <div>
                      <h1>오늘 많이 오른 테마예요</h1>
                      <p>장중 상승률을 기준으로 보여드려요.</p>
                    </div>
                    <button className={styles.searchButton} type="button" onClick={() => setIsSearchOpen(true)} aria-label="검색 열기">⌕</button>
                  </header>

                  <ol className={styles.ranking}>
                    {marketSnapshot.themes.slice(0, 10).map((theme) => (
                      <li key={theme.rank}>
                        <button type="button" onClick={() => goTo("screen-detail")}>
                          <span className={styles.rank}>{theme.rank}</span>
                          <span className={styles.name}>{theme.name}</span>
                          <strong>{theme.value}</strong>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <h1>{activeTab === "realtime" ? "실시간 테마주" : activeTab === "saved" ? "즐겨찾기" : "자연어 검색"}</h1>
                  <p>이 화면의 내용은 다음 단계에서 채울 예정이에요.</p>
                </div>
              )}
            </div>

            <nav className={styles.footer} aria-label="주요 메뉴">
              {[
                ["home", "⌂", "홈"],
                ["realtime", "▦", "실시간 테마주"],
                ["saved", "☆", "즐겨찾기"],
                ["natural", "⌕", "자연어 검색"],
              ].map(([id, icon, label]) => (
                <button key={id} type="button" className={activeTab === id ? styles.active : ""} onClick={() => { setActiveTab(id); if (id === "realtime") goTo("screen-realtime"); if (id === "natural") goTo("screen-natural"); }}>
                  <span>{icon}</span><small>{label}</small>
                </button>
              ))}
            </nav>

            {isSearchOpen && <button className={styles.scrim} type="button" aria-label="검색 닫기" onClick={() => setIsSearchOpen(false)} />}
            <aside className={`${styles.searchDrawer} ${isSearchOpen ? styles.drawerOpen : ""}`} aria-hidden={!isSearchOpen}>
              <div className={styles.drawerHeader}>
                <h2>검색</h2>
                <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="검색 닫기">×</button>
              </div>
              <form onSubmit={(event) => event.preventDefault()}>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="테마나 종목을 검색하세요" aria-label="테마 또는 종목 검색" />
                <button type="submit">검색</button>
              </form>
              <section className={styles.history}>
                <div><h3>최근 검색</h3><button type="button">전체 삭제</button></div>
                {["반도체 장비", "원전수출", "두산에너빌리티", "로봇"].map((item) => <button key={item} type="button" onClick={() => setQuery(item)}><span>{item}</span><small>›</small></button>)}
              </section>
            </aside>
          </div>
        )}
      </section>

      {!isLoading && (
        <section id="screen-detail" className={styles.phone} aria-label="원전수출 테마 상세 목업">
          <div className={styles.detail}>
            <header className={styles.detailHeader}>
              <button type="button" aria-label="뒤로 가기" onClick={() => goTo("screen-home")}>←</button>
              <span>8월 14일 장중 기준</span>
              <button type="button" aria-label="즐겨찾기">☆</button>
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

              <section>
                <div className={styles.sectionHeading}><h2>오늘의 상승 소재 Top 3</h2><span>근거 기반</span></div>
                <ol className={styles.catalysts}>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>1</b><div><strong>체코 원전 수주</strong><p>오늘 뉴스 3건 · 관련 종목 12개</p></div><span>높음</span></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>2</b><div><strong>원전 수출 정책</strong><p>오늘 뉴스 2건 · 관련 종목 8개</p></div><span>중간</span></li>
                  <li role="button" tabIndex={0} onClick={() => goTo("screen-catalyst")}><b>3</b><div><strong>원전 기자재 공급</strong><p>오늘 뉴스 2건 · 관련 종목 6개</p></div><span>중간</span></li>
                </ol>
              </section>

              <section>
                <div className={styles.sectionHeading}><h2>오늘의 주도 종목</h2><span>등락률 순</span></div>
                <div className={styles.leaders}>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>두산에너빌리티<small>거래대금 6,240억</small></span><strong>+14.2%</strong></div>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>한전기술<small>거래대금 1,820억</small></span><strong>+7.1%</strong></div>
                  <div role="button" tabIndex={0} onClick={() => goTo("screen-leader")}><span>우리기술<small>거래대금 940억</small></span><strong>+5.8%</strong></div>
                </div>
              </section>

              <section>
                <div className={styles.sectionHeading}><h2>과거엔 어땠을까요?</h2><span>이벤트 스터디</span></div>
                <p className={styles.helper}>유사 사건 34건에서 주도 종목의 평균 움직임을 계산했어요.</p>
                <div className={styles.horizons}>
                  <article><span>T+1</span><strong>+0.4%</strong><small>18/34 상승</small></article>
                  <article><span>T+5</span><strong>+1.3%</strong><small>20/34 상승</small></article>
                  <article><span>T+20</span><strong>+2.8%</strong><small>21/34 상승</small></article>
                </div>
              </section>

              <section>
                <div className={styles.sectionHeading}><h2>오늘과 비슷했던 과거</h2><button type="button" onClick={() => goTo("screen-cases")}>전체 보기</button></div>
                <div className={styles.cases}>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2024.07.18 · 유사도 87%</span><strong>체코 원전 우선협상대상자 선정</strong><small>T+5 +4.6%</small></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2023.04.25 · 유사도 74%</span><strong>한미 원전 협력 확대 발표</strong><small>T+5 -1.2%</small></article>
                  <article role="button" tabIndex={0} onClick={() => goTo("screen-case-detail")}><span>2022.10.31 · 유사도 69%</span><strong>폴란드 원전 개발계획 협력</strong><small>T+5 +3.3%</small></article>
                </div>
              </section>

              <p className={styles.notice}>장중 정보는 이후 정정될 수 있습니다. 과거 데이터 기반 참고 정보이며 투자 자문이나 종목 추천이 아닙니다.</p>
            </div>
          </div>
        </section>
      )}

      {!isLoading && <RealtimeThemeScreen goTo={goTo} />}
      {!isLoading && <CaseListScreen goTo={goTo} />}
      {!isLoading && <CaseDetailScreen goTo={goTo} />}
      {!isLoading && <CatalystDetailScreen goTo={goTo} />}
      {!isLoading && <LeaderDetailScreen goTo={goTo} />}
      {!isLoading && <NaturalSearchScreen goTo={goTo} />}
    </main>
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
  return <header className={styles.wireHeader}><button type="button" onClick={onBack}>←</button><strong>{title}</strong><button type="button">☆</button></header>;
}

function RealtimeThemeScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-realtime" className={styles.phone} aria-label="실시간 테마주 와이어프레임">
      <div className={`${styles.wireScreen} ${styles.realtimeScreen}`}>
        <header className={styles.wireTitle}><div><small>장중 관찰 화면</small><h1>실시간 테마주</h1><p>현재 움직임이 강한 테마를 모아봐요.</p></div><button type="button">⌕</button></header>
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
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}>⌂<small>홈</small></button><button className={styles.selected}>▦<small>실시간</small></button><button>☆<small>즐겨찾기</small></button><button onClick={() => goTo("screen-natural")}>⌕<small>자연어</small></button></nav>
      </div>
    </section>
  );
}

function CaseListScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-cases" className={styles.phone} aria-label="과거 사례 전체보기 와이어프레임">
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

function CaseDetailScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-case-detail" className={styles.phone} aria-label="과거 개별 사례 와이어프레임">
      <div className={styles.wireScreen}>
        <WireHeader title="과거 사례" onBack={() => goTo("screen-detail")} />
        <div className={styles.wireBody}>
          <div className={styles.pageIntro}><small>2024.07.18 · 원전수출</small><h1>체코 원전 우선협상대상자 선정</h1><p>당시 기록된 사건과 종목의 실제 이후 흐름이에요.</p></div>
          <section className={styles.dataBlock}><h2>사건 기록</h2><p>체코 정부가 신규 원전 사업의 우선협상대상자로 한국수력원자력을 선정하며 원전 관련주가 부각됐어요.</p><small>인포스탁 원본 · 수집 기록 보유</small></section>
          <section className={styles.dataBlock}><h2>당시 주도 종목의 이후 흐름</h2><div className={styles.statGrid}><article><span>T+1</span><strong>+2.1%</strong></article><article><span>T+5</span><strong>+4.6%</strong></article><article><span>T+20</span><strong>+7.2%</strong></article></div></section>
          <section className={styles.dataBlock}><h2>당시 기록된 종목</h2><div className={styles.simpleRows}><button>두산에너빌리티 <b>+14.2%</b></button><button>한전기술 <b>+7.1%</b></button><button>우리기술 <b>+5.8%</b></button></div></section>
          <p className={styles.disclaimer}>과거 관측 결과이며 현재의 수익률을 예측하거나 종목을 추천하지 않아요.</p>
        </div>
      </div>
    </section>
  );
}

function CatalystDetailScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-catalyst" className={styles.phone} aria-label="상승 소재 상세 와이어프레임">
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

function LeaderDetailScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-leader" className={styles.phone} aria-label="주도 종목 상세 와이어프레임">
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

function NaturalSearchScreen({ goTo }: { goTo: (screen: string) => void }) {
  return (
    <section id="screen-natural" className={styles.phone} aria-label="자연어 검색 와이어프레임">
      <div className={styles.wireScreen}>
        <div className={styles.wireBody}><div className={styles.pageIntro}><small>테마·종목 데이터 검색</small><h1>무엇이 궁금하세요?</h1><p>질문하면 보유한 과거 데이터 안에서 답을 찾아요.</p></div>
          <form className={styles.naturalForm} onSubmit={(event) => event.preventDefault()}><textarea defaultValue="원전수출 테마는 과거에 오른 뒤 5일 동안 어땠어?" aria-label="자연어 질문"/><button type="submit">검색</button></form>
          <section className={styles.answerBlock}><div><small>검색 결과</small><span>과거 데이터 기준</span></div><h2>과거 34개 사례에서 5일 후 평균은 +1.3%였어요.</h2><p>34개 사례 중 20개가 상승했고, 당시 주도 종목을 기준으로 계산했어요. 가장 큰 상승 사례는 2024년 7월 18일 체코 원전 우선협상대상자 선정 사건이었어요.</p><ul><li><span>평균 수익률</span><b>+1.3%</b></li><li><span>상승 사례</span><b>20/34</b></li><li><span>대표 과거 사건</span><b>2024.07.18</b></li></ul><button type="button" onClick={() => goTo("screen-cases")}>관련 과거 사례 보기</button></section>
          <p className={styles.disclaimer}>검색 결과는 DB에 저장된 사건과 가격 데이터만 사용하며 투자 자문이 아니에요.</p>
        </div>
        <nav className={styles.miniFooter}><button onClick={() => goTo("screen-home")}>⌂<small>홈</small></button><button onClick={() => goTo("screen-realtime")}>▦<small>실시간</small></button><button>☆<small>즐겨찾기</small></button><button className={styles.selected}>⌕<small>자연어</small></button></nav>
      </div>
    </section>
  );
}
