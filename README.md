# DAY-JA-VIEW — fixture 미리보기

본체(`choidev777-bit/dayjaview`) `apps/web`을 **fixture 모드**로 구운 정적 산출물입니다.
모바일에서 화면을 확인하려고 올려 둔 것이고, 실서비스가 아닙니다.

- 실서비스: https://dayjaview.vercel.app
- 이 미리보기: https://dayjaview-prototype.vercel.app

## 무엇이 들어 있나

- 데이터는 2026-08-10 인포스탁 실데이터(시연본)입니다. 지어낸 값은 없습니다.
- 실시간 화면은 2026-08-14 장중 체결(키움 실시간 `0B`)로 만든 분 단위 스냅샷을
  3초에 한 분씩 흘립니다. 정지본을 보려면 `?replay=off`.
- 로그인·저장은 브라우저 안에서만 도는 fixture 어댑터입니다. 서버를 부르지 않습니다.

## 이전 디자인 시안

Claude Design 시안 원본은 `backup/design-main-20260817` 브랜치에 그대로 있습니다.

## 다시 굽는 법

본체 레포에서:

```
cd apps/web
npx vite build --config vite.preview.config.ts
```

`dist-preview/`가 이 레포의 루트 내용입니다. `fixture.html`을 `index.html`로 바꾸고
`vercel.json`(SPA rewrite)을 같이 둡니다.
