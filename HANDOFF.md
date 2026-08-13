# UI 디자이너용 안내 (2026-08-13 개정)

> **먼저 받으셨던 안내는 버려 주세요.** 그 사이에 프로젝트를 통째로 바꿨습니다.
> 아래 [이전 안내와 달라진 점](#이전-안내와-달라진-점)을 먼저 확인해 주세요.

- **레포**: https://github.com/nangom/dayjaview-prototype (public — 초대 없이 바로 클론됩니다)
- **배포된 화면**: https://dayjaview-prototype.vercel.app

---

## 이전 안내와 달라진 점

| 항목 | 이전 안내 | 지금 |
|---|---|---|
| 프로젝트 형태 | 단일 HTML 파일 | **React + Vite** |
| 고칠 파일 | `index.html` | **`src/App.jsx`** |
| `index.html` | 여기가 화면이었음 | Vite 진입점일 뿐. 화면 코드 없음 |
| 실행 | `python -m http.server` | **`npm install` → `npm run dev`** |
| 레포 공개 | private (초대 필요) | **public** |
| `assets/`, `tools/` | 있었음 | **삭제됨** |

---

## 1. 받아서 띄우기

Node.js가 필요합니다 (18 이상이면 됩니다).

```bash
git clone https://github.com/nangom/dayjaview-prototype.git
cd dayjaview-prototype
npm install
npm run dev
```

터미널에 뜨는 주소(보통 http://localhost:5173)를 열면 됩니다.
파일을 저장하면 브라우저가 알아서 갱신됩니다. 새로고침도 필요 없습니다.

> Pretendard 폰트와 React를 CDN·npm에서 받으므로 **인터넷 연결이 필요합니다.**

---

## 2. 고칠 파일

**`src/App.jsx` 하나입니다.** 931줄짜리 파일 하나에 화면이 전부 들어 있습니다.

```
src/App.jsx          ← 여기만 수정. 화면 6개가 다 여기 있음
src/IOSDevice.jsx    기기 목업 프레임 (테두리·상태바). 손댈 일 거의 없음
src/index.css        전역 스타일과 애니메이션 keyframes
src/css.js           헬퍼. 수정 대상 아님
public/              로고 이미지
index.html           Vite 진입점. 화면 코드 없음. 수정 대상 아님
vercel.json          배포 설정. 수정 대상 아님
```

### 화면별로 어디를 보면 되는지

`src/App.jsx` 안에서 화면마다 메서드가 나뉘어 있습니다.

| 화면 | 메서드 | 줄 |
|---|---|---|
| 스플래시 | `renderSplash` | 468 |
| 홈 (테마 순위) | `renderHome` | 491 |
| 테마 상세 | `renderTheme` | 570 |
| 과거 사례 목록 | `renderCases` | 665 |
| 사례 상세 | `renderCase` | 691 |
| 상세 통계 | `renderStats` | 778 |

### 스타일 쓰는 법

이 프로젝트는 CSS 파일을 따로 두지 않고 **인라인 CSS 문자열**을 씁니다.
`css()` 헬퍼가 문자열을 그대로 받습니다. 평소 쓰시던 CSS를 그대로 적으면 됩니다.

```jsx
<div style={css('margin-top:18px;font-size:19px;font-weight:800;color:#16160F')}>
```

세미콜론으로 구분하고, 속성 이름은 CSS 그대로(`font-size`, `margin-top`) 씁니다.
카멜케이스로 바꾸지 않아도 됩니다.

### 화면 바로 열기

스플래시(2.8초)를 매번 보지 않으려면 주소 뒤에 쿼리를 붙이세요.

```
http://localhost:5173/?screen=home
?screen=theme    ?screen=cases    ?screen=case    ?screen=stats
```

---

## 3. 반영하기

```bash
git add src/App.jsx
git commit -m "디자인 수정: (무엇을 고쳤는지)"
git push
```

`main`에 push하면 **Vercel이 알아서 배포합니다.** 1~2분 뒤
https://dayjaview-prototype.vercel.app 에 반영됩니다. 따로 알려주실 필요 없습니다.

다른 브랜치에 push하면 그 브랜치만의 미리보기 URL이 따로 생깁니다.
확정 전에 보여주고 싶을 때 쓰시면 됩니다.

---

## 4. 꼭 알아두실 것

### 화면이 폭에 따라 두 가지로 나옵니다

| 폭 | 모드 | 모습 |
|---|---|---|
| 520px 미만 | **bare** | 기기 목업 없이 화면을 꽉 채움. 상태바(`9:41`)·홈 인디케이터 없음 |
| 520px 이상 | **목업** | 393×852 아이폰 프레임 안에 표시. 상태바·홈 인디케이터 있음 |

**두 모드를 다 확인해 주세요.** 브라우저 창을 좁혔다 넓히면 바뀝니다.
한쪽만 보고 고치면 다른 쪽이 깨질 수 있습니다.

상단·하단 여백은 `padTop()` / `padBottom()`을 거칩니다. bare 모드에서는 상태바가
없는 만큼 여백을 줄이고, 노치·홈바에 가리지 않도록 안전영역을 더합니다.
여백 값을 바꾸실 때는 `padTop(54)` 처럼 숫자만 바꿔 주세요.

### 폰트를 새로 넣지 마세요

Pretendard가 이미 CDN으로 로드됩니다. `@font-face`를 직접 추가하면 레포가 무거워집니다.
(원래 시안 파일이 폰트를 통째로 품고 있어서 22.7MB였습니다.)

굵기는 100~900 전부 쓸 수 있습니다. `font-weight:800` 같은 식으로 바로 쓰세요.

### 데이터는 전부 가짜입니다

`src/App.jsx` 위쪽의 `themes`, `cases`, `memberRows`가 하드코딩된 목업입니다.
서버 연동은 아직 없습니다. 숫자를 바꾸고 싶으면 이 배열을 고치면 됩니다.

### 커밋하지 마세요

`.gitignore`에 들어 있지만 참고로 — `node_modules/`, `dist/`, `.vercel`

---

## 5. 막히면

- 화면이 하얗게만 나옴 → 터미널과 브라우저 콘솔(F12) 확인
- `npm run dev`가 안 뜸 → Node.js 설치 확인 (`node -v`)
- 그 외에는 이슈로 남겨 주세요
