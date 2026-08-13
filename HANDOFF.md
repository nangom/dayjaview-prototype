# UI 담당자용 안내

DAY-JA-VIEW 디자인 시안입니다. 이 문서만 보면 수정해서 반영할 수 있습니다.

- **레포**: https://github.com/nangom/dayjaview-prototype (public)
- **배포된 화면**: https://dayjaview-prototype.vercel.app

## 1. 받아서 띄우기

```bash
git clone https://github.com/nangom/dayjaview-prototype.git
cd dayjaview-prototype
python -m http.server 8899 --bind 127.0.0.1
```

http://127.0.0.1:8899 를 열면 됩니다.

빌드 과정이 없습니다. 저장하고 브라우저 새로고침하면 바로 반영됩니다.
npm install 같은 것도 필요 없습니다.

> React·Babel·Pretendard 폰트를 CDN에서 받으므로 **인터넷 연결이 필요합니다.**
> 오프라인에서는 화면이 안 뜹니다.

## 2. 고칠 파일

**`index.html` 하나입니다.** 나머지는 건드리지 마세요.

```
index.html          ← 여기만 수정
assets/             dc-runtime, 이미지  (수정 대상 아님)
tools/unbundle.py   시안 번들 변환기     (수정 대상 아님)
vercel.json         배포 설정            (수정 대상 아님)
```

`index.html`은 평범한 HTML입니다. 화면 코드는 `<script type="text/x-dc">` 안에
JSX로 들어 있고, 스타일은 같은 파일 안 `<style>`에 있습니다.

## 3. 반영하기

```bash
git add index.html
git commit -m "디자인 수정: (무엇을 고쳤는지)"
git push
```

> **현재 push 자동배포가 연결되어 있지 않습니다.**
> push해도 https://dayjaview-prototype.vercel.app 은 바뀌지 않습니다.
> push하신 뒤에 알려주시면 배포하겠습니다. (연동 작업 진행 중)

## 4. 주의사항

### index.html 이 이 화면의 원본입니다

원래 이 파일은 claude.ai/design에서 내보낸 시안을 변환해서 만든 것입니다.
**하지만 지금부터는 `index.html`이 원본입니다.** 디자인 수정은 여기서 합니다.

design 쪽에서 새로 내보내 덮어쓰면 손으로 고친 내용이 전부 사라지기 때문에,
`tools/unbundle.py`에 안전장치를 넣어뒀습니다. `index.html`이 이미 있으면
`--force` 없이는 덮어쓰지 않습니다.

혹시 design 쪽 시안으로 갈아엎어야 할 상황이 생기면, 그건 수정분을 버리는
결정이니 팀에서 먼저 합의해 주세요.

### 폰트·라이브러리는 CDN입니다

`@font-face`를 직접 넣지 마세요. Pretendard는 이미 jsDelivr CDN으로 로드됩니다.
(원래 시안 파일은 폰트를 통째로 품고 있어서 22.7MB였습니다. CDN으로 돌려서
230KB가 됐습니다. 폰트 파일을 다시 넣으면 레포가 다시 무거워집니다.)

React·ReactDOM·Babel도 unpkg에서 로드됩니다. 버전을 바꾸지 마세요.

### 커밋하면 안 되는 것

`.gitignore`에 넣어뒀지만 참고로:

- `Dejavu*.html` — claude.ai/design 원본 번들 (22MB대)
- `.vercel/`, `.env*` — 배포 토큰

## 5. 막히면

- 화면이 하얗게만 나옴 → 인터넷 연결 확인, 브라우저 콘솔(F12) 확인
- `file://`로 열면 안 됩니다. 반드시 위 `python -m http.server`로 띄우세요
- 그 외에는 이슈로 남겨주세요
