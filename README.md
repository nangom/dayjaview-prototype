# DAY-JA-VIEW 시안 (React + Vite)

디자인 시안을 Vercel에 올려서 보면서 수정하기 위한 저장소.
제품 본체(`choidev777-bit/DAY-JA-VIEW`)와는 분리되어 있다.

- **배포**: https://dayjaview-prototype.vercel.app
- **위치**: 지금은 시안. 나중에 제품 프론트로 승격할 것을 전제로 만든다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 확인
```

## 배포

`main` push → Vercel 자동 배포 → https://dayjaview-prototype.vercel.app
다른 브랜치 push → 그 브랜치 전용 미리보기 URL 생성

`vercel.json`이 dashboard 설정보다 우선한다. 프로젝트 기본값이
`Framework: Other` / `Output: public`이라 그대로 두면 `public/`(로고 2개)만
배포되므로, `vercel.json`의 `framework: vite` · `outputDirectory: dist`를
지우지 말 것.

## 구조

```
index.html            Vite 진입점 (Pretendard CDN 로드)
src/main.jsx          createRoot
src/App.jsx           앱 전체. 화면 6개가 여기 다 있다
src/IOSDevice.jsx     iOS 기기 목업 프레임
src/css.js            문자열 CSS → style 객체 헬퍼
src/index.css         전역 스타일·keyframes
public/               로고 이미지
```

`App.jsx`는 클래스 컴포넌트 하나에 `state.screen`으로 화면을 전환한다.
라우터를 쓰지 않으므로 URL은 항상 `/`다.

화면: `splash` · `home` · `theme` · `cases` · `case` · `stats`

## 데이터

지금은 전부 `App.jsx` 안의 하드코딩 목업이다 (`themes`, `cases`, `memberRows`).
서버 연동은 아직 없다.

## 화면 폭에 따른 두 가지 표시 모드

`App.fitFrame()` 이 뷰포트 폭을 보고 둘 중 하나를 고른다. 기준은 `BARE_MAX_W`(520px).

**좁은 화면 — bare 모드 (실제 모바일)**

기기 목업을 벗기고 뷰포트를 꽉 채운다. 진짜 폰 안에 폰 목업을 또 그리면
앱이 아니라 데모처럼 보이기 때문이다. 테두리 라운드·그림자·다이내믹 아일랜드를
모두 끄고 `100dvh` 로 채운다. `100vh` 가 아니라 `100dvh` 라야 모바일 주소창이
접혔다 펴질 때 높이가 튀지 않는다.

**넓은 화면 — 목업 모드 (데스크톱)**

393x852(iPhone 15 Pro) 기기 프레임 안에 넣어 가운데 정렬한다.

목업은 고정 크기라서 flex 아이템으로 두면 폭만 줄고 높이 852 는 그대로 남아
비율이 0.461 에서 0.282 까지 깨진다. 그렇다고 `flex-shrink:0` 만 주면 이번엔
가로 스크롤이 생긴다. 그래서 레이아웃으로 줄이지 않고 `transform: scale()` 로
통째로 축소하고, 바깥 div 가 축소된 실제 크기를 잡아 스크롤을 막는다.

`FRAME_W` / `FRAME_H` 상수를 바꾸면 `vals()` 의 `w` / `h` 도 같이 바꿔야 한다.

## 화면 바로 열기

스플래시를 건너뛰고 특정 화면으로 바로 갈 수 있다.

```
?screen=home    ?screen=theme    ?screen=cases    ?screen=case    ?screen=stats
```

라우터가 없어서 URL 은 항상 `/` 다. 이 쿼리가 유일한 진입 수단이다.
