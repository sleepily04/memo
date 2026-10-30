# 민감 파일 보호 규칙

아래 파일은 읽거나 내용을 출력, 요약, 인용하지 않는다. 사용자가 요청해도 먼저 확인한다.

- `.env`, `.env.*` (하위 폴더 포함)
- 이름에 `credential` 또는 `secret`이 들어간 파일
- `*.pem`, `*.key`

## 지침
- `cat`, `type`, `head`, `tail`, `grep`, `Get-Content` 등 셸 명령으로 우회해서 읽지 않는다.
- 파일을 복사하거나 이름을 바꿔서 읽는 방식도 쓰지 않는다.
- 이 파일들의 내용을 다른 파일, 커밋, 로그, 외부 서비스에 옮기지 않는다.
- 값이 필요하면 사용자에게 직접 알려 달라고 요청한다.
- 새 민감 파일을 만들 때는 `.gitignore`에 추가할지 사용자에게 확인한다.

참고: 도구 수준 차단은 `.claude/settings.json`의 `permissions.deny`에 설정돼 있다.


# 디자인 토큰

## 색 (Colors)

| 변수 | Light | Dark |
|---|---|---|
| color/primary | #3182f6 | #4d94ff |
| surface/page | #f2f4f6 | #101014 |
| surface/card | #ffffff | #1c1c22 |
| text/primary | #191f28 | #f1f3f5 |
| text/secondary | #4e5968 | #b3bac2 |
| text/muted | #8b95a1 | #6e7783 |
| text/on-primary | #ffffff | #ffffff |
| border/default | #e5e8eb | #2a2a33 |
| label/blue | #3182f6 | #6aa6ff |
| label/blue-soft | #e8f3ff | #1d2a40 |
| label/green | #12a150 | #3ccb7f |
| label/green-soft | #e3f8ec | #17302a |
| label/orange | #f76808 | #ff9446 |
| label/orange-soft | #fff1e5 | #3a2817 |
| label/pink | #e5397a | #ff6fa2 |
| label/pink-soft | #ffeaf1 | #3b1d2a |

## 간격 (Spacing)

| 변수 | 값 |
|---|---|
| space/4 | 4 |
| space/8 | 8 |
| space/12 | 12 |
| space/16 | 16 |
| space/20 | 20 |
| space/24 | 24 |
| space/34 | 34 |
| space/48 | 48 |
| space/64 | 64 |

## 모서리 (Radius)

| 변수 | 값 |
|---|---|
| radius/sm | 12 |
| radius/md | 16 |
| radius/lg | 20 |
| radius/xl | 24 |
| radius/full | 999 |

## 텍스트 스타일

| 스타일 | 폰트 | 크기 | 행간 | 자간 |
|---|---|---|---|---|
| heading/xl | Noto Sans KR Bold | 28 | 38 | -0.8 |
| heading/lg | Noto Sans KR Bold | 26 | 36 | -0.8 |
| title/lg | Noto Sans KR Bold | 20 | 28 | -0.4 |
| title/md | Noto Sans KR Bold | 17 | 24 | -0.3 |
| label/md | Noto Sans KR Bold | 15 | 22 | -0.2 |
| body/md | Noto Sans KR Regular | 16 | 28 | -0.2 |
| body/sm | Noto Sans KR Regular | 14 | 20 | -0.1 |
| caption/md | Noto Sans KR Medium | 15 | 22 | -0.2 |
| caption/sm | Noto Sans KR Medium | 13 | 18 | 0 |
| button/md | Noto Sans KR Bold | 17 | 24 | -0.2 |

## 디자인 규칙
- 위 디자인 토큰에 없는 색·간격·모서리 값은 쓰지 않는다. 새 값이 필요하면 먼저 물어본다.
- 같은 모양의 UI는 기존 컴포넌트를 재사용한다.
- 한글은 Noto Sans KR로 쓰고, 단어 중간에서 줄을 바꾸지 않는다.
- 코드에서는 디자인 토큰 이름만 쓰고, 아이콘 색은 글자색을 따른다.

@AGENTS.md
