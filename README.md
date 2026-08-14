# DAY-JA-VIEW Product

DAY-JA-VIEW의 제품용 프론트엔드와 디자인 시스템을 함께 관리하는 독립 monorepo다.

## 구조

```text
apps/web/                 Next.js 제품·UX 프로토타입
packages/design-tokens/   색상·타이포·간격·곡률·모션 토큰
packages/ui/              토큰을 사용하는 공통 UI 컴포넌트
docs/                     화면·디자인 시스템 결정
```

## 경계

- 디자인 토큰은 값만 소유한다.
- UI 패키지는 버튼, 앱바, 내비게이션, 데이터 행 같은 재사용 부품을 소유한다.
- 제품 화면과 fixture/API adapter는 `apps/web`이 소유한다.
- 백엔드 분석 엔진과 DB 코드는 이 저장소에 복사하지 않는다.
- 실제 API가 준비되기 전에는 화면에 합성 데이터임을 표시한다.

