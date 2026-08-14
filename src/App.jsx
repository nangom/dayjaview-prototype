import React from 'react';
import { ActionButton, Badge } from '@seed-design/react';
import { IOSDevice } from './IOSDevice.jsx';
import { css } from './css.js';

const LOGO_WHITE = '/dejavu-logo-white.png';
const LOGO_MARK = '/dejavu-mark.png';

// 기기 목업 고정 크기 (iPhone 15 Pro). vals()의 w/h 와 같은 값이어야 한다.
const FRAME_W = 393;
const FRAME_H = 852;
const FRAME_PAD = 40;      // 목업 바깥 여백 (넓은 화면에서만)
const BARE_MAX_W = 520;    // 이 폭 미만이면 프레임 없이 꽉 채운다

export default class App extends React.Component {
  state = {
    screen: 'splash', theme: 'LED', hz: 1, pickIdx: 0, hover: null, plus: false,
    notif: true, saved: false, savedMap: {}, tab: 'home', byReturn: false,
    toast: null, menu: false, savedPanel: false, savedQ: '', searchQ: '', libraryTab: 'saved', darkMode: false, scale: 1, bare: false
  };

  themes = [
    { rank: 1, title: '전선', chg: '+6.26%' },
    { rank: 2, title: 'S7(삼성전자/SK하이닉스 등)', chg: '+5.41%' },
    { rank: 3, title: 'IT 대표주', chg: '+5.31%' },
    { rank: 4, title: '반도체 대표주(생산)', chg: '+4.75%' },
    { rank: 5, title: 'LED 장비', chg: '+4.47%' },
    { rank: 6, title: '국내 상장 중국기업', chg: '+4.33%' },
    { rank: 7, title: '뉴로모픽 반도체', chg: '+4.16%' },
    { rank: 8, title: '건설 중소형', chg: '+3.75%' },
    { rank: 9, title: '반도체 기판', chg: '+3.67%' },
    { rank: 10, title: 'LED', chg: '+3.63%' }
  ];

  cases = [
    { y: '2025', md: '04.03', title: 'LED 조명 교체 예산 확대', sub: '공공 발주 물량 증가', r: ['+0.9%', '+3.2%', '+4.4%'] },
    { y: '2024', md: '11.18', title: '마이크로 LED 양산 발표', sub: '대형 고객사 공급 계약', r: ['-0.3%', '-1.4%', '+1.1%'] },
    { y: '2023', md: '08.07', title: 'LED 장비 수출 회복', sub: '중국 설비 투자 재개', r: ['+1.2%', '+2.1%', '+2.8%'] },
    { y: '2022', md: '12.21', title: '조명 규제 개선 논의', sub: '산업 육성 기대 확산', r: ['+0.4%', '+0.8%', '-0.7%'] },
    { y: '2021', md: '09.14', title: '차량용 LED 수요 증가', sub: '전장 부품 단가 상승', r: ['+0.2%', '-0.6%', '+1.9%'] },
    { y: '2021', md: '03.22', title: '스마트공장 보급 확대', sub: '산업용 조명 수요 기대', r: ['+1.8%', '+4.5%', '+3.1%'] },
    { y: '2020', md: '10.05', title: '살균 UV LED 각광', sub: '위생 설비 투자 확대', r: ['+2.4%', '+5.2%', '-1.2%'] },
    { y: '2019', md: '06.11', title: '백라이트 전환 가속', sub: '패널 업체 단가 인상', r: ['-0.5%', '+1.7%', '+2.2%'] },
    { y: '2018', md: '02.27', title: '옥외 전광판 교체 발주', sub: '지자체 예산 집행', r: ['+0.7%', '+2.9%', '+0.4%'] },
    { y: '2016', md: '09.08', title: 'LED 조명 의무화 논의', sub: '에너지 효율 규제 강화', r: ['+1.1%', '-2.1%', '+1.5%'] }
  ];

  memberRows = [
    { name: '루멘스', v: [1.8, 4.7, 6.1] },
    { name: '서울반도체', v: [2.1, 5.4, 8.2] },
    { name: '엘이디코리아', v: [-0.3, 2.8, -1.1] },
    { name: '한솔테크닉스', v: [1.2, -0.4, 2.3] }
  ];

  hzLabels = ['1일 후', '5일 후', '20일 후'];

  wheelItems = [];
  wheelPill = 'display:flex;align-items:center;gap:12px;flex:none;padding:15px 20px;border-radius:26px;border:1.5px solid rgba(255,255,255,.85);cursor:pointer;text-align:left;font-family:inherit;'
    + 'background:linear-gradient(150deg,rgba(255,255,255,.62) 0%,rgba(255,255,255,.34) 55%,rgba(232,232,228,.34) 100%);'
    + 'backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%);'
    + 'box-shadow:0 0 0 1px rgba(22,22,15,.045),0 12px 26px -12px rgba(22,22,15,.2),inset 0 1.5px 1px rgba(255,255,255,.95),inset 0 -2px 4px rgba(22,22,15,.045);'
    + 'will-change:transform,opacity;transform-origin:center center;';

  layoutWheel() {
    const el = this.wheelEl;
    if (!el) return;
    cancelAnimationFrame(this._wheelRaf);
    this._wheelRaf = requestAnimationFrame(() => {
      const kids = Array.from(el.children);
      if (kids.length) this.wheelItems = kids;
      const first = this.wheelItems[0];
      if (!first || !el.clientHeight) return;
      const h = el.clientHeight;
      const n = this.themes.length;
      const itemH = first.offsetHeight;
      this.focusShift = 56;
      el.style.paddingTop = Math.max(0, h / 2 - itemH / 2 - this.focusShift) + 'px';
      el.style.paddingBottom = Math.max(0, h / 2 - itemH / 2 + this.focusShift) + 'px';

      const mid = this.wheelItems[n];
      if (!mid) return;
      this.cycleH = mid.getBoundingClientRect().top - first.getBoundingClientRect().top;

      if (!this._centered) {
        this._centered = true;
        const box = el.getBoundingClientRect();
        const r = mid.getBoundingClientRect();
        el.scrollTop += (r.top + r.height / 2) - (box.top + box.height / 2 - this.focusShift);
        // 첫 화면에서는 1위와 2위 사이에 초점을 둬 두 항목을 함께 강조한다.
        el.scrollTop += (itemH + 8) / 2;
        this.baseTop = el.scrollTop;
      }

      if (!this._wheelBound) {
        this._wheelBound = true;
        el.addEventListener('scroll', this.onWheelScroll, { passive: true });
        ['pointerdown', 'wheel', 'touchstart'].forEach(ev => el.addEventListener(ev, this.holdAuto, { passive: true }));
        this.scheduleAuto(2600);
      }
      this.paintWheel();
    });
  }

  holdAuto = () => {
    this._userAt = performance.now();
    this.scheduleAuto(3200);
  };

  scheduleAuto(delay) {
    clearTimeout(this._autoT);
    this._autoT = setTimeout(this.autoAdvance, delay);
  }

  autoAdvance = () => {
    const el = this.wheelEl;
    if (!el) return;
    const step = this.wheelItems[0] ? this.wheelItems[0].offsetHeight + 8 : 70;
    if (performance.now() - (this._userAt || 0) < 2600) { this.scheduleAuto(1600); return; }
    this._auto = true;
    el.scrollTo({ top: el.scrollTop + step, behavior: 'smooth' });
    setTimeout(() => { this._auto = false; }, 700);
    this.scheduleAuto(2600);
  };

  onWheelScroll = () => {
    if (!this._auto) this._userAt = performance.now();
    const el = this.wheelEl;
    if (el && this.cycleH) {
      if (el.scrollTop < this.cycleH * 0.5) el.scrollTop += this.cycleH;
      else if (el.scrollTop > this.cycleH * 1.5) el.scrollTop -= this.cycleH;
    }
    if (this._paintRaf) return;
    this._paintRaf = requestAnimationFrame(() => { this._paintRaf = 0; this.paintWheel(); });
  };

  paintWheel = () => {
    const el = this.wheelEl;
    if (!el) return;
    const dark = this.state.darkMode;
    const box = el.getBoundingClientRect();
    const focus = box.top + box.height / 2 - (this.focusShift || 0);
    const step = (this.wheelItems[0] ? this.wheelItems[0].offsetHeight : 62) + 8;
    let closest = { distance: Infinity, index: 0 };
    this.wheelItems.forEach((item, index) => {
      if (!item) return;
      const r = item.getBoundingClientRect();
      const distance = Math.abs(r.top + r.height / 2 - focus);
      const k = Math.min(distance / step, 7);
      if (distance < closest.distance) closest = { distance, index };
      const near = Math.max(0, 1 - k);
      item.style.transform = 'scale(' + (0.92 + near * 0.08 - Math.min(k * 0.01, 0.04)).toFixed(3) + ')';
      item.style.opacity = String(k <= 1 ? 1 : Math.max(0.2, 1 - (k - 1) * 0.2).toFixed(3));
      item.style.filter = k > 0.6 ? 'blur(' + Math.min((k - 0.6) * 0.45, 1.6).toFixed(2) + 'px)' : 'none';
      item.style.zIndex = String(100 - Math.round(k * 5));
      item.style.boxShadow = 'none';
      item.style.borderColor = near > 0.3 ? 'rgba(255,111,15,' + (0.35 + near * 0.55).toFixed(2) + ')' : (dark ? '#3B3D42' : '#E8E9EC');
      item.style.background = near > 0.3 ? (dark ? '#3A2B24' : '#FFF8F3') : (dark ? '#292B2F' : '#FFFFFF');
    });
    this.focusedWheelTheme = this.themes[closest.index % this.themes.length];
  };

  flash(msg) {
    clearTimeout(this._t);
    this.setState({ toast: msg });
    this._t = setTimeout(() => this.setState({ toast: null }), 2000);
  }

  go(screen, extra) {
    this.setState(Object.assign({ screen, plus: false, hover: null }, extra || {}));
  }

