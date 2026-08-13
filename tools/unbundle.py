"""Claude Design 번들 HTML을 git 친화적인 소스로 되돌린다.

사용법:  python tools/unbundle.py "<번들.html>" <출력디렉터리>
예:      python tools/unbundle.py "~/Downloads/Dejavu App5.html" .

번들은 폰트와 라이브러리까지 base64로 전부 품고 있어 22MB를 넘지만,
실제 앱 화면 코드(template 아일랜드)는 50KB 남짓이다. 이 스크립트는

  - Pretendard @font-face 를 jsDelivr CDN 링크로 되돌리고
  - 나머지 에셋(dc-runtime, iOS 프레임, 로고)만 assets/ 로 떼어내고
  - React/ReactDOM/Babel 은 dc-runtime 이 unpkg 에서 직접 받게 둔다 (원래 동작)

결과는 index.html + assets/ 몇 개. git diff 가 읽히는 형태가 된다.
"""

import base64
import gzip
import json
import os
import re
import sys
import zlib

PRETENDARD_CDN = (
    '<link rel="stylesheet" '
    'href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@1.3.9'
    '/dist/web/static/pretendard.min.css">'
)

EXT_BY_MIME = {
    "text/javascript": ".js",
    "text/jsx": ".jsx",
    "text/css": ".css",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "font/woff": ".woff",
    "font/woff2": ".woff2",
}

# 내용을 보고 알아볼 수 있는 에셋은 사람이 읽는 이름을 준다.
SNIFF = [
    ("dc-runtime", b"GENERATED from dc-runtime"),
    ("ios-frame", b"iOS.jsx"),
]

UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")


def island(html, kind):
    """<script type="__bundler/{kind}"> 아일랜드의 내용을 꺼낸다."""
    m = re.search(r'<script type="__bundler/%s">' % kind, html)
    if not m:
        return None
    end = html.find("</script>", m.end())
    return html[m.end() : end].strip()


def inflate(raw):
    for fn in (gzip.decompress, zlib.decompress, lambda b: zlib.decompress(b, -15)):
        try:
            return fn(raw)
        except Exception:
            pass
    raise ValueError("decompress failed")


def slug(text):
    s = re.sub(r"(?<!^)(?=[A-Z])", "-", text).lower()
    return re.sub(r"[^a-z0-9._-]+", "-", s).strip("-")


def asset_name(uuid, ext_id, data):
    for name, marker in SNIFF:
        if marker in data[:4096]:
            return name
    return slug(ext_id) if ext_id else uuid[:8]


def main(src, outdir):
    src = os.path.expanduser(src)
    html = open(src, encoding="utf-8", errors="replace").read()
    print("번들: %.1f MB  (%s)" % (len(html) / 1024 / 1024, os.path.basename(src)))

    template = island(html, "template")
    if template is None:
        sys.exit(
            "__bundler/template 아일랜드가 없습니다.\n"
            "파일이 잘렸거나(예: API 256KiB 제한) 번들 형식이 아닙니다."
        )
    out = json.loads(template)

    manifest = json.loads(island(html, "manifest") or "{}")
    ext_raw = island(html, "ext_resources")
    ext = {r["uuid"]: r["id"] for r in json.loads(ext_raw)} if ext_raw else {}

    blobs, mimes = {}, {}
    for uuid, ent in manifest.items():
        raw = base64.b64decode(ent.get("data", ""))
        if ent.get("compressed"):
            raw = inflate(raw)
        blobs[uuid] = raw
        mimes[uuid] = ent.get("mime", "application/octet-stream")

    # 1) 번들 폰트를 참조하는 @font-face 규칙을 제거하고 CDN 링크로 대체
    font_uuids = {u for u, m in mimes.items() if m.startswith("font/")}
    removed = 0

    def drop_font_rule(m):
        nonlocal removed
        if any(u in m.group(0) for u in font_uuids):
            removed += 1
            return ""
        return m.group(0)

    out = re.sub(r"@font-face\{[^}]*\}", drop_font_rule, out)
    if removed:
        out = out.replace("<head>", "<head>\n" + PRETENDARD_CDN, 1)
    print("@font-face %d개 제거 → CDN 링크 (폰트 파일 %d개 불필요)" % (removed, len(font_uuids)))

    # 2) 남은 uuid 참조: 원래 외부 URL로 되돌리거나 assets/ 로 추출
    assets = os.path.join(outdir, "assets")
    os.makedirs(assets, exist_ok=True)
    written = []
    for uuid in sorted(set(UUID_RE.findall(out))):
        target = ext.get(uuid, "")
        if target.startswith("http"):
            out = out.replace(uuid, target)
            print("  %s → %s" % (uuid[:8], target))
            continue
        data = blobs.get(uuid)
        if data is None:
            print("  %s → 매니페스트에 없음, 그대로 둠" % uuid[:8])
            continue
        fname = asset_name(uuid, target, data) + EXT_BY_MIME.get(mimes[uuid], ".bin")
        with open(os.path.join(assets, fname), "wb") as fh:
            fh.write(data)
        out = out.replace(uuid, "assets/" + fname)
        written.append((fname, len(data)))
        print("  %s → assets/%s (%s bytes)" % (uuid[:8], fname, format(len(data), ",")))

    leftover = sorted(set(UUID_RE.findall(out)))
    if leftover:
        print("!! 처리하지 못한 uuid 참조: %s" % ", ".join(u[:8] for u in leftover))

    index = os.path.join(outdir, "index.html")
    with open(index, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(out)

    total = os.path.getsize(index) + sum(s for _, s in written)
    print("\n%s" % os.path.abspath(outdir))
    print("  index.html%s%9s bytes" % (" " * 12, format(os.path.getsize(index), ",")))
    for f, s in written:
        print("  assets/%-18s %9s bytes" % (f, format(s, ",")))
    print(
        "  합계 %.0f KB   원본 %.1f MB 대비 %.2f%%"
        % (total / 1024, len(html) / 1024 / 1024, total * 100.0 / len(html))
    )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
