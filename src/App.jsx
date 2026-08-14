import React from 'react';
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
    toast: null, menu: false, savedQ: '', scale: 1, bare: false, dark: false
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

  // 다크 팔레트는 웜 뉴트럴(#1C1917 / #262321 / #2C1E16)이다. 슬레이트·네이비
  // 계열도 후보였지만 브랜드 오렌지(#FF5C00)와 색온도가 어긋나 제외했다.
  // 다크에서 보조 텍스트는 쿨그레이 대신 웜그레이(#A8A29E)를 쓴다 — 대비는
  // 같은 수준이면서 배경과 색온도가 맞는다.
  // 다크 전용 값만 여기서 정의하고, 나머지는 라이트 값을 그대로 쓴다.
  pal(dark) {
    const d = dark === undefined ? this.state.dark : dark;
    return {
      dark: d,
      bg: d ? '#1C1917' : '#EAE8E3',
      surface: d ? '#262321' : '#FFFFFF',
      // 화면 바닥. 라이트에서는 바닥과 카드가 둘 다 흰색이어도 테두리(#EEEDE8)가
      // 충분히 보이지만, 다크에서 둘 다 #262321 이면 0.09 흰 테두리 하나로
      // 버텨야 해서 카드가 안 떠오른다. 바닥만 한 단계 낮춘다.
      screenBg: d ? '#1C1917' : '#FFFFFF',
      fg: d ? '#F5F3F0' : '#16160F',
      fg2: d ? '#A8A29E' : '#9A998F',
      // 처음 잡았던 #7C7570 은 #262321 위에서 3.36:1 이라 본문 기준 4.5:1 에
      // 못 미쳤다. 라이트의 #B4B3A9 는 흰 배경에서 이미 2.2:1 로 더 낮지만
      // 그건 시안 값이라 건드리지 않았다 (별도 보고).
      fg3: d ? '#948C86' : '#B4B3A9',
      up: d ? '#FF6B6E' : '#E5484D',
      homeGlow: d
        ? 'radial-gradient(420px 300px at 12% 46%,rgba(255,92,0,.10),transparent 70%),radial-gradient(380px 320px at 92% 66%,rgba(255,140,60,.07),transparent 72%),radial-gradient(300px 240px at 70% 34%,rgba(255,255,255,.04),transparent 70%)'
        : 'radial-gradient(420px 300px at 12% 46%,rgba(214,214,206,.5),transparent 70%),radial-gradient(380px 320px at 92% 66%,rgba(222,220,212,.55),transparent 72%),radial-gradient(300px 240px at 70% 34%,rgba(238,236,230,.7),transparent 70%)',
      headerIcon: d ? '#F5F3F0' : '#1A1A18',
      logo: d ? LOGO_WHITE : LOGO_MARK,
      logoBlend: d ? 'normal' : 'multiply',
      pillBorder: d ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.85)',
      badgeBg: d ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.55)',
      badgeBorder: d ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.85)',
      badgeShadow: d ? 'none' : 'inset 0 1px 1px rgba(255,255,255,.9),0 1px 3px rgba(22,22,15,.06)',
      drawerBg: d ? '#262321' : '#FFFFFF',
      inputBg: d ? '#2C2724' : '#F5F4F1',
      divider: d ? 'rgba(255,255,255,.07)' : '#F3F2EE',
      drawerFoot: d ? 'rgba(255,255,255,.09)' : '#F0EFEA',
      popBg: d ? '#262321' : '#FFFFFF',
      popBorder: d ? 'rgba(255,255,255,.10)' : '#E9E8E3',
      // 테마 시트는 불투명하다. 반투명 그라디언트로 두면 뒤의 오렌지 헤더
      // (340px 블록)가 비쳐서 시트 상단에 원치 않는 색 그라데이션이 깔린다.
      // 시트가 막아주면 그 위 카드들의 옅은 흰 그라디언트도 거의 안 보인다.
      sheetBg: d ? '#262321' : '#FFFFFF',
      cardGrad: d
        ? 'linear-gradient(150deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.045) 55%,rgba(255,255,255,.025) 100%)'
        : 'linear-gradient(150deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.42) 55%,rgba(240,240,236,.4) 100%)',
      cardBorder: d ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.85)',
      cardShadow: d
        ? '0 8px 22px -14px rgba(0,0,0,.6)'
        : '0 0 0 1px rgba(22,22,15,.035),0 8px 22px -14px rgba(22,22,15,.18),inset 0 1.5px 1px rgba(255,255,255,.9)',
      statGrad: d
        ? 'linear-gradient(150deg,rgba(44,30,22,.92) 0%,rgba(38,35,33,.86) 55%,rgba(38,35,33,.8) 100%)'
        : 'linear-gradient(150deg,rgba(246,247,251,.72) 0%,rgba(246,247,251,.42) 55%,rgba(232,234,244,.4) 100%)',
      statBorder: d ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.8)',
      statShadow: d ? 'none' : '0 0 0 1px rgba(22,22,15,.035),inset 0 1.5px 1px rgba(255,255,255,.9)',
      // 칩·기간 셀은 흰 반투명이라 유리 시트 위에서만 형태가 보였다. 시트를
      // 불투명 흰색으로 바꾸면서 흰 위의 흰색이 되어 경계가 사라졌다.
      // 둘 다 실제 면 + 테두리를 줘서 낱개 상자로 읽히게 한다.
      hzBg: d ? 'rgba(255,255,255,.06)' : '#FFFFFF',
      hzBorder: d ? 'rgba(255,255,255,.14)' : '#E1E4EC',
      chipBg: d ? 'rgba(255,255,255,.09)' : '#F0EEE8',
      chipBorder: d ? 'rgba(255,255,255,.18)' : '#D9D6CD',
      linkBg: d ? 'rgba(255,255,255,.06)' : '#FFFFFF',
      linkBorder: d ? 'rgba(255,255,255,.10)' : '#E7E6E1',
      caseBg: d ? '#262321' : '#FFFFFF',
      caseBorder: d ? 'rgba(255,255,255,.09)' : '#EEEDE8',
      tagBg: d ? 'rgba(122,142,222,.18)' : '#F1F3FB',
      tagFg: d ? '#AFBBE8' : '#4A5680',
      chevron: d ? '#6B6560' : '#C3C2B9',

      // cases·case·stats 는 홈/테마와 다른 색 계열을 쓴다 (보라 잉크 #321E37,
      // 회색 #8B8E96, 라인 #ECEEF3). 다크에서는 웜 뉴트럴로 합류시켜 화면을
      // 넘나들 때 색 계열이 갈리지 않게 한다.
      ink2: d ? '#F5F3F0' : '#321E37',
      meta: d ? '#A8A29E' : '#8B8E96',
      line: d ? 'rgba(255,255,255,.10)' : '#ECEEF3',
      lineStrong: d ? 'rgba(255,255,255,.16)' : '#DDE1E8',
      panelBg: d ? '#262321' : '#FFFFFF',
      subtleBg: d ? 'rgba(255,255,255,.055)' : '#F6F7FB',
      segTrack: d ? 'rgba(255,255,255,.08)' : '#EFEFF0',
      segOnBg: d ? 'rgba(255,255,255,.14)' : '#FFFFFF',
      tabTrack: d ? 'rgba(255,255,255,.06)' : '#F4F3EF',
      barTrack: d ? 'rgba(255,255,255,.12)' : '#ECEEF3',
      // 사례 상세 헤더 카드 · stats 기간 배지. 원래 민트(#E4FFFB/#0B7F72)였는데
      // 브랜드 오렌지 계열로 통일했다. 다만 카드가 본문 전체를 덮는 넓은 면이라
      // 원색 #FF5C00 을 깔면 판이 너무 세다. 낮은 알파의 오렌지 틴트로 깔고
      // 글자만 진한 오렌지로 받는다.
      tintBg: d ? 'rgba(255,92,0,.16)' : 'rgba(255,92,0,.10)',
      tintFg: d ? '#FFA366' : '#B23C00',
      tintBody: d ? '#D6B9A8' : '#6B4A38',
      tintChip: d ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.72)',
      redInk: d ? '#FF6B6E' : '#D83A43',
      blueInk: d ? '#6EA0FF' : '#3267D6',
      perfCellBg: d ? 'rgba(216,58,67,.20)' : '#FFE9EA',

      // stats 화면 전용
      cardLine: d ? 'rgba(255,255,255,.10)' : '#EDECE7',
      faintLine: d ? 'rgba(255,255,255,.07)' : '#F2F1EC',
      rowLine: d ? 'rgba(255,255,255,.08)' : '#F5F4EF',
      qualityFg: d ? '#C9C3BE' : '#6E6D65',
      // 차트도 브랜드 오렌지로 통일. 원색 #FF5C00 은 다크 배경에서 가라앉아
      // 밝은 쪽(#FF8B4D)으로 올린다. 비교선(KOSPI)은 계열색을 쓰지 않는다 —
      // 중립 회색으로 둬야 주선과 한눈에 갈린다.
      chartLine: d ? '#FF8B4D' : '#FF5C00',
      chartRef: d ? '#7C7570' : '#C3C2B9',
      barOn: d ? '#FF8B4D' : '#FF5C00',
      barIdle: d ? 'rgba(255,139,77,.55)' : '#FF9C5C',
      barMuted: d ? 'rgba(255,139,77,.22)' : '#FFDCC7',
      tipBg: d ? '#0F0D0C' : '#16160F'
    };
  }

  // 휠 알약 배경. paintWheel 이 모드에 따라 다시 칠하지만, 첫 페인트 전까지의
  // 값이 필요해 여기서도 같은 식을 쓴다.
  pillGrad(d, k) {
    return d
      ? 'linear-gradient(150deg,rgba(255,255,255,' + (0.10 + k * 0.10).toFixed(3) + ') 0%,rgba(255,255,255,' + (0.06 + k * 0.07).toFixed(3) + ') 55%,rgba(255,255,255,' + (0.04 + k * 0.05).toFixed(3) + ') 100%)'
      : 'linear-gradient(150deg,rgba(255,255,255,' + (0.80 + k * 0.18).toFixed(2) + ') 0%,rgba(255,255,255,' + (0.62 + k * 0.26).toFixed(2) + ') 55%,rgba(240,240,236,' + (0.60 + k * 0.26).toFixed(2) + ') 100%)';
  }

  wheelItems = [];

  // 라이트에서는 흰 유리(밝은 안쪽 하이라이트 + 짙은 드롭섀도), 다크에서는
  // 얕은 흰 오버레이 + 검은 드롭섀도로 뒤집는다. 라이트용 inset 하이라이트를
  // 다크에 그대로 쓰면 알약 위쪽에 흰 테가 떠서 지저분해진다.
  wheelPillStyle(p) {
    return 'display:flex;align-items:center;gap:12px;flex:none;padding:15px 20px;border-radius:26px;cursor:pointer;text-align:left;font-family:inherit;'
      + 'border:1.5px solid ' + p.pillBorder + ';'
      + 'background:' + this.pillGrad(p.dark, 0) + ';'
      + 'backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%);'
      + (p.dark
        ? 'box-shadow:0 0 0 1px rgba(0,0,0,.3),0 12px 26px -12px rgba(0,0,0,.55);'
        : 'box-shadow:0 0 0 1px rgba(22,22,15,.045),0 12px 26px -12px rgba(22,22,15,.2),inset 0 1.5px 1px rgba(255,255,255,.95),inset 0 -2px 4px rgba(22,22,15,.045);')
      + 'will-change:transform,opacity;transform-origin:center center;';
  }

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
        // 초점에 놓을 항목을 직접 가운데로 보낸다. 예전처럼 1위를 맞춘 뒤
        // itemH 로 칸수를 더하는 방식은 스케일이 걸린 상태에서 한 칸씩
        // 어긋났다.
        //
        // 첫 진입 기본값은 2위다. 2위를 초점에 두면 1·2·3위가 초점 양옆으로
        // 나란히 놓여 셋 다 커 보인다. 테마를 봤다가 돌아온 경우에는 그때
        // 고른 항목(wheelPick)을 초점에 둔다.
        const offset = this.wheelPick === undefined ? 1 : this.wheelPick;
        const target = this.wheelItems[n + offset] || mid;
        const box = el.getBoundingClientRect();
        const r = target.getBoundingClientRect();
        el.scrollTop += (r.top + r.height / 2) - (box.top + box.height / 2 - this.focusShift);
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
    const box = el.getBoundingClientRect();
    const focus = box.top + box.height / 2 - (this.focusShift || 0);
    const step = (this.wheelItems[0] ? this.wheelItems[0].offsetHeight : 62) + 8;
    const d = this.state.dark;
    this.wheelItems.forEach(item => {
      if (!item) return;
      const r = item.getBoundingClientRect();
      const k = Math.min(Math.abs(r.top + r.height / 2 - focus) / step, 7);
      // 감쇠를 두 칸에 걸쳐 준다. 한 칸(1-k)이면 초점 하나만 1.06 이고 바로
      // 옆이 0.928 로 뚝 떨어져서 '큰 항목 1개'로 보인다. 두 칸으로 벌리면
      // 초점과 양옆 셋이 1.06 / 0.988 / 0.916 이 되어 묶음으로 읽힌다.
      const near = Math.max(0, 1 - k / 2);
      item.style.transform = 'scale(' + (0.94 + near * 0.12 - Math.min(k * 0.012, 0.05)).toFixed(3) + ')';
      // 비초점 항목을 blur 로 뭉개면 목록 10줄 중 9줄이 읽히지 않아 화면이
      // '정보 1개 + 노이즈'로 보인다. 흐림은 빼고 opacity 하한도 0.55 로 올려
      // 초점만 강조하되 나머지도 읽히게 둔다. blur 는 프레임마다 리페인트를
      // 강제하는 비용도 있었다.
      item.style.opacity = String(k <= 1 ? 1 : Math.max(0.55, 1 - (k - 1) * 0.2).toFixed(3));
      item.style.zIndex = String(100 - Math.round(k * 5));
      // 다크에서는 깊이를 흰 하이라이트가 아니라 검은 그림자로 준다.
      item.style.boxShadow = d
        ? '0 0 0 1px rgba(0,0,0,' + (0.3 + near * 0.12).toFixed(3) + '),'
          + '0 ' + (12 + near * 16).toFixed(0) + 'px ' + (26 + near * 24).toFixed(0) + 'px -12px rgba(0,0,0,' + (0.55 + near * 0.2).toFixed(3) + ')'
        : '0 0 0 1px rgba(22,22,15,' + (0.045 + near * 0.02).toFixed(3) + '),'
          + '0 ' + (12 + near * 16).toFixed(0) + 'px ' + (26 + near * 24).toFixed(0) + 'px -12px rgba(22,22,15,' + (0.2 + near * 0.22).toFixed(3) + '),'
          + 'inset 0 1.5px 1px rgba(255,255,255,.95),inset 0 -2px 4px rgba(22,22,15,.045)';
      // 페이지 배경이 알약보다 어두우므로 알약은 더 불투명해야 카드로 읽힌다.
      // 초점에 가까울수록(near) 한 단계 더 올린다.
      item.style.background = this.pillGrad(d, near > 0.3 ? near : 0);
    });
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
    if (!this.state.bare) return base + 'px';
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
    // 다크에서 원래 등락 색(#E5484D / #2F6BE0)은 #262321 위에서 3:1 을
    // 못 넘겨 밝은 쪽으로 올린다.
    const P = this.pal();
    const dm = P.dark;
    const up = dm ? '#FF6B6E' : '#E5484D', down = dm ? '#6EA0FF' : '#2F6BE0', ink = dm ? '#F5F3F0' : '#16160F';
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
      p: P,
      dark: st.dark,
      toggleDark: () => this.setState(s => ({ dark: !s.dark }), () => this.paintWheel()),
      isDark: st.screen === 'splash' || st.dark,
      pageBg: st.screen === 'splash' ? '#000000' : (st.dark ? '#1C1917' : '#FFFFFF'),
      isSplash: st.screen === 'splash',
      isHome: st.screen === 'home',
      isTheme: st.screen === 'theme',
      isCases: st.screen === 'cases',
      isCase: st.screen === 'case',
      isStats: st.screen === 'stats',

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
          // 상위 3위까지 오렌지로 채운다. 채도 있는 색이 날짜와 등락률
          // 빨강뿐이라 어디를 먼저 볼지가 없었다.
          top: t.rank <= 3,
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

      reason: '정부 공공 조명 교체 예산 확대와 마이크로 LED 신규 수주 소식이 겹치며 관련 종목 전반이 강세를 보였습니다.',
      // 가로 스크롤이 실제로 동작하는지 보이도록 목업 종목을 늘렸다.
      stocks: ['서울반도체', '루멘스', '엘이디코리아', '금호전기', 'LG이노텍', '대진디엠피', '우리조명', '한국단자'],
      horizons: [
        { key: 'h1', label: '1일 후', val: '+0.4%', color: up },
        { key: 'h5', label: '5일 후', val: '+1.3%', color: up },
        { key: 'h20', label: '20일 후', val: '+2.8%', color: up }
      ],
      topCases: this.cases.slice(0, 5).map(caseRow),
      links: [
        { key: 'l1', label: '과거 사례 전체보기', go: () => this.go('cases') },
        { key: 'l2', label: '상세 통계', go: () => this.go('stats') }
      ],
      saveFill: st.saved ? '#FFFDF1' : 'none',
      toggleSave: () => { const v = !st.saved; this.setState({ saved: v }); this.flash(v ? '저장한 테마에 담았습니다' : '저장한 테마에서 제거했습니다'); },

      menu: st.menu,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
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
          // 선택된 탭은 순위 배지와 같은 연한 오렌지(#FF7A33)를 쓴다. 글자는
          // 크림(#FFFDF1)이 아니라 #4A1608 이어야 한다 — 15px 볼드는 WCAG
          // large text(18.66px 볼드) 기준에 못 미쳐 4.5:1 이 그대로 적용되는데,
          // 크림은 이 배경에서 기준을 못 넘긴다.
          + (i === hz ? 'background:#FF7A33;color:#4A1608;font-weight:700;box-shadow:0 6px 14px -8px rgba(255,122,51,.4);' : 'background:transparent;color:' + P.fg2 + ';font-weight:600;')
      })),
      allCases: this.cases.map(caseRow),

      picked: { date: pickedDate, title: picked.title, sub: picked.sub },
      perfCells: [
        { key: 'p1', label: '1일 후', val: '+0.4%' },
        { key: 'p5', label: '5일 후', val: '+1.3%' },
        { key: 'p20', label: '20일 후', val: '+2.8%' }
      ].map(p => ({
        ...p,
        color: P.redInk,
        cell: 'border-radius:22px;padding:16px 14px 18px;text-align:center;background:' + P.perfCellBg + ';transition:transform .16s ease,box-shadow .16s ease'
      })),
      perfStats: [
        { key: 's1', label: '평균 지속', val: '6.2 거래일' },
        { key: 's2', label: '변동성 (20일 후)', val: '±8.2%' }
      ],
      kwRows: (() => {
        const rows = [
          { word: '공공발주', n: 9, rate: 78, lift: 2.6 },
          { word: '예산', n: 12, rate: 67, lift: 2.1 },
          { word: '조명', n: 14, rate: 64, lift: 1.8 },
          { word: '수출', n: 11, rate: 64, lift: 1.5 },
          { word: '양산', n: 7, rate: 57, lift: 1.1 }
        ];
        // 막대는 헤드라인 숫자(lift)와 같은 값을 나타내야 한다. 예전에는
        // 막대가 상승 비율(rate)을 그려서, 막대 길이와 오른쪽 숫자가 서로
        // 다른 값을 가리켰다. 최댓값 기준으로 정규화해 순위가 길이로 읽히게
        // 한다.
        const maxLift = Math.max(...rows.map(r => r.lift));
        return rows.map(k => ({
          key: k.word,
          word: k.word,
          // 최상위 키워드만 오렌지 칩으로 감싼다. 홈 1~3위 배지·기간 탭과
          // 같은 값(#FF7A33)이라 '가장 강한 것 = 오렌지'가 앱 전체에서
          // 하나의 언어로 읽힌다.
          top: k.lift === maxLift,
          lift: '+' + k.lift.toFixed(1) + '%p',
          meta: '표본 ' + k.n + '건 · 상승 ' + k.rate + '%',
          bar: 'display:block;height:100%;border-radius:999px;width:'
            + Math.round(k.lift / maxLift * 100) + '%;background:' + P.redInk
        }));
      })(),
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
              ? 'background:' + P.subtleBg + ';border-top:1px solid ' + P.lineStrong + ';'
              : (i === rows.length - 1 ? '' : 'border-bottom:1px solid ' + P.line + ';')),
          nameStyle: 'flex:1;min-width:0;font-size:16px;font-weight:' + (r.basket ? 800 : 500) + ';letter-spacing:-0.015em;color:' + P.ink2 + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
          valStyle: 'width:88px;text-align:right;font-size:16px;font-weight:800;letter-spacing:-0.01em;color:' + (r.n < 0 ? P.blueInk : P.redInk)
        }));
      })(),
      sortLabel: st.byReturn ? '수익률순' : '종목명순',
      sortSegs: [{ key: 'name', label: '종목명순', on: !st.byReturn }, { key: 'ret', label: '수익률순', on: !!st.byReturn }].map(sg => ({
        key: sg.key,
        label: sg.label,
        pick: () => this.setState({ byReturn: sg.key === 'ret' }),
        style: 'appearance:none;border:none;cursor:pointer;font-family:inherit;padding:5px 12px;border-radius:7px;font-size:12.5px;letter-spacing:-0.01em;transition:background .16s ease,color .16s ease,box-shadow .16s ease;'
          + (sg.on
            ? 'background:' + P.segOnBg + ';color:' + P.ink2 + ';font-weight:700;box-shadow:0 1px 3px rgba(22,22,15,.14),0 0 0 .5px rgba(22,22,15,.04);'
            : 'background:transparent;color:' + P.meta + ';font-weight:600;')
      })),
      toggleSort: () => this.setState(s => ({ byReturn: !s.byReturn })),

      statCols: ['1일', '5일', '20일'],
      statRows: stats.map((s, i) => ({
        key: s.label,
        label: s.label,
        rowStyle: 'display:flex;align-items:center;padding:15px 0;' + (i === stats.length - 1 ? '' : 'border-bottom:1px solid ' + P.rowLine + ';'),
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
            + (on ? 'color:' + P.fg + ';opacity:1' : 'color:' + P.fg2 + ';opacity:' + (hv === null ? '1' : '.35')),
          bar: 'width:100%;height:' + Math.round((b.n / maxN) * 84) + 'px;border-radius:8px 8px 4px 4px;transform-origin:bottom;animation:grow .5s cubic-bezier(.2,.8,.3,1) both;transition:background .14s ease,box-shadow .14s ease;'
            + (on ? 'background:' + P.barOn + ';box-shadow:0 8px 16px -8px rgba(255,92,0,.5)' : 'background:' + (hv === null ? P.barIdle : P.barMuted))
        };
      }),
      tip: hv === null ? null : {
        range: bins[hv].range,
        count: bins[hv].n + '건',
        style: 'position:absolute;bottom:100%;left:' + ((hv + 0.5) / bins.length * 100) + '%;transform:translate(-50%,-6px);display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 12px;border-radius:14px;background:' + P.tipBg + ';box-shadow:0 10px 24px -12px rgba(22,22,15,.7);white-space:nowrap;pointer-events:none;animation:fadeIn .12s ease both'
      },
      clearHover: () => this.setState({ hover: null }),
      axis: ['−10%', '0%', '+10%', '+20%'],
      quality: quality.map((q, i) => ({
        ...q,
        key: q.k,
        rowStyle: 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;' + (i === quality.length - 1 ? '' : 'border-bottom:1px solid ' + P.rowLine + ';')
      })),

      toast: st.toast,
      toHome: () => this.go('home'),
      toTheme: () => this.go('theme'),
      toCases: () => this.go('cases')
    };
  }

  renderSplash(v) {
    return (
      <div onClick={v.toHome} style={css('position:absolute;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn .3s ease both')}>
        <div style={css('position:absolute;top:50%;left:50%;width:520px;height:520px;margin:-335px 0 0 -260px;border-radius:50%;background:radial-gradient(circle,rgba(255,92,0,.5) 0%,rgba(255,92,0,.14) 38%,rgba(255,92,0,0) 68%);filter:blur(18px);animation:halo 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
        <div style={css('position:relative;width:258px;height:96px;margin-bottom:150px')}>
          <div style={css(`position:absolute;inset:0;background:rgba(255,92,0,.55);-webkit-mask:url(${LOGO_WHITE}) center/contain no-repeat;mask:url(${LOGO_WHITE}) center/contain no-repeat;animation:breathe 3.4s cubic-bezier(.45,0,.55,1) infinite`)}></div>
          <div style={css(`position:absolute;inset:-40px;overflow:hidden;-webkit-mask:url(${LOGO_WHITE}) center/144px 96px no-repeat;mask:url(${LOGO_WHITE}) center/144px 96px no-repeat;filter:blur(9px);opacity:.85`)}>
            <div style={css('position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,92,0,0) 34%,rgba(255,92,0,.95) 50%,rgba(255,150,80,1) 56%,rgba(255,92,0,0) 70%);animation:sweep 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
          </div>
          <div style={css(`position:absolute;inset:0;overflow:hidden;-webkit-mask:url(${LOGO_WHITE}) center/contain no-repeat;mask:url(${LOGO_WHITE}) center/contain no-repeat`)}>
            <div style={css('position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,92,0,0) 36%,rgba(255,92,0,.9) 48%,#FFB07A 55%,rgba(255,92,0,.6) 62%,rgba(255,92,0,0) 74%);animation:sweep 3.4s cubic-bezier(.45,0,.55,1) infinite')}></div>
          </div>
        </div>
        <div style={css('position:absolute;left:0;right:0;bottom:96px;display:flex;flex-direction:column;align-items:center;gap:20px')}>
          <div style={css('font-size:14.5px;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.44)')}>오늘의 시장을, 과거의 기록으로</div>
          <div style={css('width:132px;height:3px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden')}>
            <div style={css('height:100%;border-radius:2px;background:#FF5C00;transform-origin:left;animation:barFill 2.6s cubic-bezier(.3,.7,.2,1) both')}></div>
          </div>
        </div>
      </div>
    );
  }

  // 배경은 알약보다 어두워야 흰 유리 알약이 카드로 떠오른다.
  // 흰 배경일 때는 흰 알약과 명도가 같아 경계가 그림자뿐이었다.
  renderHome(v) {
    const p = v.p;
    return (
      <div style={css('position:absolute;inset:0;background:' + p.bg + ';display:flex;flex-direction:column;animation:popBack .28s ease both')}>
        <div style={css('position:absolute;inset:0;z-index:0;pointer-events:none;background:' + p.homeGlow)}></div>

        <div style={css('position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(54) + ' 20px 0')}>
          <button className="tap-bg" onClick={v.openMenu} aria-label="메뉴 열기" style={css('width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;padding:0;cursor:pointer;border-radius:22px')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={p.headerIcon} strokeWidth="1.9" strokeLinecap="round"><path d="M5 8.5h14M5 13h14M5 17.5h9"></path></svg>
          </button>
          {/* 라이트에서는 검정 마크에 multiply 로 배경을 먹였는데, 다크에서
              multiply 는 로고를 지워버린다. 다크는 흰 로고 + blend 해제. */}
          <img src={p.logo} alt="Dejavu" style={css('height:30px;width:auto;display:block;mix-blend-mode:' + p.logoBlend)} />
          <span style={css('width:44px;height:44px')}></span>
        </div>

        <div style={css('position:relative;z-index:1;padding:26px 20px 40px')}>
          <div style={css('font-size:34px;line-height:1.14;font-weight:700;letter-spacing:-0.03em;color:#EB5E28')}>2026년 08월 12일</div>
          <div style={css('font-size:34px;line-height:1.14;font-weight:800;letter-spacing:-0.035em;color:' + p.fg)}>오늘의 요약</div>
        </div>

        <div ref={this.wheelRef} style={css('position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:0 20px;display:flex;flex-direction:column;gap:8px')}>
          {v.wheel.map(a => (
            <button key={a.key} ref={a.ref} onClick={a.open} style={css(this.wheelPillStyle(p))}>
              <span style={css('width:32px;height:32px;flex:none;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:17px;'
                + (a.top
                  // 3개가 나란히 붙으면서 원색 #FF5C00 은 화면에서 너무 세다.
                  // 같은 색상각을 유지한 채 한 단계 연한 #FF7A33 을 쓴다.
                  // 글자는 크림(#FFFDF1)이 아니라 #4A1608 이어야 한다 — 17px
                  // 볼드는 WCAG large text(18.66px 볼드) 기준에 못 미쳐 4.5:1 이
                  // 그대로 적용되는데, 크림은 이 배경에서 기준을 못 넘긴다.
                  // 무게는 강조된 1~3위만 800 으로 올린다. 4위 이하까지 같이
                  // 올리면 강조가 사라져서 색을 넣은 의미가 없어진다.
                  ? 'font-weight:800;background:#FF7A33;border:1px solid #FF7A33;box-shadow:0 2px 6px -2px rgba(255,122,51,.45);color:#4A1608'
                  : 'font-weight:700;background:' + p.badgeBg + ';border:1px solid ' + p.badgeBorder + ';box-shadow:' + p.badgeShadow + ';color:' + p.fg))}>{a.rank}</span>
              <span style={css('font-size:19px;font-weight:700;letter-spacing:-0.02em;color:' + p.fg + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0')}>{a.title}</span>
              <span style={css('margin-left:auto;padding-left:12px;font-size:19px;font-weight:700;letter-spacing:-0.01em;color:' + p.up + ';white-space:nowrap')}>{a.chg}</span>
            </button>
          ))}
        </div>

        {/* 휠 하단 여백. 예전엔 빈 58px 상자가 104px 을 차지했다. 여백 자체는
            필요하다 — 없애면 휠이 홈 인디케이터에 가린다. 크기를 줄이고
            bare 모드에서 안전영역을 타도록 padBottom 을 쓴다. layoutWheel 이
            휠 자신의 padding 을 덮어쓰므로 바깥 형제로 둬야 한다. */}
        <div style={{ ...css('position:relative;z-index:1;flex:none'), height: this.padBottom(40) }}></div>

        {v.menu && <div onClick={v.closeMenu} style={css('position:absolute;inset:0;z-index:12;background:rgba(22,22,15,.28);animation:fadeIn .18s ease both')}></div>}
        {v.menu && (
          <div style={css('position:absolute;top:0;bottom:0;left:0;z-index:13;width:300px;background:' + p.drawerBg + ';border-radius:0 26px 26px 0;box-shadow:0 20px 60px rgba(20,20,10,.28);display:flex;flex-direction:column;animation:drawerIn .26s cubic-bezier(.2,.85,.3,1) both')}>
            <div style={css('padding:' + this.padTop(60) + ' 22px 12px')}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>저장한 테마</div>
              <input value={v.savedQ} onChange={v.onSavedQ} placeholder="테마 검색" style={css('margin-top:14px;width:100%;box-sizing:border-box;padding:11px 14px;border:none;border-radius:14px;background:' + p.inputBg + ';font-family:inherit;font-size:14px;font-weight:500;color:' + p.fg + ';outline:none')} />
            </div>
            <div style={css('flex:1;min-height:0;overflow-y:auto;padding:6px 22px 20px')}>
              {v.savedGroups.map(g => (
                <div key={g.key} style={css('display:flex;flex-direction:column')}>
                  <div style={css('margin:14px 0 6px;font-size:12px;font-weight:700;letter-spacing:.02em;color:' + p.fg3)}>{g.label}</div>
                  {g.items.map(s => (
                    <button key={s.key} className="row-hover" onClick={s.open} style={css('width:100%;display:flex;align-items:center;gap:10px;padding:14px 2px;border:none;border-bottom:1px solid ' + p.divider + ';background:none;cursor:pointer;text-align:left')}>
                      <span style={css('flex:1;min-width:0;display:flex;flex-direction:column;gap:4px')}>
                        <span style={css('font-size:15.5px;font-weight:600;letter-spacing:-0.015em;color:' + p.fg + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{s.title}</span>
                        <span style={css('font-size:12px;font-weight:500;color:' + p.fg3)}>{s.meta}</span>
                      </span>
                      <span style={{ ...css('flex:none;font-size:15px;font-weight:800;letter-spacing:-0.01em'), color: s.color }}>{s.chg}</span>
                    </button>
                  ))}
                </div>
              ))}
              {v.savedNone && <div style={css('margin-top:70px;text-align:center;font-size:14px;font-weight:500;line-height:1.6;color:' + p.fg3)}>검색 결과가 없습니다</div>}
            </div>
            <div style={css('padding:8px 22px ' + this.padBottom(24) + ';border-top:1px solid ' + p.drawerFoot + ';display:flex;flex-direction:column')}>
              {/* 다크 모드 토글. 44px 이상 터치 영역을 유지하고, 스위치 색만으로
                  상태를 알리지 않도록 aria-checked 를 함께 준다. */}
              <button
                role="switch"
                aria-checked={v.dark}
                onClick={v.toggleDark}
                className="row-hover"
                style={css('width:100%;min-height:44px;display:flex;align-items:center;gap:10px;padding:10px 2px;border:none;background:none;cursor:pointer;text-align:left;font-family:inherit;border-radius:12px')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={p.fg2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {v.dark
                    ? <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2z"></path>
                    : <><circle cx="12" cy="12" r="4"></circle><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"></path></>}
                </svg>
                <span style={css('flex:1;font-size:13.5px;font-weight:600;color:' + p.fg2)}>다크 모드</span>
                <span style={css('flex:none;width:40px;height:24px;border-radius:12px;padding:2px;box-sizing:border-box;display:flex;align-items:center;transition:background .16s ease;background:' + (v.dark ? '#FF5C00' : (p.dark ? 'rgba(255,255,255,.18)' : '#D8D6D0')))}>
                  <span style={css('width:20px;height:20px;border-radius:10px;background:#fff;box-shadow:0 1px 3px rgba(22,22,15,.3);transition:transform .16s ease;transform:translateX(' + (v.dark ? '16px' : '0') + ')')}></span>
                </span>
              </button>
              <div style={css('display:flex;align-items:center;gap:8px;min-height:44px;padding:10px 2px')}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={p.fg2} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="3.2"></circle><path d="M12 4.4v2M12 17.6v2M4.4 12h2M17.6 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7 15.9 8.1M8.1 15.9l-1.4 1.4"></path></svg>
                <span style={css('font-size:13.5px;font-weight:600;color:' + p.fg2)}>설정</span>
              </div>
            </div>
          </div>
        )}

        {v.plus && <div onClick={v.closeAll} style={css('position:absolute;inset:0;z-index:8;background:rgba(22,22,15,.16);animation:fadeIn .18s ease both')}></div>}
        {v.plus && (
          <div style={css('position:absolute;right:20px;bottom:100px;z-index:9;width:236px;background:' + p.popBg + ';border:1px solid ' + p.popBorder + ';border-radius:22px;padding:6px;box-shadow:0 18px 40px rgba(20,20,10,.16);animation:fadeIn .18s ease both')}>
            {v.quick.map(q => (
              <button key={q.key} className="quick-item" onClick={q.go} style={css('width:100%;display:flex;align-items:center;gap:12px;padding:13px 12px;border:none;background:none;border-radius:16px;cursor:pointer;text-align:left')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={q.d}></path></svg>
                <span style={css('font-size:15px;font-weight:600;color:' + p.fg)}>{q.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  renderTheme(v) {
    const p = v.p;
    return (
      <div style={css('position:absolute;inset:0;background:' + p.screenBg + ';display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('position:absolute;top:0;left:0;right:0;height:340px;background:#FF5C00')}></div>
        <div style={css('position:relative;z-index:1;flex:1;overflow-y:auto')}>
          <div style={css('padding:' + this.padTop(52) + ' 22px 34px')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:26px')}>
              <button className="press" onClick={v.toHome} aria-label="Back" style={css('width:46px;height:46px;border-radius:23px;border:none;cursor:pointer;background:rgba(255,253,241,.18);display:flex;align-items:center;justify-content:center')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFDF1" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
              </button>
              <span style={css('font-size:17px;font-weight:600;letter-spacing:-0.01em;color:#4A1608')}>8월 12일 장 마감 기준</span>
              <button className="press" onClick={v.toggleSave} aria-label="Save" style={css('width:46px;height:46px;border-radius:23px;border:none;cursor:pointer;background:rgba(255,253,241,.18);display:flex;align-items:center;justify-content:center')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={v.saveFill} stroke="#FFFDF1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1z"></path></svg>
              </button>
            </div>
            <div style={css('display:flex;align-items:center;gap:10px;margin-bottom:6px')}>
              <span style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#FFFDF1')}>{v.theme}</span>
              {v.hasRank && <span style={css('padding:5px 12px;border-radius:14px;background:rgba(255,253,241,.2);font-size:13px;font-weight:700;color:#FFFDF1')}>상승 {v.themeRank}위</span>}
            </div>
            {/* 부호·단위를 0.55em 으로 줄여 쓰다가, 숫자까지 같은 크기로
                맞추기로 했다. 셋이 한 크기이므로 나눠 그릴 이유가 없어져
                다시 한 덩어리로 되돌린다. 크기는 기존 % 가 그려지던 값
                (86 x 0.55 = 47.3) 에 맞춰 48px.
                자간은 86px 에 맞춰 조였던 -0.055em 이 이 크기에서는 너무
                붙어서, 앱의 다른 큰 수치와 같은 -0.03em 으로 되돌린다. */}
            <div style={css('font-size:48px;line-height:1;font-weight:800;letter-spacing:-0.03em;color:#FFFDF1;margin:6px 0 6px')}>{v.themeChg}</div>
            <div style={css('font-size:15px;font-weight:600;color:#4A1608')}>오늘 테마 평균 등락</div>
          </div>

          <div style={css('background:' + p.sheetBg + ';border-radius:34px 34px 0 0;box-shadow:0 -14px 34px -18px rgba(22,22,15,.28);padding:24px 22px 0;min-height:520px')}>
            <div style={css('border-radius:26px;padding:20px;background:' + p.cardGrad + ';backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%);border:1px solid ' + p.cardBorder + ';box-shadow:' + p.cardShadow)}>
              <div style={css('font-size:12.5px;font-weight:700;letter-spacing:.08em;color:' + p.fg2 + ';margin-bottom:12px')}>오늘 부각된 이유</div>
              <div style={css('font-size:18px;font-weight:700;line-height:1.42;letter-spacing:-0.02em;color:' + p.fg + ';text-wrap:pretty')}>{v.reason}</div>
              {/* 종목이 많아 줄바꿈으로는 카드가 계속 길어진다. 한 줄로 두고
                  가로로 넘겨 보게 한다.
                  - 카드 좌우 패딩(20px)만큼 음수 마진으로 빼내 카드 끝까지
                    스크롤되게 한다. 마지막 칩이 가장자리에서 잘려 보이는 게
                    '더 있다'는 신호가 된다.
                  - overscroll-behavior-x:contain 이 없으면 끝까지 밀었을 때
                    뒤의 세로 스크롤이나 브라우저 뒤로가기 제스처로 넘어간다.
                  - 칩은 flex:none 이라야 줄어들지 않고 제 폭을 유지한다.
                  - scroll-padding 이 없으면 스냅이 padding 을 무시하고 첫 칩을
                    카드 가장자리까지 당겨서 위 본문과 좌측 정렬이 어긋난다. */}
              <div style={css('margin:16px -20px 0;padding:0 20px;scroll-padding:0 20px;display:flex;flex-wrap:nowrap;gap:8px;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity')}>
                {v.stocks.map(s => (
                  <span key={s} style={css('flex:none;scroll-snap-align:start;touch-action:manipulation;padding:9px 14px;border-radius:16px;background:' + p.chipBg + ';border:1px solid ' + p.chipBorder + ';font-size:15px;font-weight:700;letter-spacing:-0.01em;white-space:nowrap;color:' + p.fg)}>{s}</span>
                ))}
              </div>
              <div style={css('margin-top:14px;font-size:12.5px;font-weight:500;color:' + p.fg2)}>출처 · 인포스탁</div>
            </div>

            <div style={css('margin-top:26px;border-radius:26px;padding:20px 18px;background:' + p.statGrad + ';backdrop-filter:blur(20px) saturate(170%);-webkit-backdrop-filter:blur(20px) saturate(170%);border:1px solid ' + p.statBorder + ';box-shadow:' + p.statShadow)}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>과거 부각 사례 이후</div>
              <div style={css('margin-top:5px;font-size:13.5px;font-weight:500;color:' + p.fg2)}>분석 표본 34건 · 2010.03–2026.07</div>
              <div style={css('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px')}>
                {v.horizons.map(hz => (
                  <div key={hz.key} style={css('border-radius:20px;background:' + p.hzBg + ';border:1px solid ' + p.hzBorder + ';padding:16px 12px;text-align:center;box-shadow:0 1px 2px rgba(22,22,15,.05)')}>
                    <div style={css('font-size:13px;font-weight:600;color:' + p.fg2)}>{hz.label}</div>
                    <div style={{ ...css('margin-top:8px;font-size:24px;font-weight:800;letter-spacing:-0.03em'), color: hz.color }}>{hz.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={css('padding:28px 0 0')}>
              <div style={css('font-size:22px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>오늘과 가장 유사한 과거</div>
              <div style={css('margin-top:5px;font-size:13.5px;font-weight:500;color:' + p.fg2)}>최근 5건 · 5일 후 수익률</div>
              <div style={css('display:flex;flex-direction:column;gap:14px;margin-top:14px')}>
                {v.topCases.map(c => this.renderCaseCard(c, false, p))}
              </div>
            </div>

            <div style={css('display:flex;gap:12px;padding:18px 0 0')}>
              {v.links.map(l => (
                <button key={l.key} className="link-btn press-sm" onClick={l.go} style={css('flex:1;padding:18px 10px;border:1px solid ' + p.linkBorder + ';border-radius:20px;background:' + p.linkBg + ';cursor:pointer;text-align:center;font-family:inherit;font-size:16px;font-weight:700;letter-spacing:-0.015em;color:' + p.fg + ';transition:background .16s ease,transform .16s ease')}>{l.label}</button>
              ))}
            </div>

            <div style={css('padding:20px 0 40px;font-size:12px;font-weight:500;line-height:1.5;color:' + p.fg3)}>과거 수익률은 미래 성과를 보장하지 않으며 투자 판단의 근거로만 활용할 수 있습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  renderCaseCard(c, snap, p) {
    const q = p || this.pal();
    return (
      <button
        key={c.key}
        className="case-card press-sm"
        onClick={c.open}
        style={css((snap ? 'scroll-snap-align:start;scroll-snap-stop:always;' : '') + 'width:100%;flex:none;display:flex;flex-direction:column;align-items:stretch;gap:12px;padding:22px;border:1px solid ' + q.caseBorder + ';border-radius:28px;background:' + q.caseBg + ';cursor:pointer;text-align:left;box-shadow:0 6px 18px -14px rgba(22,22,15,.35);transition:box-shadow .16s ease,transform .16s ease')}
      >
        <span style={css('display:flex;align-items:center;gap:10px')}>
          <span style={css('flex:1;min-width:0;display:flex;flex-direction:column;gap:7px')}>
            <span style={css('font-size:19.5px;font-weight:500;letter-spacing:-0.015em;color:' + q.fg)}>{c.date}</span>
            <span style={css('font-size:19.5px;font-weight:800;letter-spacing:-0.015em;color:' + q.fg + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{c.title}</span>
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={q.chevron} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css('flex:none')}><path d="M9 6l6 6-6 6"></path></svg>
        </span>
        <span style={css('display:flex;align-items:center;gap:8px')}>
          {c.tags.map((t, i) => (
            <span key={i} style={css('padding:6px 12px;border-radius:10px;background:' + q.tagBg + ';font-size:13.5px;font-weight:600;letter-spacing:-0.01em;color:' + q.tagFg)}>{t}</span>
          ))}
          <span style={{ ...css('margin-left:auto;font-size:19.5px;font-weight:800;letter-spacing:-0.02em'), color: c.color }}>{c.retLabel}</span>
        </span>
      </button>
    );
  }

  renderCases(v) {
    const p = v.p;
    return (
      <div style={css('position:absolute;inset:0;background:' + p.screenBg + ';display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="icon-btn press" onClick={v.toTheme} aria-label="Back" style={css('width:44px;height:44px;border-radius:22px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:' + p.fg)}>과거 사례</span>
          <span style={css('width:44px')}></span>
        </div>
        <div style={css('flex:none;padding:14px 22px 0')}>
          <div style={css('font-size:28px;font-weight:800;letter-spacing:-0.035em;color:' + p.fg)}>{v.theme} 테마</div>
          <div style={css('margin-top:6px;font-size:13.5px;font-weight:500;color:' + p.fg2)}>분석 표본 34건 · 최신 날짜순</div>
          <div style={css('display:flex;gap:6px;margin-top:16px;padding:6px;border-radius:22px;background:' + p.tabTrack)}>
            {v.tabs.map(t => (
              <button key={t.key} onClick={t.pick} style={css(t.style)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;scroll-snap-type:y mandatory;scroll-behavior:smooth;padding:34px 22px 40px;display:flex;flex-direction:column;gap:14px')}>
          {v.allCases.map(c => this.renderCaseCard(c, true, p))}
        </div>
      </div>
    );
  }

  renderCase(v) {
    const pl = v.p;
    return (
      <div style={css('position:absolute;inset:0;background:' + pl.screenBg + ';display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="icon-btn press" onClick={v.toCases} aria-label="Back" style={css('width:44px;height:44px;border-radius:22px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pl.fg} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:' + pl.fg)}>사례 상세</span>
          <span style={css('width:44px')}></span>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;padding:14px 22px 40px')}>
          <div style={css('border-radius:26px;padding:22px;background:' + pl.tintBg)}>
            <div style={css('font-size:13.5px;font-weight:700;color:' + pl.tintFg)}>{v.picked.date}</div>
            <div style={css('margin-top:8px;font-size:24px;font-weight:800;line-height:1.28;letter-spacing:-0.035em;color:' + pl.fg + ';text-wrap:pretty')}>{v.picked.title}</div>
            <div style={css('margin-top:10px;font-size:15px;font-weight:500;line-height:1.55;color:' + pl.tintBody + ';text-wrap:pretty')}>{v.picked.sub} 소식이 전해지며 관련주가 함께 움직였습니다.</div>
            <div style={css('margin-top:16px;display:inline-flex;padding:7px 13px;border-radius:14px;background:' + pl.tintChip + ';font-size:12.5px;font-weight:700;color:' + pl.tintFg)}>출처 · 인포스탁</div>
          </div>

          <div style={css('margin-top:26px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + pl.ink2)}>과거 사례 이후 성과</div>
          <div style={css('margin-top:5px;font-size:12.5px;font-weight:600;color:' + pl.meta)}>34건 · 상승 21건 · 2010.03–2026.07</div>
          <div style={css('margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px')}>
            {v.perfCells.map(p => (
              <div key={p.key} className="lift" style={css(p.cell)}>
                <div style={css('font-size:13px;font-weight:700;letter-spacing:-0.01em;color:' + pl.ink2)}>{p.label}</div>
                <div style={{ ...css('margin-top:12px;font-size:22px;line-height:1;font-weight:800;letter-spacing:-0.03em'), color: p.color }}>{p.val}</div>
              </div>
            ))}
          </div>
          <div style={css('display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px')}>
            {v.perfStats.map(p => (
              <div key={p.key} className="lift-soft" style={css('border-radius:20px;background:' + pl.subtleBg + ';padding:16px 18px;transition:transform .16s ease,box-shadow .16s ease')}>
                <div style={css('font-size:12.5px;font-weight:600;color:' + pl.meta)}>{p.label}</div>
                <div style={css('margin-top:8px;font-size:20px;line-height:1;font-weight:800;letter-spacing:-0.03em;color:' + pl.ink2)}>{p.val}</div>
              </div>
            ))}
          </div>

          <div style={css('margin-top:28px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + pl.ink2)}>상승 동반 키워드</div>
          <div style={css('margin-top:5px;font-size:12.5px;font-weight:600;color:' + pl.meta)}>5일 후 영향 · 등장 vs 미등장</div>
          <div style={css('margin-top:14px;border:1px solid ' + pl.line + ';border-radius:26px;background:' + pl.panelBg + ';padding:20px 18px;display:flex;flex-direction:column;gap:16px')}>
            {/* 키워드가 주인공이다. 예전엔 키워드와 수치가 둘 다 19px 이라
                크기로는 동점인데 빨강이 색 대비로 이겨서 숫자가 먼저 읽혔다.
                키워드 24px / 수치 16px 로 1.5 배 벌리면 크기 차이가 색 salience
                를 눌러 키워드가 먼저 들어온다. 크기는 모듈러 스케일
                (12 · 16 · 24)에 맞췄다 — 19px·11.5px 는 스케일 밖 값이었다. */}
            {v.kwRows.map(k => (
              <div key={k.key} style={css('display:flex;flex-direction:column;gap:8px')}>
                <div style={css('display:flex;align-items:baseline;gap:10px')}>
                  {/* 칩에 좌우 패딩을 주면 1위 글자만 오른쪽으로 밀려 아래
                      키워드들과 좌측 정렬이 깨진다. 패딩만큼 음수 마진으로
                      당겨 글자 시작점을 나머지 행과 맞춘다. */}
                  <span style={css('font-size:24px;font-weight:800;letter-spacing:-0.03em;'
                    + (k.top
                      ? 'margin-left:-10px;padding:3px 10px 5px;border-radius:14px;background:#FF7A33;color:#4A1608'
                      : 'color:' + pl.ink2))}>{k.word}</span>
                  <span style={{ ...css('margin-left:auto;flex:none;font-size:16px;font-weight:800;letter-spacing:-0.01em'), color: pl.redInk }}>{k.lift}</span>
                </div>
                <span style={css('height:6px;border-radius:999px;background:' + pl.barTrack + ';overflow:hidden')}>
                  <span style={css(k.bar)}></span>
                </span>
                <span style={css('font-size:12px;font-weight:600;color:' + pl.fg3)}>{k.meta}</span>
              </div>
            ))}
          </div>
          <div style={css('margin-top:14px;font-size:12.5px;font-weight:500;line-height:1.55;color:' + pl.meta + ';text-wrap:pretty')}>키워드가 등장한 과거 사건이 미등장 사건보다 5일 후 얼마나 더 올랐는지를 뜻합니다 (상승 동반 강도, 인과 아님). 표본 5~9건은 참고용이며 일반어는 제외했습니다.</div>

          <div style={css('margin-top:28px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + pl.ink2)}>5일 후 등락률</span>
            <span style={css('display:inline-flex;align-items:center;padding:2px;border-radius:9px;background:' + pl.segTrack)}>
              {v.sortSegs.map(sg => (
                <button key={sg.key} onClick={sg.pick} style={css(sg.style)}>{sg.label}</button>
              ))}
            </span>
          </div>
          <div style={css('margin-top:12px;border:1px solid ' + pl.line + ';border-radius:26px;background:' + pl.panelBg + ';overflow:hidden')}>
            <div style={css('display:flex;align-items:center;padding:14px 18px;background:' + pl.subtleBg)}>
              <span style={css('flex:1;font-size:12.5px;font-weight:600;color:' + pl.meta)}>종목</span>
              <span style={css('width:88px;text-align:right;font-size:12.5px;font-weight:600;color:' + pl.meta)}>5일 후 등락률</span>
            </div>
            {v.members.map(m => (
              <div key={m.key} style={css(m.rowStyle)}>
                <span style={css(m.nameStyle)}>{m.name}</span>
                <span style={css(m.valStyle)}>{m.val}</span>
              </div>
            ))}
          </div>

          <div style={css('margin-top:26px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + pl.ink2)}>이 사례의 키워드</div>
          <div style={css('display:flex;flex-wrap:wrap;gap:8px;margin-top:12px')}>
            {v.caseTags.map((t, i) => (
              <span key={i} style={css('padding:9px 14px;border-radius:12px;background:' + pl.tagBg + ';font-size:14.5px;font-weight:600;letter-spacing:-0.01em;color:' + pl.tagFg)}>{t}</span>
            ))}
          </div>

          <div style={css('margin-top:14px;font-size:13px;font-weight:500;line-height:1.55;color:' + pl.meta + ';text-wrap:pretty')}>사례 상세에서도 원인 문장에서 키워드를 추출합니다. 오늘 사건과 공통되는 키워드가 유사도의 근거가 됩니다.</div>
          <div style={css('margin-top:16px;font-size:12px;font-weight:500;line-height:1.5;color:' + pl.meta)}>현재 가격이나 매수·매도 판단이 아닌, 해당 사건 이후의 과거 반응을 보여줍니다.</div>
        </div>
      </div>
    );
  }

  renderStats(v) {
    const p = v.p;
    return (
      <div style={css('position:absolute;inset:0;background:' + p.screenBg + ';display:flex;flex-direction:column;animation:pushIn .28s ease both')}>
        <div style={css('flex:none;display:flex;align-items:center;justify-content:space-between;padding:' + this.padTop(50) + ' 20px 4px')}>
          <button className="icon-btn press" onClick={v.toTheme} aria-label="Back" style={css('width:44px;height:44px;border-radius:22px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          </button>
          <span style={css('font-size:17px;font-weight:700;letter-spacing:-0.02em;color:' + p.fg)}>상세 통계</span>
          <span style={css('width:44px')}></span>
        </div>
        <div style={css('flex:1;min-height:0;overflow-y:auto;padding:14px 22px 40px')}>
          <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:12px')}>
            <span style={css('display:flex;flex-direction:column;gap:6px')}>
              <span style={css('font-size:28px;font-weight:800;letter-spacing:-0.035em;color:' + p.fg)}>{v.theme} 테마</span>
              <span style={css('font-size:13.5px;font-weight:500;color:' + p.fg2)}>과거 부각 사례 34건</span>
            </span>
            <span style={css('flex:none;padding:8px 13px;border-radius:15px;background:' + p.tintBg + ';font-size:12.5px;font-weight:700;color:' + p.tintFg)}>2010.03–2026.07</span>
          </div>

          <div style={css('margin-top:26px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>핵심 통계</span>
            <span style={css('font-size:12.5px;font-weight:600;color:' + p.fg2)}>수익률 %</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid ' + p.cardLine + ';border-radius:26px;padding:6px 18px 8px')}>
            <div style={css('display:flex;padding:14px 0 10px;border-bottom:1px solid ' + p.cardLine)}>
              <span style={css('flex:1;font-size:12px;font-weight:600;color:' + p.fg2)}>구분</span>
              {v.statCols.map(c => (
                <span key={c} style={css('width:54px;text-align:right;font-size:12px;font-weight:600;color:' + p.fg2)}>{c}</span>
              ))}
            </div>
            {v.statRows.map(r => (
              <div key={r.key} style={css(r.rowStyle)}>
                <span style={css('flex:1;font-size:15px;font-weight:700;letter-spacing:-0.015em;color:' + p.fg)}>{r.label}</span>
                {r.cells.map(cell => (
                  <span key={cell.key} style={css(cell.style)}>{cell.val}</span>
                ))}
              </div>
            ))}
          </div>

          <div style={css('margin-top:28px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>평균 누적 흐름</span>
            <span style={css('font-size:12.5px;font-weight:600;color:' + p.fg2)}>사건일을 0%로 환산</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid ' + p.cardLine + ';border-radius:26px;padding:18px 18px 14px')}>
            <svg viewBox="0 0 300 120" width="100%" height="132" style={css('display:block;overflow:visible')}>
              <text x="0" y="12" fontSize="9" fontWeight="600" fill={p.fg3}>+4%</text>
              <text x="0" y="58" fontSize="9" fontWeight="600" fill={p.fg3}>+2%</text>
              <text x="0" y="104" fontSize="9" fontWeight="600" fill={p.fg3}>0%</text>
              <line x1="26" y1="8" x2="300" y2="8" stroke={p.faintLine} strokeWidth="1"></line>
              <line x1="26" y1="54" x2="300" y2="54" stroke={p.faintLine} strokeWidth="1"></line>
              <line x1="26" y1="100" x2="300" y2="100" stroke={p.cardLine} strokeWidth="1"></line>
              <path d="M30 100 L46 92 L64 96 L82 80 L100 84 L120 66 L140 70 L160 54 L182 58 L204 44 L226 48 L250 32 L276 26 L296 18" fill="none" stroke={p.chartLine} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="640" style={css('animation:draw 1.2s ease both')}></path>
              <path d="M30 100 L60 99 L92 96 L126 95 L160 92 L196 90 L232 88 L268 86 L296 84" fill="none" stroke={p.chartRef} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="296" cy="18" r="4.6" fill={p.chartLine}></circle>
              <text x="26" y="118" fontSize="9.5" fontWeight="600" fill={p.fg3}>D+1</text>
              <text x="150" y="118" fontSize="9.5" fontWeight="600" fill={p.fg3}>D+5</text>
              <text x="272" y="118" fontSize="9.5" fontWeight="600" fill={p.fg3}>D+20</text>
            </svg>
            <div style={css('display:flex;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid ' + p.faintLine)}>
              <span style={css('display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:' + p.fg)}><span style={css('width:16px;height:3px;border-radius:2px;background:' + p.chartLine)}></span>{v.theme} 테마</span>
              <span style={css('display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:' + p.fg2)}><span style={css('width:16px;height:3px;border-radius:2px;background:' + p.chartRef)}></span>KOSPI</span>
            </div>
          </div>

          <div style={css('margin-top:28px;display:flex;align-items:baseline;justify-content:space-between')}>
            <span style={css('font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>20일 후 수익률 분포</span>
            <span style={css('font-size:12.5px;font-weight:600;color:' + p.fg2)}>사례 34건</span>
          </div>
          <div style={css('margin-top:12px;border:1px solid ' + p.cardLine + ';border-radius:26px;padding:20px 18px 16px')}>
            <div onPointerLeave={v.clearHover} style={css('position:relative;display:flex;align-items:flex-end;gap:8px;height:118px')}>
              {v.tip && (
                <span style={css(v.tip.style)}>
                  <span style={css('font-size:11.5px;font-weight:700;color:rgba(255,255,255,.62)')}>{v.tip.range}</span>
                  <span style={css('font-size:14px;font-weight:800;letter-spacing:-0.01em;color:#fff')}>{v.tip.count}</span>
                </span>
              )}
              {v.bins.map(b => (
                <div key={b.key} onPointerEnter={b.hover} onPointerDown={b.hover} style={css('flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:8px;cursor:pointer;touch-action:none')}>
                  <span style={css(b.label)}>{b.n}</span>
                  <span style={css(b.bar)}></span>
                </div>
              ))}
            </div>
            <div style={css('display:flex;margin-top:10px;padding-top:10px;border-top:1px solid ' + p.faintLine)}>
              {v.axis.map(t => (
                <span key={t} style={css('flex:1;text-align:center;font-size:11px;font-weight:600;color:' + p.fg3)}>{t}</span>
              ))}
            </div>
          </div>

          <div style={css('margin-top:28px;font-size:19px;font-weight:800;letter-spacing:-0.03em;color:' + p.fg)}>위험과 데이터 품질</div>
          <div style={css('margin-top:12px;border:1px solid ' + p.cardLine + ';border-radius:26px;padding:6px 18px 8px')}>
            {v.quality.map(q => (
              <div key={q.key} style={css(q.rowStyle)}>
                <span style={css('font-size:14.5px;font-weight:600;color:' + p.qualityFg)}>{q.k}</span>
                <span style={{ ...css('font-size:15px;font-weight:800;letter-spacing:-0.01em'), color: q.color }}>{q.v}</span>
              </div>
            ))}
          </div>

          <div style={css('margin-top:18px;font-size:12px;font-weight:500;line-height:1.5;color:' + p.fg3)}>과거 수익률은 미래 성과를 보장하지 않으며, 통계와 표본 구간을 함께 확인해 주세요.</div>
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
        dark={v.isDark}
        bare={bare}
      >
        <div style={{ ...css("height:100%;position:relative;overflow:hidden;font-family:'Pretendard',system-ui,sans-serif;-webkit-font-smoothing:antialiased"), background: v.pageBg }}>
          {v.isSplash && this.renderSplash(v)}
          {v.isHome && this.renderHome(v)}
          {v.isTheme && this.renderTheme(v)}
          {v.isCases && this.renderCases(v)}
          {v.isCase && this.renderCase(v)}
          {v.isStats && this.renderStats(v)}
          {/* 토스트는 원래 잉크색(#16160F) 판인데 다크 배경(#1C1917)과 명도가
              거의 같아 안 보인다. 다크에서는 밝은 판으로 뒤집는다. */}
          {v.toast && (
            <div style={css('position:absolute;left:22px;right:22px;bottom:44px;z-index:20;padding:14px 16px;border-radius:20px;font-size:14px;font-weight:600;box-shadow:0 12px 30px rgba(20,20,10,.24);animation:fadeIn .18s ease both;'
              + (v.p.dark ? 'background:#F5F3F0;color:#1C1917' : 'background:#16160F;color:#fff'))}>{v.toast}</div>
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