  componentDidMount() {
    const q = new URLSearchParams(location.search).get('screen');
    if (q && q !== 'splash') this.setState({ screen: q });
    else this._splash = setTimeout(() => { if (this.state.screen === 'splash') this.go('home'); }, 2800);
    window.addEventListener('resize', this.fitFrame);
    // resize 이벤트가 오지 않는 환경(인앱 웹뷰, 분할 화면, 개발자도구 기기 모드)이
    // 있어서 문서 크기 자체도 같이 관찰한다.
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(this.fitFrame);
      this._ro.observe(document.documentElement);
    }
    this.fitFrame();
  }

  componentWillUnmount() {
    clearTimeout(this._t);
    clearTimeout(this._splash);
    clearTimeout(this._autoT);
    cancelAnimationFrame(this._wheelRaf);
    window.removeEventListener('resize', this.fitFrame);
    if (this._ro) this._ro.disconnect();
    if (this.wheelEl) this.wheelEl.removeEventListener('scroll', this.onWheelScroll);
  }

  // 좁은 화면(= 실제 모바일)에서는 목업 프레임을 벗기고 화면을 꽉 채운다.
  // 진짜 폰 안에 폰 목업을 또 그리면 앱이 아니라 데모처럼 보인다.
  //
  // 넓은 화면에서는 목업으로 보여주되, 393x852 고정 크기라 flex 아이템으로 두면
  // 폭만 줄고 높이 852는 그대로 남아 비율이 깨진다. 레이아웃으로 줄이지 않고
  // transform:scale 로 통째로 축소한다.
  fitFrame = () => {
    const bare = window.innerWidth < BARE_MAX_W;
    const scale = bare ? 1 : Math.max(0.2, Math.min(
      1,
      (window.innerWidth - FRAME_PAD * 2) / FRAME_W,
      (window.innerHeight - FRAME_PAD * 2) / FRAME_H
    ));
    if (scale !== this.state.scale || bare !== this.state.bare) this.setState({ scale, bare });
  };

  // 화면 상단 여백. 목업 모드에서는 가짜 상태바(62px)를 피하려고 50~60px을 쓴다.
  // bare 모드는 상태바를 안 그리므로 그만큼 줄인다. 다만 홈 화면에 추가해
  // 전체화면으로 뜨면 진짜 iOS 상태바가 콘텐츠 위에 겹치므로 안전영역을 더해
  // 그 아래에서 시작하게 한다. 일반 브라우저에서는 inset 이 0이라 영향이 없다.
  padTop(base) {
    if (!this.state.bare) return Math.max(base - 34, 14) + 'px';
    return 'calc(env(safe-area-inset-top, 0px) + ' + Math.max(base - 34, 14) + 'px)';
  }

  // 화면 하단 여백. bare 모드는 가짜 홈 인디케이터(34px)를 안 그리는 대신
  // 전체화면일 때 진짜 인디케이터에 가리지 않도록 안전영역을 더한다.
  padBottom(base) {
    if (!this.state.bare) return base + 'px';
    return 'calc(env(safe-area-inset-bottom, 0px) + ' + base + 'px)';
  }

  wheelRef = el => {
    if (el && el !== this.wheelEl) {
      if (this.wheelEl) {
        this.wheelEl.removeEventListener('scroll', this.onWheelScroll);
        ['pointerdown', 'wheel', 'touchstart'].forEach(ev => this.wheelEl.removeEventListener(ev, this.holdAuto));
      }
      this.wheelEl = el;
      this._wheelBound = false;
      this._centered = false;
      clearTimeout(this._autoT);
    }
    this.layoutWheel();
  };

  vals() {
    const up = '#E5484D', down = '#2F6BE0', ink = '#16160F';
    const tone = v => (String(v).trim().startsWith('-') || String(v).trim().startsWith('−') ? down : up);
    const st = this.state, hz = st.hz, hv = st.hover;
    const picked = this.cases[st.pickIdx];
    const pickedDate = picked.y + '.' + picked.md;

    const stats = [
      { label: '평균', vals: ['+0.4', '+1.3', '+2.8'], tone: true },
      { label: '중앙값', vals: ['+0.2', '+0.8', '+1.9'], tone: true },
      { label: '상승 비율', vals: ['18/34', '20/34', '21/34'], tone: false },
      { label: '변동성', vals: ['2.1', '4.6', '8.2'], tone: false }
    ];
    const bins = [
      { n: 2, range: '−15% ~ −10%' }, { n: 4, range: '−10% ~ −5%' }, { n: 6, range: '−5% ~ 0%' },
      { n: 9, range: '0% ~ +5%' }, { n: 7, range: '+5% ~ +10%' }, { n: 4, range: '+10% ~ +15%' }, { n: 2, range: '+15% ~ +20%' }
    ];
    const maxN = Math.max(...bins.map(b => b.n));
    const quality = [
      { k: '최대 하락폭(MDD)', v: '−6.4%', color: down },
      { k: 'KOSPI 초과수익 · 20일', v: '+1.7%', color: up },
      { k: '제외된 사례', v: '8건', color: ink },
      { k: '계산 버전', v: 'v3.0', color: ink },
      { k: '출처', v: 'KRX · 인포스탁', color: ink }
    ];
    const memberRows = st.byReturn ? [...this.memberRows].sort((a, b) => b.v[1] - a.v[1]) : this.memberRows;
    const caseRow = c => ({
      key: c.y + c.md,
      date: c.y + '.' + c.md,
      title: c.title,
      tags: [c.sub.split(' ')[0], c.sub.split(' ').slice(-1)[0]],
      retLabel: c.r[hz],
      color: tone(c.r[hz]),
      open: () => this.go('case', { pickIdx: this.cases.indexOf(c) })
    });

    return {
      w: 393, h: 852,
      isDark: st.screen === 'splash',
      pageBg: st.screen === 'splash' ? '#000000' : (st.darkMode ? '#202124' : '#FFFFFF'),
      isSplash: st.screen === 'splash',
      isHome: st.screen === 'home',
      isTheme: st.screen === 'theme',
      isCases: st.screen === 'cases',
      isCase: st.screen === 'case',
      isStats: st.screen === 'stats',
      isSearch: st.screen === 'search',
      isLibrary: st.screen === 'library',
      isSettings: st.screen === 'settings',
      darkMode: st.darkMode,
      toggleDarkMode: () => this.setState(s => ({ darkMode: !s.darkMode }), this.paintWheel),

      theme: st.theme,
      themeChg: st.themeChg ?? '+3.63%',
      themeRank: st.themeRank ?? '10',
      hasRank: !!(st.themeRank ?? '10'),

      wheel: [0, 1, 2].reduce((acc, copy) => acc.concat(this.themes.map((t, j) => {
        const idx = copy * this.themes.length + j;
        return {
          key: 'w' + copy + '-' + t.rank,
          rank: String(t.rank),
          title: t.title,
          chg: t.chg,
          open: () => { this.wheelPick = j; this.go('theme', { theme: t.title, themeChg: t.chg, themeRank: String(t.rank) }); },
          ref: el => { this.wheelItems[idx] = el; }
        };
      })), []),

      plus: st.plus,
      quick: [
        { key: 'q1', title: '관심 테마 보기', d: 'M12 4.5l2.3 4.9 5.2 .7-3.8 3.7.9 5.2-4.6-2.5-4.6 2.5.9-5.2L4.5 10l5.2-.7z', go: () => this.flash('관심 테마 3개') },
        { key: 'q2', title: '오늘 급등 종목', d: 'M4 17l6-6 3 3 7-7M14 7h6v6', go: () => this.flash('급등 종목 12개') },
        { key: 'q3', title: '알림 설정', d: 'M6.2 16.2h11.6l-1.6-2.2v-3.6a4.2 4.2 0 0 0-8.4 0V14zM10.4 18.6a1.8 1.8 0 0 0 3.2 0', go: () => this.flash('알림 설정 준비 중') }
      ],
      closeAll: () => this.setState({ plus: false }),
      saveFocusedTheme: () => {
        const target = this.focusedWheelTheme || this.themes[0];
        this.setState(s => ({ savedMap: { ...s.savedMap, [target.title]: true } }));
        this.flash(target.title + ' 테마를 저장했습니다');
      },

      reason: '정부 공공 조명 교체 예산 확대와 마이크로 LED 신규 수주 소식이 겹치며 관련 종목 전반이 강세를 보였습니다.',
      stocks: ['서울반도체', '루멘스', '엘이디코리아'],
      horizons: [
        { key: 'h1', label: '1일 후', val: '+0.4%', hit: '18/34 상승', color: up },
        { key: 'h5', label: '5일 후', val: '+1.3%', hit: '20/34 상승', color: up },
        { key: 'h20', label: '20일 후', val: '+2.8%', hit: '21/34 상승', color: up }
      ],
      topCases: this.cases.slice(0, 5).map(caseRow),
      links: [
        { key: 'l1', label: '과거 사례 전체보기', go: () => this.go('cases') },
        { key: 'l2', label: '상세 통계', go: () => this.go('stats') }
      ],
      isCurrentSaved: !!st.savedMap[st.theme],
      saveFill: st.savedMap[st.theme] ? '#FF6F0F' : 'none',
      toggleSave: () => {
        const next = !st.savedMap[st.theme];
        this.setState(s => ({ saved: next, savedMap: { ...s.savedMap, [st.theme]: next } }));
        this.flash(next ? '저장한 테마에 담았습니다' : '저장한 테마에서 제거했습니다');
      },

      menu: st.menu,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      savedPanel: st.savedPanel,
      hasSavedItems: Object.keys(st.savedMap).some(key => st.savedMap[key]),
      openSavedPanel: () => this.setState({ savedPanel: true }),
      closeSavedPanel: () => this.setState({ savedPanel: false }),
      savedItems: Object.keys(st.savedMap).filter(key => st.savedMap[key]).map(title => {
        const hit = this.themes.find(t => t.title === title);
        return {
          key: title,
          title,
          chg: hit?.chg || '',
          remove: e => {
            e.stopPropagation();
            this.setState(s => ({
              saved: s.theme === title ? false : s.saved,
              savedMap: { ...s.savedMap, [title]: false }
            }));
            this.flash(title + ' 테마를 저장 목록에서 제거했습니다');
          },
          open: () => this.setState({ savedPanel: false }, () => this.go('theme', {
            theme: title,
            themeChg: hit?.chg || '+3.63%',
            themeRank: hit ? String(hit.rank) : ''
          }))
        };
      }),
      searchQ: st.searchQ,
      onSearchQ: e => this.setState({ searchQ: e.target.value }),
      searchItems: this.themes.filter(t => !st.searchQ.trim() || t.title.toLowerCase().includes(st.searchQ.trim().toLowerCase())).map(t => ({
        ...t,
        open: () => this.go('theme', { theme: t.title, themeChg: t.chg, themeRank: String(t.rank) })
      })),
      libraryTab: st.libraryTab,
      setLibraryTab: tab => this.setState({ libraryTab: tab }),
      savedQ: st.savedQ || '',
      onSavedQ: e => this.setState({ savedQ: e.target.value }),
      savedGroups: [
        {
          key: 'today', label: '오늘',
          items: [
            { title: '전선', chg: '+6.26%', meta: '08.12 저장 · 상승 1위' },
            { title: 'S7(삼성전자/SK하이닉스 등)', chg: '+5.41%', meta: '08.12 저장 · 상승 2위' }
          ]
        },
        {
          key: 'week', label: '지난 7일',
          items: [
            { title: 'LED 장비', chg: '+4.47%', meta: '08.09 저장 · 사례 34건' },
            { title: '뉴로모픽 반도체', chg: '+4.16%', meta: '08.07 저장 · 사례 21건' },
            { title: '건설 중소형', chg: '-1.24%', meta: '08.06 저장 · 사례 18건' }
          ]
        }
      ].map(g => ({
        key: g.key,
        label: g.label,
        items: g.items
          .filter(s => !(st.savedQ || '').trim() || s.title.toLowerCase().includes((st.savedQ || '').trim().toLowerCase()))
          .map(s => ({
            key: s.title,
            title: s.title,
            chg: s.chg,
            meta: s.meta,
            color: s.chg.trim().startsWith('-') ? down : up,
            open: () => this.setState({ menu: false }, () => {
              const hit = this.themes.find(t => t.title === s.title);
              this.go('theme', { theme: s.title, themeChg: s.chg, themeRank: hit ? String(hit.rank) : '' });
            })
          }))
      })).filter(g => g.items.length),
      savedNone: !['전선', 'S7(삼성전자/SK하이닉스 등)', 'LED 장비', '뉴로모픽 반도체', '건설 중소형']
        .some(t => !(st.savedQ || '').trim() || t.toLowerCase().includes((st.savedQ || '').trim().toLowerCase())),

      tabs: this.hzLabels.map((label, i) => ({
        key: label,
        label,
        pick: () => this.setState({ hz: i }),
        style: 'flex:1;padding:12px 0;border:none;border-radius:17px;cursor:pointer;font-family:inherit;font-size:15px;letter-spacing:-0.01em;transition:background .16s ease,color .16s ease;'
          + (i === hz ? 'background:var(--seed-color-bg-brand-solid);color:#fff;font-weight:700;box-shadow:0 6px 14px -8px rgba(255,111,15,.45);' : 'background:transparent;color:#9A998F;font-weight:600;')
      })),
      allCases: this.cases.map(caseRow),

      picked: { date: pickedDate, title: picked.title, sub: picked.sub },
      perfCells: [
        { key: 'p1', label: '1일 후', val: '+0.4%', hit: '상승 18/34' },
        { key: 'p5', label: '5일 후', val: '+1.3%', hit: '상승 20/34' },
        { key: 'p20', label: '20일 후', val: '+2.8%', hit: '상승 21/34' }
      ].map(p => ({
        ...p,
        color: '#D83A43',
        cell: 'border-radius:22px;padding:16px 14px 18px;text-align:center;background:#FFE9EA;transition:transform .16s ease,box-shadow .16s ease'
      })),
      perfStats: [
        { key: 's1', label: '평균 지속', val: '6.2 거래일' },
        { key: 's2', label: '변동성 (20일 후)', val: '±8.2%' }
      ],
      kwRows: [
        { word: '공공발주', n: 9, rate: 78, lift: '+2.6%p' },
        { word: '예산', n: 12, rate: 67, lift: '+2.1%p' },
        { word: '조명', n: 14, rate: 64, lift: '+1.8%p' },
        { word: '수출', n: 11, rate: 64, lift: '+1.5%p' },
        { word: '양산', n: 7, rate: 57, lift: '+1.1%p' }
      ].map(k => ({
        key: k.word,
        word: k.word,
        lift: k.lift,
        meta: '표본 ' + k.n + '건 · 상승 ' + k.rate + '%',
        bar: 'display:block;height:100%;width:' + k.rate + '%;border-radius:3px;background:#D83A43'
      })),
      caseTags: picked.sub.split(' ').slice(0, 3),
      members: (() => {
        const rows = memberRows.map(r => ({ name: r.name, n: r.v[1], basket: false }));
        const avg = rows.reduce((s, r) => s + r.n, 0) / (rows.length || 1);
        rows.push({ name: '바스켓 평균 (동일가중)', n: Math.round(avg * 10) / 10, basket: true });
        return rows.map((r, i) => ({
          key: r.name,
          name: r.name,
          val: (r.n > 0 ? '+' : r.n < 0 ? '−' : '') + Math.abs(r.n).toFixed(1) + '%',
          rowStyle: 'display:flex;align-items:center;padding:16px 18px;'
            + (r.basket
              ? 'background:#F6F7FB;border-top:1px solid #DDE1E8;'
              : (i === rows.length - 1 ? '' : 'border-bottom:1px solid #ECEEF3;')),
          nameStyle: 'flex:1;min-width:0;font-size:16px;font-weight:' + (r.basket ? 800 : 500) + ';letter-spacing:-0.015em;color:#321E37;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
          valStyle: 'width:88px;text-align:right;font-size:16px;font-weight:800;letter-spacing:-0.01em;color:' + (r.n < 0 ? '#3267D6' : '#D83A43')
        }));
      })(),
      sortLabel: st.byReturn ? '수익률 높은 순' : '종목명 순',
      toggleSort: () => this.setState(s => ({ byReturn: !s.byReturn })),
      sortByName: () => this.setState({ byReturn: false }),
      sortByReturn: () => this.setState({ byReturn: true }),
      isReturnSort: st.byReturn,

      statCols: ['1일', '5일', '20일'],
      statRows: stats.map((s, i) => ({
        key: s.label,
        label: s.label,
        rowStyle: 'display:flex;align-items:center;padding:15px 0;' + (i === stats.length - 1 ? '' : 'border-bottom:1px solid #F5F4EF;'),
        cells: s.vals.map((v, vi) => ({
          key: vi,
          val: v,
          style: 'width:54px;text-align:right;font-size:15px;font-weight:700;letter-spacing:-0.01em;color:' + (s.tone ? tone(v) : ink)
        }))
      })),
      bins: bins.map((b, i) => {
        const on = hv === i;
        return {
          key: i,
          n: b.n,
          hover: () => this.setState({ hover: i }),
          label: 'font-size:11.5px;font-weight:700;transition:color .14s ease,opacity .14s ease;'
            + (on ? 'color:#16160F;opacity:1' : 'color:#A9A89E;opacity:' + (hv === null ? '1' : '.35')),
          bar: 'width:100%;height:' + Math.round((b.n / maxN) * 84) + 'px;border-radius:8px 8px 4px 4px;transform-origin:bottom;animation:grow .5s cubic-bezier(.2,.8,.3,1) both;transition:background .14s ease,box-shadow .14s ease;'
            + (on ? 'background:#FF6F0F;box-shadow:0 8px 16px -8px rgba(255,111,15,.5)' : 'background:' + (hv === null ? '#FFB27F' : '#FFE0CC'))
        };
      }),
      tip: hv === null ? null : {
        range: bins[hv].range,
        count: bins[hv].n + '건',
        style: 'position:absolute;bottom:100%;left:' + ((hv + 0.5) / bins.length * 100) + '%;transform:translate(-50%,-6px);display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 12px;border-radius:14px;background:#16160F;box-shadow:0 10px 24px -12px rgba(22,22,15,.7);white-space:nowrap;pointer-events:none;animation:fadeIn .12s ease both'
      },
      clearHover: () => this.setState({ hover: null }),
      axis: ['−10%', '0%', '+10%', '+20%'],
      quality: quality.map((q, i) => ({
        ...q,
        key: q.k,
        rowStyle: 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;' + (i === quality.length - 1 ? '' : 'border-bottom:1px solid #F5F4EF;')
      })),

      toast: st.toast,
      toHome: () => this.go('home'),
      toTheme: () => this.go('theme'),
      toCases: () => this.go('cases')
    };
  }

  renderSeedHome(v) {
    const rankedThemes = v.wheel.slice(0, 10);
    return (
      <div className="seed-pilot seed-home" style={css('position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;animation:popBack .28s ease both')}>
        <header style={css('flex:none;padding:' + this.padTop(50) + ' 20px 14px')}>
          <div style={css('display:flex;align-items:center;justify-content:space-between')}>
            <img src={LOGO_MARK} alt="DAY-JA-VIEW" className="seed-home-corner-logo" />
            <button className="seed-icon-button seed-home-search" onClick={() => this.go('search')} aria-label="테마·종목 검색">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </button>
          </div>
          <div style={css('margin-top:26px')}>
            <Badge tone="brand" variant="weak" size="large">8월 12일 장 마감</Badge>
            <h1 className="seed-home-title">오늘 많이 오른 테마예요</h1>
            <p style={css('margin:0;font-size:15px;line-height:1.5;color:var(--seed-color-fg-neutral-muted)')}>상승률과 과거 움직임을 한눈에 확인해 보세요.</p>
          </div>
        </header>

        <main style={css('flex:1;min-height:0;display:flex;flex-direction:column;padding:0 20px 94px')}>
          <div ref={this.wheelRef} className="seed-wheel seed-flat-wheel" style={css('flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:8px')}>
            {v.wheel.map((a, index) => (
              <button key={a.key} ref={a.ref} onClick={a.open} className="seed-rank-row seed-flat-wheel-row">
                <span className={'seed-rank-number ' + ((index % rankedThemes.length) < 3 ? 'is-top' : '')}>{a.rank}</span>
                <span style={css('flex:1;min-width:0;text-align:left')}>
                  <span style={css('display:block;font-size:17px;font-weight:700;letter-spacing:-.02em;color:var(--seed-color-fg-neutral);white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{a.title}</span>
                  <span style={css('display:block;margin-top:4px;font-size:13px;color:var(--seed-color-fg-neutral-muted)')}>{(index % rankedThemes.length) < 3 ? '거래량도 함께 증가했어요' : '오늘의 상승 테마'}</span>
                </span>
                <span style={css('font-size:17px;font-weight:800;color:var(--seed-color-fg-brand);white-space:nowrap')}>{a.chg}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--seed-color-fg-neutral-subtle)" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
              </button>
            ))}
          </div>
          <div style={css('padding-top:10px;text-align:center;font-size:12px;color:var(--seed-color-fg-neutral-muted)')}>위아래로 돌려 테마를 탐색하세요</div>
          <p style={css('margin:8px 4px 0;text-align:center;font-size:11px;line-height:1.45;color:var(--seed-color-fg-neutral-subtle)')}>과거 데이터 기반 통계 정보이며 투자 자문이 아닙니다.</p>
        </main>

        {v.menu && <div onClick={v.closeMenu} style={css('position:absolute;inset:0;z-index:12;background:rgba(0,0,0,.28)')} />}
        {v.menu && (
          <aside className="seed-history-drawer">
            <div className="seed-history-header">
              <div>
                <Badge tone="brand" variant="weak">MY HISTORY</Badge>
                <h2>검색 히스토리</h2>
              </div>
              <button className="seed-history-close" onClick={v.closeMenu} aria-label="히스토리 닫기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>
              </button>
            </div>
            <p className="seed-history-description">최근 확인한 테마와 종목을 다시 볼 수 있어요.</p>
            <label className="seed-history-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
              <input value={v.savedQ} onChange={v.onSavedQ} placeholder="검색 기록 찾기" />
            </label>
            <div className="seed-history-list">
              {v.savedGroups.map(g => (
                <section key={g.key} className="seed-history-group">
                  <h3>{g.label}</h3>
                  {g.items.map(s => (
                    <button key={s.key} onClick={s.open} className="seed-history-row">
                      <span className="seed-history-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="8"/></svg>
                      </span>
                      <span className="seed-history-copy"><strong>{s.title}</strong><small>{s.meta}</small></span>
                      <span className="seed-history-return" style={{ color: s.color }}>{s.chg}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEB2B9" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                    </button>
                  ))}
                </section>
              ))}
              {v.savedNone && <div className="seed-history-empty">일치하는 검색 기록이 없습니다.</div>}
            </div>
            <div className="seed-history-footer">검색 기록은 이 기기에 저장됩니다.</div>
          </aside>
        )}

        {v.savedPanel && <div onClick={v.closeSavedPanel} style={css('position:absolute;inset:0;z-index:12;background:rgba(0,0,0,.28)')} />}
        {v.savedPanel && (
          <aside className="seed-saved-drawer">
            <div className="seed-history-header">
              <div><Badge tone="brand" variant="weak">SAVED</Badge><h2>저장한 항목</h2></div>
              <button className="seed-history-close" onClick={v.closeSavedPanel} aria-label="저장 목록 닫기"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
            </div>
            <p className="seed-history-description">저장한 항목과 최근 검색 기록을 한곳에서 확인하세요.</p>
            <div className="seed-history-list">
              {v.savedItems.length ? v.savedItems.map(item => (
                <button key={item.key} onClick={item.open} className="seed-history-row">
                  <span role="button" tabIndex="0" aria-label={item.title + ' 저장 해제'} onClick={item.remove} className="seed-history-icon seed-remove-star"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z"/></svg></span>
                  <span className="seed-history-copy"><strong>{item.title}</strong><small>저장한 테마</small></span>
                  <span className="seed-history-return">{item.chg}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEB2B9" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
                </button>
              )) : <div className="seed-saved-empty seed-saved-empty-compact"><span>☆</span><strong>아직 저장한 항목이 없어요</strong><p>테마 화면의 + 버튼을 눌러 저장해 보세요.</p></div>}
              <div className="seed-history-divider"><span>검색 히스토리</span></div>
              <label className="seed-history-search seed-history-search-in-drawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
                <input value={v.savedQ} onChange={v.onSavedQ} placeholder="검색 기록 찾기" />
              </label>
              {v.savedGroups.map(g => (
                <section key={g.key} className="seed-history-group">
                  <h3>{g.label}</h3>
                  {g.items.map(s => (
                    <button key={s.key} onClick={s.open} className="seed-history-row">
                      <span className="seed-history-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="8"/></svg></span>
                      <span className="seed-history-copy"><strong>{s.title}</strong><small>{s.meta}</small></span>
                      <span className="seed-history-return" style={{ color: s.color }}>{s.chg}</span>
                    </button>
                  ))}
                </section>
              ))}
              {v.savedNone && <div className="seed-history-empty">일치하는 검색 기록이 없습니다.</div>}
            </div>
          </aside>
        )}
      </div>
    );
  }

  renderSeedTheme(v) {
    return (
      <div className="seed-pilot seed-theme" style={css('position:absolute;inset:0;background:var(--seed-color-bg-layer-default);display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <header className="seed-theme-hero" style={{ paddingTop: this.padTop(48) }}>
          <div className="seed-theme-hero-nav">
            <button className="seed-icon-button seed-hero-icon" onClick={v.toHome} aria-label="뒤로가기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
            <span className="seed-theme-date">8월 12일 장 마감 기준</span>
            <button className={'seed-icon-button seed-hero-icon ' + (v.isCurrentSaved ? 'is-saved' : '')} onClick={v.toggleSave} aria-label={v.isCurrentSaved ? '즐겨찾기 해제' : '즐겨찾기 추가'}><svg width="22" height="22" viewBox="0 0 24 24" fill={v.isCurrentSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z"/></svg></button>
          </div>
          <div className="seed-theme-title-row"><h1>{v.theme}</h1><span className="seed-hero-rank">상승 {v.themeRank}위</span></div>
          <div className="seed-theme-change"><strong>{v.themeChg}</strong><span>오늘 테마 평균 등락</span></div>
        </header>

        <main className="seed-theme-main">
          <section className="seed-card">
            <div style={css('display:flex;align-items:center;justify-content:space-between')}><h2 className="seed-section-title">오늘 왜 올랐을까요?</h2><Badge tone="informative" variant="weak">요약</Badge></div>
            <p style={css('margin:14px 0 0;font-size:16px;line-height:1.58;font-weight:600;letter-spacing:-.015em;color:var(--seed-color-fg-neutral)')}>{v.reason}</p>
            <div style={css('display:flex;flex-wrap:wrap;gap:8px;margin-top:16px')}>{v.stocks.map(s => <span key={s} className="seed-stock-chip">{s}</span>)}</div>
          </section>

          <section className="seed-card" style={css('margin-top:14px')}>
            <h2 className="seed-section-title">과거엔 어땠을까요?</h2>
            <p className="seed-section-description">과거 34개 사례의 평균 움직임이에요.</p>
            <div style={css('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:16px')}>
              {v.horizons.map(h => <div key={h.key} className="seed-horizon"><span>{h.label}</span><strong>{h.val}</strong><small>{h.hit}</small></div>)}
            </div>
            <ActionButton size="large" variant="brandSolid" onClick={v.links[1].go} style={css('width:100%;margin-top:18px')}>상세 통계 보기</ActionButton>
          </section>

          <section style={css('margin-top:26px')}>
            <div><h2 className="seed-section-title">오늘과 비슷했던 과거</h2><p className="seed-section-description">유사도가 높은 사례부터 보여드려요.</p></div>
            <div style={css('display:flex;flex-direction:column;gap:10px;margin-top:14px')}>{v.topCases.slice(0, 3).map(c => this.renderCaseCard(c, false))}</div>
            <ActionButton size="large" variant="ghost" onClick={v.links[0].go} style={css('width:100%;margin-top:12px')}>과거 사례 전체보기</ActionButton>
          </section>
        </main>
      </div>
    );
  }

  renderSearchScreen(v) {
    return (
      <div className="seed-tab-screen" style={{ paddingTop: this.padTop(58) }}>
        <div className="seed-search-top-action">
          <button className="seed-icon-button seed-home-search" onClick={v.toHome} aria-label="검색 닫기">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="seed-tab-header"><Badge tone="brand" variant="weak">SEARCH</Badge><h1>테마·종목 검색</h1><p>확인하고 싶은 테마나 종목을 찾아보세요.</p></div>
        <label className="seed-main-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input autoFocus value={v.searchQ} onChange={v.onSearchQ} placeholder="테마 또는 종목명 입력" /></label>
        <div className="seed-tab-scroll">
          <div className="seed-result-count">검색 결과 {v.searchItems.length}개</div>
          {v.searchItems.map(item => <button key={item.rank} className="seed-search-row" onClick={item.open}><span><strong>{item.title}</strong><small>오늘 상승 {item.rank}위</small></span><b>{item.chg}</b><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#AEB2B9" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg></button>)}
        </div>
      </div>
    );
  }

  renderLibraryScreen(v) {
    const showSaved = v.libraryTab === 'saved';
    return (
      <div className="seed-tab-screen" style={{ paddingTop: this.padTop(58) }}>
        <div className="seed-tab-header"><Badge tone="brand" variant="weak">MY</Badge><h1>즐겨찾기</h1><p>저장한 항목과 최근 검색 기록을 확인하세요.</p></div>
        <div className="seed-library-tabs"><button className={showSaved ? 'is-selected' : ''} onClick={() => v.setLibraryTab('saved')}>저장됨</button><button className={!showSaved ? 'is-selected' : ''} onClick={() => v.setLibraryTab('history')}>히스토리</button></div>
        <div className="seed-tab-scroll">
          {showSaved ? (
            v.savedItems.length ? v.savedItems.map(item => <button key={item.key} onClick={item.open} className="seed-history-row"><span role="button" tabIndex="0" aria-label="저장 해제" onClick={item.remove} className="seed-history-icon seed-remove-star">★</span><span className="seed-history-copy"><strong>{item.title}</strong><small>저장한 테마</small></span><span className="seed-history-return">{item.chg}</span></button>) : <div className="seed-saved-empty"><span>☆</span><strong>아직 저장한 항목이 없어요</strong><p>테마 상세의 별을 눌러 저장해 보세요.</p></div>
          ) : (
            <><label className="seed-history-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input value={v.savedQ} onChange={v.onSavedQ} placeholder="검색 기록 찾기" /></label>{v.savedGroups.map(g => <section key={g.key} className="seed-history-group"><h3>{g.label}</h3>{g.items.map(s => <button key={s.key} onClick={s.open} className="seed-history-row"><span className="seed-history-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="8"/></svg></span><span className="seed-history-copy"><strong>{s.title}</strong><small>{s.meta}</small></span><span className="seed-history-return" style={{ color: s.color }}>{s.chg}</span></button>)}</section>)}</>
          )}
        </div>
      </div>
    );
  }

  renderSettingsScreen(v) {
    return <div className="seed-tab-screen" style={{ paddingTop: this.padTop(58) }}><div className="seed-tab-header"><Badge tone="brand" variant="weak">SETTINGS</Badge><h1>설정</h1><p>서비스 이용 환경을 관리하세요.</p></div><div className="seed-settings-card"><div><strong>다크 모드</strong><small>어두운 화면 테마로 전환합니다.</small></div><button role="switch" aria-checked={v.darkMode} onClick={v.toggleDarkMode} className={'seed-theme-switch ' + (v.darkMode ? 'is-on' : '')}><span /></button></div><div className="seed-settings-card"><div><strong>잠금화면 알림</strong><small>푸시 알림은 추후 연결 예정</small></div><span className="seed-coming-badge">준비 중</span></div><div className="seed-settings-card"><div><strong>데이터 기준</strong><small>장 마감 데이터 · KRX/인포스탁</small></div><span>›</span></div><div className="seed-settings-card"><div><strong>앱 정보</strong><small>DAY-JA-VIEW Prototype</small></div><span>›</span></div></div>;
  }

  renderBottomNav(v) {
    const items = [
      { key: 'home', label: '홈', d: 'm4 10 8-6 8 6v9H4zM10 19v-5h4v5' },
      { key: 'library', label: '즐겨찾기', d: 'm12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z' },
      { key: 'settings', label: '설정', solid: true, d: 'M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.62l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.2 7.2 0 0 0-1.62-.94L14.4 2.8a.49.49 0 0 0-.48-.4h-3.84a.49.49 0 0 0-.48.4l-.36 2.54c-.58.24-1.12.56-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.72 8.86a.49.49 0 0 0 .12.62l2.03 1.58c-.05.31-.07.64-.07.94s.02.63.07.94l-2.03 1.58a.49.49 0 0 0-.12.62l1.92 3.32c.12.22.38.31.59.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54c.04.23.24.4.48.4h3.84c.24 0 .44-.17.48-.4l.36-2.54a7.2 7.2 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.62l-2.02-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z' }
    ];
    const active = v.isHome ? 'home' : v.isSearch ? 'search' : v.isLibrary ? 'library' : v.isSettings ? 'settings' : '';
    return <nav className="seed-bottom-nav" aria-label="주요 메뉴">{items.map(item => <button key={item.key} className={active === item.key ? 'is-selected' : ''} onClick={() => this.go(item.key)}><svg width="22" height="22" viewBox="0 0 24 24" fill={item.solid ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={item.solid ? '0' : '1.8'} strokeLinecap="round" strokeLinejoin="round"><path d={item.d}/></svg><span>{item.label}</span></button>)}</nav>;
  }

  renderSplash(v) {
    return (
      <div onClick={v.toHome} style={css('position:absolute;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn .3s ease both')}>
        <div style={css('position:absolute;top:50%;left:50%;width:520px;height:520px;margin:-335px 0 0 -260px;border-radius:50%;background:radial-gradient(circle,rgba(255,111,15,.5) 0%,rgba(255,111,15,.14) 38%,rgba(255,111,15,0) 68%);filter:blur(18px);animation:halo 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
        <div style={css('position:relative;width:258px;height:96px;margin-bottom:150px')}>
          <div style={css(`position:absolute;inset:0;background:rgba(255,255,255,.5);-webkit-mask:url(${LOGO_WHITE}) center/contain no-repeat;mask:url(${LOGO_WHITE}) center/contain no-repeat;animation:breathe 3.4s cubic-bezier(.45,0,.55,1) infinite`)}></div>
          <div style={css(`position:absolute;inset:-40px;overflow:hidden;-webkit-mask:url(${LOGO_WHITE}) center/144px 96px no-repeat;mask:url(${LOGO_WHITE}) center/144px 96px no-repeat;filter:blur(9px);opacity:.85`)}>
            <div style={css('position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,111,15,0) 34%,rgba(255,111,15,.95) 50%,rgba(255,255,255,1) 56%,rgba(255,111,15,0) 70%);animation:sweep 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
          </div>
          <div style={css(`position:absolute;inset:0;overflow:hidden;-webkit-mask:url(${LOGO_WHITE}) center/contain no-repeat;mask:url(${LOGO_WHITE}) center/contain no-repeat`)}>
            <div style={css('position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,255,255,0) 36%,rgba(255,111,15,.9) 48%,#FFFFFF 55%,rgba(255,111,15,.55) 62%,rgba(255,255,255,0) 74%);animation:sweep 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
          </div>
        </div>
        <div style={css('position:absolute;left:0;right:0;bottom:96px;display:flex;flex-direction:column;align-items:center;gap:20px')}>
          <div style={css('font-size:14.5px;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.44)')}>오늘의 시장을, 과거의 기록으로</div>
          <div style={css('width:132px;height:3px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden')}>
            <div style={css('height:100%;border-radius:2px;background:#FF6F0F;transform-origin:left;animation:barFill 2.6s cubic-bezier(.3,.7,.2,1) both')}></div>
          </div>
        </div>
      </div>
    );
  }

  renderHome(v) {
    return (
      <div style={css('position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;animation:popBack .28s ease both')}>
        <div style={css('position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(420px 300px at 12% 46%,rgba(214,214,206,.5),transparent 70%),radial-gradient(380px 320px at 92% 66%,rgba(222,220,212,.55),transparent 72%),radial-gradient(300px 240px at 70% 34%,rgba(238,236,230,.7),transparent 70%)')}></div>

        <div style={css('position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(54) + ' 20px 0')}>
          <button className="tap-bg" onClick={v.openMenu} style={css('width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;padding:0;cursor:pointer;border-radius:22px')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A18" strokeWidth="1.9" strokeLinecap="round"><path d="M5 8.5h14M5 13h14M5 17.5h9"></path></svg>
          </button>
          <img src={LOGO_MARK} alt="Dejavu" style={css('height:30px;width:auto;display:block;mix-blend-mode:multiply')} />
          <span style={css('width:44px;height:44px')}></span>
        </div>

        <div style={css('position:relative;z-index:1;padding:26px 20px 40px')}>
          <div style={css('height:52px;margin-bottom:14px')}></div>
          <div style={css('font-size:34px;line-height:1.14;font-weight:700;letter-spacing:-0.03em;color:#B6B5AF')}>2026년 08월 12일</div>
          <div style={css('font-size:34px;line-height:1.14;font-weight:800;letter-spacing:-0.035em;color:#16160F')}>오늘의 요약</div>
        </div>

        <div ref={this.wheelRef} style={css('position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:0 20px;display:flex;flex-direction:column;gap:8px')}>
          {v.wheel.map(a => (
            <button key={a.key} ref={a.ref} onClick={a.open} style={css(this.wheelPill)}>
              <span style={css('width:32px;height:32px;flex:none;border-radius:11px;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.85);box-shadow:inset 0 1px 1px rgba(255,255,255,.9),0 1px 3px rgba(22,22,15,.06);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;color:#16160F')}>{a.rank}</span>
              <span style={css('font-size:19px;font-weight:700;letter-spacing:-0.02em;color:#16160F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0')}>{a.title}</span>
              <span style={css('margin-left:auto;padding-left:12px;font-size:19px;font-weight:700;letter-spacing:-0.01em;color:#E5484D;white-space:nowrap')}>{a.chg}</span>
            </button>
          ))}
        </div>

        <div style={css('position:relative;z-index:1;display:flex;align-items:center;justify-content:flex-end;padding:16px 20px 30px')}>
          <span style={css('width:58px;height:58px;display:block')}></span>
        </div>

        {v.menu && <div onClick={v.closeMenu} style={css('position:absolute;inset:0;z-index:12;background:rgba(22,22,15,.28);animation:fadeIn .18s ease both')}></div>}
        {v.menu && (
          <div style={css('position:absolute;top:0;bottom:0;left:0;z-index:13;width:300px;background:#fff;border-radius:0 26px 26px 0;box-shadow:0 20px 60px rgba(20,20,10,.28);display:flex;flex-direction:column;animation:drawerIn .26s cubic-bezier(.2,.85,.3,1) both')}>
            <div style={css('padding:' + this.padTop(60) + ' 22px 12px')}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>저장한 테마</div>
              <input value={v.savedQ} onChange={v.onSavedQ} placeholder="테마 검색" style={css('margin-top:14px;width:100%;box-sizing:border-box;padding:11px 14px;border:none;border-radius:14px;background:#F5F4F1;font-family:inherit;font-size:14px;font-weight:500;color:#16160F;outline:none')} />
            </div>
            <div style={css('flex:1;min-height:0;overflow-y:auto;padding:6px 22px 20px')}>
              {v.savedGroups.map(g => (
                <div key={g.key} style={css('display:flex;flex-direction:column')}>
                  <div style={css('margin:14px 0 6px;font-size:12px;font-weight:700;letter-spacing:.02em;color:#B4B3A9')}>{g.label}</div>
                  {g.items.map(s => (
                    <button key={s.key} className="row-hover" onClick={s.open} style={css('width:100%;display:flex;align-items:center;gap:10px;padding:14px 2px;border:none;border-bottom:1px solid #F3F2EE;background:none;cursor:pointer;text-align:left')}>
                      <span style={css('flex:1;min-width:0;display:flex;flex-direction:column;gap:4px')}>
                        <span style={css('font-size:15.5px;font-weight:600;letter-spacing:-0.015em;color:#16160F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{s.title}</span>
                        <span style={css('font-size:12px;font-weight:500;color:#B4B3A9')}>{s.meta}</span>
                      </span>
                      <span style={{ ...css('flex:none;font-size:15px;font-weight:800;letter-spacing:-0.01em'), color: s.color }}>{s.chg}</span>
                    </button>
                  ))}
                </div>
              ))}
              {v.savedNone && <div style={css('margin-top:70px;text-align:center;font-size:14px;font-weight:500;line-height:1.6;color:#B4B3A9')}>검색 결과가 없습니다</div>}
            </div>
            <div style={css('padding:14px 22px 30px;border-top:1px solid #F0EFEA;display:flex;align-items:center;gap:8px')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8E96" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="3.2"></circle><path d="M12 4.4v2M12 17.6v2M4.4 12h2M17.6 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7 15.9 8.1M8.1 15.9l-1.4 1.4"></path></svg>
              <span style={css('font-size:13.5px;font-weight:600;color:#8B8E96')}>설정</span>
            </div>
          </div>
        )}

        {v.plus && <div onClick={v.closeAll} style={css('position:absolute;inset:0;z-index:8;background:rgba(22,22,15,.16);animation:fadeIn .18s ease both')}></div>}
        {v.plus && (
          <div style={css('position:absolute;right:20px;bottom:100px;z-index:9;width:236px;background:#fff;border:1px solid #E9E8E3;border-radius:22px;padding:6px;box-shadow:0 18px 40px rgba(20,20,10,.16);animation:fadeIn .18s ease both')}>
            {v.quick.map(q => (
              <button key={q.key} className="quick-item" onClick={q.go} style={css('width:100%;display:flex;align-items:center;gap:12px;padding:13px 12px;border:none;background:none;border-radius:16px;cursor:pointer;text-align:left')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16160F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={q.d}></path></svg>
                <span style={css('font-size:15px;font-weight:600;color:#16160F')}>{q.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  renderTheme(v) {
    return (
      <div style={css('position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('position:absolute;top:0;left:0;right:0;height:340px;background:#000000')}></div>
        <div style={css('position:relative;z-index:1;flex:1;overflow-y:auto')}>
          <div style={css('padding:' + this.padTop(52) + ' 22px 34px')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:26px')}>
              <button className="press" onClick={v.toHome} aria-label="Back" style={css('width:46px;height:46px;border-radius:23px;border:none;cursor:pointer;background:rgba(80,255,235,.14);display:flex;align-items:center;justify-content:center')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#50FFEB" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
              </button>
              <span style={css('font-size:17px;font-weight:600;letter-spacing:-0.01em;color:rgba(80,255,235,.66)')}>8월 12일 장 마감 기준</span>
              <button className="press" onClick={v.toggleSave} aria-label="Save" style={css('width:46px;height:46px;border-radius:23px;border:none;cursor:pointer;background:rgba(80,255,235,.14);display:flex;align-items:center;justify-content:center')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={v.saveFill} stroke="#50FFEB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1z"></path></svg>
              </button>
            </div>
            <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:6px')}>
              <span style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#50FFEB')}>{v.theme}</span>
              {v.hasRank && <span style={css('padding:5px 12px;border-radius:14px;background:rgba(80,255,235,.16);font-size:13px;font-weight:700;color:#50FFEB')}>상승 {v.themeRank}위</span>}
            </div>
            <div style={css('font-size:86px;line-height:.96;font-weight:800;letter-spacing:-0.055em;color:#50FFEB;margin:6px 0 4px')}>{v.themeChg}</div>
            <div style={css('font-size:15px;font-weight:600;color:rgba(80,255,235,.62)')}>오늘 테마 평균 등락</div>
          </div>

          <div style={css('background:#fff;border-radius:34px 34px 0 0;box-shadow:0 -14px 34px -18px rgba(22,22,15,.28);padding:24px 22px 0;min-height:520px')}>
            <div style={css('border:1px solid #EAE9E4;border-radius:26px;padding:20px;box-shadow:0 8px 22px -14px rgba(22,22,15,.18)')}>
              <div style={css('font-size:12.5px;font-weight:700;letter-spacing:.08em;color:#9A998F;margin-bottom:12px')}>오늘 부각된 이유</div>
              <div style={css('font-size:18px;font-weight:700;line-height:1.42;letter-spacing:-0.02em;color:#16160F;text-wrap:pretty')}>{v.reason}</div>
              <div style={css('display:flex;flex-wrap:wrap;gap:8px;margin-top:16px')}>
                {v.stocks.map(s => (
                  <span key={s} style={css('padding:9px 14px;border-radius:16px;background:#F5F4F0;font-size:15px;font-weight:700;letter-spacing:-0.01em;color:#16160F')}>{s}</span>
                ))}
              </div>
              <div style={css('margin-top:14px;font-size:12.5px;font-weight:500;color:#A9A89E')}>출처 · 인포스탁</div>
            </div>

            <div style={css('margin-top:26px;border-radius:26px;padding:20px 18px;background:linear-gradient(150deg,rgba(246,247,251,.72) 0%,rgba(246,247,251,.42) 55%,rgba(232,234,244,.4) 100%);backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%);border:1px solid rgba(255,255,255,.8);box-shadow:0 0 0 1px rgba(22,22,15,.035),inset 0 1.5px 1px rgba(255,255,255,.9)')}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>과거 부각 사례 이후</div>
              <div style={css('margin-top:5px;font-size:13.5px;font-weight:500;color:#9A998F')}>분석 표본 34건 · 2010.03–2026.07</div>
              <div style={css('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px')}>
                {v.horizons.map(hz => (
                  <div key={hz.key} style={css('border-radius:20px;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);padding:16px 12px;text-align:center;box-shadow:0 1px 2px rgba(22,22,15,.05)')}>
                    <div style={css('font-size:13px;font-weight:600;color:#9A998F')}>{hz.label}</div>
                    <div style={{ ...css('margin-top:8px;font-size:24px;font-weight:800;letter-spacing:-0.03em'), color: hz.color }}>{hz.val}</div>
                    <div style={css('margin-top:6px;font-size:11.5px;font-weight:500;color:#B4B3A9')}>{hz.hit}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={css('padding:28px 0 0')}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>오늘과 가장 유사한 과거</div>
              <div style={css('margin-top:5px;font-size:13.5px;font-weight:500;color:#9A998F')}>최근 5건 · 5일 후 수익률</div>
              <div style={css('display:flex;flex-direction:column;gap:14px;margin-top:14px')}>
                {v.topCases.map(c => this.renderCaseCard(c, false))}
              </div>
            </div>

            <div style={css('display:flex;gap:12px;padding:18px 0 0')}>
              {v.links.map(l => (
                <button key={l.key} className="link-btn press-sm" onClick={l.go} style={css('flex:1;padding:18px 10px;border:1px solid #E7E6E1;border-radius:20px;background:#fff;cursor:pointer;text-align:center;font-family:inherit;font-size:16px;font-weight:700;letter-spacing:-0.015em;color:#16160F;transition:background .16s ease,transform .16s ease')}>{l.label}</button>
              ))}
            </div>

            <div style={css('padding:20px 0 40px;font-size:12px;font-weight:500;line-height:1.5;color:#B4B3A9')}>과거 수익률은 미래 성과를 보장하지 않으며 투자 판단의 근거로만 활용할 수 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  renderCaseCard(c, snap) {
    return (
      <button
        key={c.key}
        className="case-card press-sm"
        onClick={c.open}
        style={css((snap ? 'scroll-snap-align:start;scroll-snap-stop:always;' : '') + 'width:100%;flex:none;display:flex;flex-direction:column;align-items:stretch;gap:11px;padding:20px 23px;border:1px solid #EEEDE8;border-radius:28px;background:#fff;cursor:pointer;text-align:left;box-shadow:0 6px 18px -14px rgba(22,22,15,.35);transition:box-shadow .16s ease,transform .16s ease')}
      >
        <span style={css('display:flex;align-items:center;gap:10px')}>
          <span style={css('flex:1;min-width:0;display:flex;flex-direction:column;gap:7px')}>
            <span style={css('font-size:17px;font-weight:500;letter-spacing:-0.02em;color:#16160F')}>{c.date}</span>
            <span style={css('font-size:18px;font-weight:700;letter-spacing:-0.035em;font-synthesis:none;color:#16160F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{c.title}</span>
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C3C2B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css('flex:none')}><path d="M9 6l6 6-6 6"></path></svg>
        </span>
        <span style={css('display:flex;align-items:center;gap:8px')}>
          {c.tags.map((t, i) => (
            <span key={i} style={css('padding:6px 12px;border-radius:10px;background:var(--seed-color-bg-brand-weak);font-size:13.5px;font-weight:600;letter-spacing:-0.01em;color:var(--seed-color-fg-brand-contrast)')}>{t}</span>
          ))}
          <span style={{ ...css('margin-left:auto;font-size:18px;font-weight:800;letter-spacing:-0.025em'), color: c.color }}>{c.retLabel}</span>
        </span>
      </button>
    );
  }

  renderCases(v) {
    return (
      <div className="seed-pilot seed-cases" style={css('position:absolute;inset:0;background:var(--seed-color-bg-layer-default);display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="seed-detail-back press" onClick={v.toTheme} aria-label="테마 상세로 돌아가기">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#16160F')}>과거 사례</span>
          <button className="seed-icon-button" onClick={v.toggleSave} aria-label={v.isCurrentSaved ? '즐겨찾기 해제' : '즐겨찾기 추가'}><svg width="21" height="21" viewBox="0 0 24 24" fill={v.isCurrentSaved ? 'var(--seed-color-bg-brand-solid)' : 'none'} stroke={v.isCurrentSaved ? 'var(--seed-color-fg-brand)' : 'currentColor'} strokeWidth="1.8" strokeLinejoin="round"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z"/></svg></button>
        </div>
        <div style={css('flex:none;padding:14px 22px 28px')}>
          <div style={css('font-size:28px;font-weight:800;letter-spacing:-0.035em;color:#16160F')}>{v.theme} 테마</div>
          <div style={css('margin-top:6px;font-size:13.5px;font-weight:500;color:#9A998F')}>분석 표본 34건 · 최신 날짜순</div>
          <div style={css('display:flex;gap:6px;margin-top:16px;padding:6px;border-radius:22px;background:#F4F3EF')}>
            {v.tabs.map(t => (
              <button key={t.key} onClick={t.pick} style={css(t.style)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;scroll-snap-type:y mandatory;scroll-behavior:smooth;padding:20px 22px 112px;display:flex;flex-direction:column;gap:14px')}>
          {v.allCases.map(c => this.renderCaseCard(c, true))}
        </div>
      </div>
    );
  }

  renderCase(v) {
    return (
      <div className="seed-pilot seed-case" style={css('position:absolute;inset:0;background:var(--seed-color-bg-layer-default);display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="seed-detail-back press" onClick={v.toTheme} aria-label="장 마감 기준 테마 상세로 돌아가기">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#16160F')}>사례 상세</span>
          <button className="seed-icon-button" onClick={v.toggleSave} aria-label={v.isCurrentSaved ? '즐겨찾기 해제' : '즐겨찾기 추가'}><svg width="21" height="21" viewBox="0 0 24 24" fill={v.isCurrentSaved ? 'var(--seed-color-bg-brand-solid)' : 'none'} stroke={v.isCurrentSaved ? 'var(--seed-color-fg-brand)' : 'currentColor'} strokeWidth="1.8" strokeLinejoin="round"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z"/></svg></button>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;padding:14px 22px 112px')}>
          <div style={css('border-radius:26px;padding:22px;background:var(--seed-color-bg-brand-weak)')}>
            <div style={css('font-size:13.5px;font-weight:700;color:var(--seed-color-fg-brand-contrast)')}>{v.picked.date}</div>
            <div style={css('margin-top:8px;font-size:24px;font-weight:800;line-height:1.28;letter-spacing:-0.035em;color:#16160F;text-wrap:pretty')}>{v.picked.title}</div>
            <div style={css('margin-top:10px;font-size:15px;font-weight:500;line-height:1.55;color:var(--seed-color-fg-neutral-muted);text-wrap:pretty')}>{v.picked.sub} 소식이 전해지며 관련주가 함께 움직였습니다.</div>
            <div style={css('margin-top:16px;display:inline-flex;padding:7px 13px;border-radius:14px;background:rgba(255,255,255,.76);font-size:12.5px;font-weight:700;color:var(--seed-color-fg-brand-contrast)')}>출처 · 인포스탁</div>
          </div>

          <div style={css('margin-top:26px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#321E37')}>과거 사례 이후 성과</div>
          <div style={css('margin-top:5px;font-size:12.5px;font-weight:600;color:#8B8E96')}>34건 · 상승 21건 · 2010.03–2026.07</div>
          <div style={css('margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px')}>
            {v.perfCells.map(p => (
              <div key={p.key} className="lift" style={css(p.cell)}>
                <div style={css('font-size:13px;font-weight:700;letter-spacing:-0.01em;color:#321E37')}>{p.label}</div>
                <div style={{ ...css('margin-top:12px;font-size:22px;line-height:1;font-weight:800;letter-spacing:-0.03em'), color: p.color }}>{p.val}</div>
                <div style={css('margin-top:8px;font-size:12px;font-weight:600;color:#8B8E96')}>{p.hit}</div>
              </div>
            ))}
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px')}>
            {v.perfStats.map(p => (
              <div key={p.key} className="lift-soft" style={css('border-radius:20px;background:#F6F7FB;padding:16px 18px;transition:transform .16s ease,box-shadow .16s ease')}>
                <div style={css('font-size:12.5px;font-weight:600;color:#8B8E96')}>{p.label}</div>
                <div style={css('margin-top:8px;font-size:20px;line-height:1;font-weight:800;letter-spacing:-0.03em;color:#321E37')}>{p.val}</div>
              </div>
            ))}
          </div>

          <div style={css('margin-top:28px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#321E37')}>상승 동반 키워드</div>
          <div style={css('margin-top:5px;font-size:12.5px;font-weight:600;color:#8B8E96')}>5일 후 영향 · 등장 vs 미등장</div>
          <div style={css('margin-top:14px;border:1px solid #ECEEF3;border-radius:26px;background:#FFFFFF;padding:20px 18px;display:flex;flex-direction:column;gap:16px')}>
            {v.kwRows.map(k => (
              <div key={k.key} style={css('display:flex;align-items:center;gap:14px')}>
                <span style={css('width:60px;flex:none;font-size:17px;font-weight:800;letter-spacing:-0.02em;color:#321E37')}>{k.word}</span>
                <span style={css('flex:1;min-width:0;display:flex;flex-direction:column;gap:7px')}>
                  <span style={css('font-size:12px;font-weight:600;color:#8B8E96')}>{k.meta}</span>
                  <span style={css('height:5px;border-radius:3px;background:#ECEEF3;overflow:hidden')}>
                    <span style={css(k.bar)}></span>
                  </span>
                </span>
                <span style={css('flex:none;font-size:15.5px;font-weight:800;letter-spacing:-0.01em;color:#D83A43')}>{k.lift}</span>
              </div>
            ))}
          </div>
          <div style={css('margin-top:14px;font-size:12.5px;font-weight:500;line-height:1.55;color:#8B8E96;text-wrap:pretty')}>키워드가 등장한 과거 사건이 미등장 사건보다 5일 후 얼마나 더 올랐는지를 뜻합니다 (상승 동반 강도, 인과 아님). 표본 5~9건은 참고용이며 일반어는 제외했습니다.</div>

          <div style={css('margin-top:28px')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#321E37')}>종목별 5일 후 등락률</span>
            <div role="group" aria-label="종목 정렬 방식" className="seed-sort-control">
              <button onClick={v.sortByName} className={!v.isReturnSort ? 'is-selected' : ''}>종목명 순</button>
              <button onClick={v.sortByReturn} className={v.isReturnSort ? 'is-selected' : ''}>수익률 높은 순</button>
            </div>
            <div style={css('margin-top:8px;font-size:12px;font-weight:600;color:var(--seed-color-fg-neutral-muted)')}>현재 정렬: <strong style={css('color:var(--seed-color-fg-brand)')}>{v.sortLabel}</strong></div>
          </div>
          <div style={css('margin-top:12px;border:1px solid #ECEEF3;border-radius:26px;background:#FFFFFF;overflow:hidden')}>
            <div style={css('display:flex;align-items:center;padding:14px 18px;background:#F6F7FB')}>
              <span style={css('flex:1;font-size:12.5px;font-weight:600;color:#8B8E96')}>종목</span>
              <span style={css('width:88px;text-align:right;font-size:12.5px;font-weight:600;color:#8B8E96')}>5일 후 등락률</span>
            </div>
            {v.members.map(m => (
              <div key={m.key} style={css(m.rowStyle)}>
                <span style={css(m.nameStyle)}>{m.name}</span>
                <span style={css(m.valStyle)}>{m.val}</span>
              </div>
            ))}
          </div>

          <div style={css('margin-top:26px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#321E37')}>이 사례의 키워드</div>
          <div style={css('display:flex;flex-wrap:wrap;gap:8px;margin-top:12px')}>
            {v.caseTags.map((t, i) => (
              <span key={i} style={css('padding:9px 14px;border-radius:12px;background:var(--seed-color-bg-brand-weak);font-size:14.5px;font-weight:600;letter-spacing:-0.01em;color:var(--seed-color-fg-brand-contrast)')}>{t}</span>
            ))}
          </div>

          <div style={css('margin-top:14px;font-size:13px;font-weight:500;line-height:1.55;color:#8B8E96;text-wrap:pretty')}>사례 상세에서도 원인 문장에서 키워드를 추출합니다. 오늘 사건과 공통되는 키워드가 유사도의 근거가 됩니다.</div>
          <div style={css('margin-top:16px;font-size:12px;font-weight:500;line-height:1.5;color:#8B8E96')}>현재 가격이나 매수·매도 판단이 아닌, 해당 사건 이후의 과거 반응을 보여줍니다.</div>
        </div>
      </div>
    );
  }

  renderStats(v) {
    return (
      <div className="seed-pilot seed-stats" style={css('position:absolute;inset:0;background:var(--seed-color-bg-layer-default);display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="seed-detail-back press" onClick={v.toTheme} aria-label="테마 상세로 돌아가기">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#16160F')}>상세 통계</span>
          <button className="seed-icon-button" onClick={v.toggleSave} aria-label={v.isCurrentSaved ? '즐겨찾기 해제' : '즐겨찾기 추가'}><svg width="21" height="21" viewBox="0 0 24 24" fill={v.isCurrentSaved ? 'var(--seed-color-bg-brand-solid)' : 'none'} stroke={v.isCurrentSaved ? 'var(--seed-color-fg-brand)' : 'currentColor'} strokeWidth="1.8" strokeLinejoin="round"><path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9z"/></svg></button>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;padding:14px 22px 112px')}>
          <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:12px')}>
            <span style={css('display:flex;flex-direction:column;gap:6px')}>
              <span style={css('font-size:28px;font-weight:800;letter-spacing:-0.035em;color:#16160F')}>{v.theme} 테마</span>
              <span style={css('font-size:13.5px;font-weight:500;color:#9A998F')}>과거 부각 사례 34건</span>
            </span>
            <span style={css('flex:none;padding:8px 13px;border-radius:15px;background:var(--seed-color-bg-brand-weak);font-size:12.5px;font-weight:700;color:var(--seed-color-fg-brand-contrast)')}>2010.03–2026.07</span>
          </div>

          <div style={css('margin-top:26px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>핵심 통계</span>
            <span style={css('font-size:12.5px;font-weight:600;color:#A9A89E')}>수익률 %</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid #EDECE7;border-radius:26px;padding:6px 18px 8px')}>
            <div style={css('display:flex;padding:14px 0 10px;border-bottom:1px solid #EDECE7')}>
              <span style={css('flex:1;font-size:12px;font-weight:600;color:#A9A89E')}>구분</span>
              {v.statCols.map(c => (
                <span key={c} style={css('width:54px;text-align:right;font-size:12px;font-weight:600;color:#A9A89E')}>{c}</span>
              ))}
            </div>
            {v.statRows.map(r => (
              <div key={r.key} style={css(r.rowStyle)}>
                <span style={css('flex:1;font-size:15px;font-weight:700;letter-spacing:-0.015em;color:#16160F')}>{r.label}</span>
                {r.cells.map(cell => (
                  <span key={cell.key} style={css(cell.style)}>{cell.val}</span>
                ))}
              </div>
            ))}
          </div>

          <div style={css('margin-top:28px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>평균 누적 흐름</span>
            <span style={css('font-size:12.5px;font-weight:600;color:#A9A89E')}>사건일을 0%로 환산</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid #EDECE7;border-radius:26px;padding:18px 18px 14px')}>
            <svg viewBox="0 0 300 120" width="100%" height="132" style={css('display:block;overflow:visible')}>
              <text x="0" y="12" fontSize="9" fontWeight="600" fill="#B4B3A9">+4%</text>
              <text x="0" y="58" fontSize="9" fontWeight="600" fill="#B4B3A9">+2%</text>
              <text x="0" y="104" fontSize="9" fontWeight="600" fill="#B4B3A9">0%</text>
              <line x1="26" y1="8" x2="300" y2="8" stroke="#F2F1EC" strokeWidth="1"></line>
              <line x1="26" y1="54" x2="300" y2="54" stroke="#F2F1EC" strokeWidth="1"></line>
              <line x1="26" y1="100" x2="300" y2="100" stroke="#EDECE7" strokeWidth="1"></line>
              <path d="M30 100 L46 92 L64 96 L82 80 L100 84 L120 66 L140 70 L160 54 L182 58 L204 44 L226 48 L250 32 L276 26 L296 18" fill="none" stroke="var(--seed-color-fg-brand)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="640" style={css('animation:draw 1.2s ease both')}></path>
              <path d="M30 100 L60 99 L92 96 L126 95 L160 92 L196 90 L232 88 L268 86 L296 84" fill="none" stroke="#C3C2B9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="296" cy="18" r="4.6" fill="var(--seed-color-fg-brand)"></circle>
              <text x="26" y="118" fontSize="9.5" fontWeight="600" fill="#B4B3A9">D+1</text>
              <text x="150" y="118" fontSize="9.5" fontWeight="600" fill="#B4B3A9">D+5</text>
              <text x="272" y="118" fontSize="9.5" fontWeight="600" fill="#B4B3A9">D+20</text>
            </svg>
            <div style={css('display:flex;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid #F2F1EC')}>
              <span style={css('display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:#16160F')}><span style={css('width:16px;height:3px;border-radius:2px;background:var(--seed-color-fg-brand)')}></span>{v.theme} 테마</span>
              <span style={css('display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:#9A998F')}><span style={css('width:16px;height:3px;border-radius:2px;background:#C3C2B9')}></span>KOSPI</span>
            </div>
          </div>

          <div style={css('margin-top:28px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>20일 후 수익률 분포</span>
            <span style={css('font-size:12.5px;font-weight:600;color:#A9A89E')}>사례 34건</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid #EDECE7;border-radius:26px;padding:20px 18px 16px')}>
            <div style={css('position:relative;display:flex;align-items:flex-end;gap:8px;height:118px')}>
              {v.bins.map(b => (
                <div key={b.key} style={css('flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:8px')}>
                  <span style={css(b.label)}>{b.n}</span>
                  <span style={css(b.bar)}></span>
                </div>
              ))}
            </div>
            <div style={css('display:flex;margin-top:10px;padding-top:10px;border-top:1px solid #F2F1EC')}>
              {v.axis.map(t => (
                <span key={t} style={css('flex:1;text-align:center;font-size:11px;font-weight:600;color:#B4B3A9')}>{t}</span>
              ))}
            </div>
          </div>

          <div style={css('margin-top:28px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:#16160F')}>위험과 데이터 품질</div>
          <div style={css('margin-top:12px;border:1px solid #EDECE7;border-radius:26px;padding:6px 18px 8px')}>
            {v.quality.map(q => (
              <div key={q.key} style={css(q.rowStyle)}>
                <span style={css('font-size:14.5px;font-weight:600;color:#6E6D65')}>{q.k}</span>
                <span style={{ ...css('font-size:15px;font-weight:800;letter-spacing:-0.01em'), color: q.color }}>{q.v}</span>
              </div>
            ))}
          </div>

          <div style={css('margin-top:18px;font-size:12px;font-weight:500;line-height:1.5;color:#B4B3A9')}>과거 수익률은 미래 성과를 보장하지 않으며, 통계와 표본 구간을 함께 확인해 주세요.</div>
        </div>
      </div>
    );
  }

  render() {
    const v = this.vals();
    const { scale, bare } = this.state;

    const device = (
      <IOSDevice
        width={bare ? '100%' : v.w}
        height={bare ? '100%' : v.h}
        dark={v.isDark || v.darkMode}
        bare={bare}
        showSystemBars={!bare}
        browserChrome={!bare}
        browserUrl="dayjaview-prototype.vercel.app"
      >
        <div className={v.darkMode ? 'app-dark' : ''} style={{ ...css("height:100%;position:relative;overflow:hidden;font-family:'Pretendard',system-ui,sans-serif;-webkit-font-smoothing:antialiased"), background: v.pageBg }}>
          {v.isSplash && this.renderSplash(v)}
          {v.isHome && this.renderSeedHome(v)}
          {v.isTheme && this.renderSeedTheme(v)}
          {v.isCases && this.renderCases(v)}
          {v.isCase && this.renderCase(v)}
          {v.isStats && this.renderStats(v)}
          {v.isSearch && this.renderSearchScreen(v)}
          {v.isLibrary && this.renderLibraryScreen(v)}
          {v.isSettings && this.renderSettingsScreen(v)}
          {!v.isHome && v.savedPanel && <div onClick={v.closeSavedPanel} style={css('position:absolute;inset:0;z-index:12;background:rgba(0,0,0,.28)')} />}
          {!v.isHome && v.savedPanel && (
            <aside className="seed-saved-drawer">
              <div className="seed-history-header">
                <div><Badge tone="brand" variant="weak">SAVED</Badge><h2>저장한 항목</h2></div>
                <button className="seed-history-close" onClick={v.closeSavedPanel} aria-label="저장 목록 닫기"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
              </div>
              <p className="seed-history-description">저장한 항목과 최근 검색 기록을 한곳에서 확인하세요.</p>
              <div className="seed-history-list">
                {v.savedItems.length ? v.savedItems.map(item => (
                  <button key={item.key} onClick={item.open} className="seed-history-row">
                    <span role="button" tabIndex="0" aria-label={item.title + ' 저장 해제'} onClick={item.remove} className="seed-history-icon seed-remove-star">★</span>
                    <span className="seed-history-copy"><strong>{item.title}</strong><small>저장한 테마</small></span>
                    <span className="seed-history-return">{item.chg}</span>
                  </button>
                )) : <div className="seed-saved-empty seed-saved-empty-compact"><span>☆</span><strong>아직 저장한 항목이 없어요</strong><p>오른쪽 아래 + 버튼을 눌러 저장해 보세요.</p></div>}
                <div className="seed-history-divider"><span>검색 히스토리</span></div>
                <label className="seed-history-search seed-history-search-in-drawer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
                  <input value={v.savedQ} onChange={v.onSavedQ} placeholder="검색 기록 찾기" />
                </label>
                {v.savedGroups.map(g => (
                  <section key={g.key} className="seed-history-group">
                    <h3>{g.label}</h3>
                    {g.items.map(s => (
                      <button key={s.key} onClick={s.open} className="seed-history-row">
                        <span className="seed-history-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="8"/></svg></span>
                        <span className="seed-history-copy"><strong>{s.title}</strong><small>{s.meta}</small></span>
                        <span className="seed-history-return" style={{ color: s.color }}>{s.chg}</span>
                      </button>
                    ))}
                  </section>
                ))}
                {v.savedNone && <div className="seed-history-empty">일치하는 검색 기록이 없습니다.</div>}
              </div>
            </aside>
          )}
          {!v.isSplash && this.renderBottomNav(v)}
          {v.toast && (
            <div style={css('position:absolute;left:22px;right:22px;bottom:44px;z-index:20;padding:14px 16px;border-radius:20px;background:#16160F;color:#fff;font-size:14px;font-weight:600;box-shadow:0 12px 30px rgba(20,20,10,.24);animation:fadeIn .18s ease both')}>{v.toast}</div>
          )}
        </div>
      </IOSDevice>
    );

    // 모바일: 여백도 프레임도 없이 뷰포트를 그대로 채운다.
    // 100dvh 라야 주소창이 접혔다 펴져도 높이가 튀지 않는다.
    if (bare) {
      return <div style={{ width: '100%', height: '100dvh', overflow: 'hidden' }}>{device}</div>;
    }

    // 데스크톱: 목업으로 보여준다. 축소해도 레이아웃이 원래 크기를 차지하지
    // 않도록 바깥 div 가 축소된 실제 크기를 잡는다.
    return (
      <div style={{
        ...css('min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden'),
        padding: FRAME_PAD, boxSizing: 'border-box',
      }}>
        <div style={{ flex: 'none', width: FRAME_W * scale, height: FRAME_H * scale }}>
          <div style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {device}
          </div>
        </div>
      </div>
    );
  }
}
