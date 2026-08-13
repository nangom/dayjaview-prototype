# DAY-JA-VIEW 프로토타입 (Vercel 배포용)

Claude Design 프로젝트의 디자인 시안을 Vercel에 올려서 보면서 수정하기 위한 저장소.
백엔드/Next.js 앱과는 분리되어 있다.

## 왜 언번들하는가

Claude Design에서 내려받은 HTML은 단일 파일 번들이라 **22.6MB**다.
그런데 실제 앱 화면 코드는 그중 **50KB**뿐이고, 나머지 대부분이 Pretendard 폰트다.

| 내용물 | 크기 | 비중 |
|---|---|---|
| Pretendard 폰트 (woff/woff2 18개) | 21.6 MB | 95% |
| React · ReactDOM · Babel · dc-runtime | 0.92 MB | 4% |
| **앱 화면 코드 (template)** | **50 KB** | **0.2%** |

번들 그대로 커밋하면 고칠 때마다 22MB 블롭이 히스토리에 영구히 쌓이고,
base64 한 덩어리라 `git diff`가 아무것도 보여주지 못한다.

`tools/unbundle.py`가 이걸 되돌린다.

- `@font-face`의 번들 폰트 → jsDelivr Pretendard CDN 링크
- dc-runtime · 로고 등 → `assets/`로 분리
- React · ReactDOM · Babel → dc-runtime이 unpkg에서 직접 로드 (원래 동작)

결과: **22.6MB → 162KB (0.70%)**, 그리고 `index.html`이 읽히는 HTML이 된다.

원본 번들과 렌더 결과가 동일함은 확인했다 (`body.innerHTML` 69,446자 일치,
SVG path 7개 일치, 미해결 템플릿 바인딩 0건, Pretendard 적용됨).

## 지금 원본은 index.html 이다

초기 `index.html`은 claude.ai/design의 `Dejavu App5.html`을 변환해서 만들었다.
**하지만 2026-08-13부터 원본은 `index.html`이다.** 디자인 수정은 여기서 한다.

그래서 `unbundle.py`는 `index.html`이 이미 있으면 `--force` 없이 덮어쓰지 않는다.
design 쪽 시안으로 갈아엎는 건 손수정분을 버리는 결정이라, 팀 합의가 먼저다.

UI 담당자용 안내는 [HANDOFF.md](HANDOFF.md).

## 새 시안으로 갈아엎어야 한다면

```bash
python tools/unbundle.py "~/Downloads/Dejavu App5.html" . --force
python -m http.server 8899 --bind 127.0.0.1   # http://127.0.0.1:8899 에서 확인
```

`--force`는 `index.html`의 손수정 내용을 전부 버린다. 실행 전 `git status`로
커밋 안 된 변경이 없는지 확인할 것.

## 구조

```
index.html          배포되는 화면. 여기를 고친다
assets/             dc-runtime, 로고 등
tools/unbundle.py   번들 → 소스 변환기
vercel.json         cleanUrls, index.html 무캐시
```

원본 번들(`*.bundle.html`)은 `.gitignore` 처리한다. 커밋 대상이 아니다.
