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

## 기기 목업 크기

목업은 393x852(iPhone 15 Pro) 고정이다. 화면이 좁을 때 flex 로 폭만 줄이면
높이 852 는 그대로라 비율이 깨지므로, `App.fitFrame()` 이 `transform: scale()` 로
통째로 축소한다. 바깥 div 가 축소된 실제 크기를 잡아줘서 스크롤이 생기지 않는다.

`FRAME_W` / `FRAME_H` 상수를 바꾸면 `vals()` 의 `w` / `h` 도 같이 바꿔야 한다.
