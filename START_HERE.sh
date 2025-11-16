#!/bin/bash
#
# RemindMe 앱 - 3분 완성 가이드
#
# 이 파일을 읽고 따라하세요!
#

echo "================================"
echo "RemindMe 앱 로컬 실행 가이드"
echo "================================"
echo ""

cat << 'GUIDE'

📌 요구사항:
  - Node.js 18 이상 (https://nodejs.org)
  - OpenAI API 키 (https://platform.openai.com/api-keys)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 3단계로 시작하기:

┌─────────────────────────────────────────┐
│ 1단계: 프로젝트 다운로드                │
└─────────────────────────────────────────┘

터미널에서 실행:

  git clone https://github.com/springseed-park/remindme_app.git
  cd remindme_app

또는 ZIP 다운로드:
  https://github.com/springseed-park/remindme_app
  → Code 버튼 → Download ZIP

┌─────────────────────────────────────────┐
│ 2단계: API 키 설정                      │
└─────────────────────────────────────────┘

2-1. OpenAI API 키 발급:
  → https://platform.openai.com/api-keys
  → "Create new secret key" 클릭
  → 키 복사 (sk-proj-xxx...)

2-2. 프로젝트에 키 설정:

  방법A) 자동 생성:
    cp .env.example .env.local

  방법B) 직접 생성:
    메모장에서 .env.local 파일 만들고 입력:

    OPENAI_API_KEY=sk-proj-여기에_실제_키_붙여넣기

  ⚠️  따옴표 없이 입력!
  ⚠️  공백 없이 입력!

┌─────────────────────────────────────────┐
│ 3단계: 실행                             │
└─────────────────────────────────────────┘

  자동 실행 (권장):
    ./quick-start.sh         (Mac/Linux)
    quick-start.bat          (Windows)

  수동 실행:
    npm install              (최초 1회)
    npm run dev              (서버 시작)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 성공 확인:

  터미널 메시지:
    ➜  Local:   http://localhost:3000/

  브라우저에서:
    http://localhost:3000 접속
    → 스플래시 화면 (3초)
    → 일기 작성 화면

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 빠른 테스트:

  1. 일기 작성:
     "오늘 날씨가 좋았다" 입력
     → "마음 남기기" 클릭
     → AI 응답 확인

  2. 채팅:
     하단 "대화하기" 클릭
     → "안녕" 입력
     → AI 응답 확인

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 문제 발생 시:

  "API_KEY not set" 오류:
    → .env.local 파일 확인
    → 따옴표 없는지 확인
    → 서버 재시작 (Ctrl+C → npm run dev)

  401 Unauthorized:
    → API 키가 유효한지 확인
    → 새 키 발급

  포트 충돌:
    → npm run dev -- --port 3001

  자세한 해결법:
    → LOCAL_SETUP.md 참고

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 추가 문서:

  • LOCAL_SETUP.md   - 완벽 가이드 (이 파일!)
  • SETUP_GUIDE.md   - VSCode 설정
  • TEST_RUN.md      - 테스트 시나리오
  • README.md        - 프로젝트 개요

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 유용한 명령어:

  npm run dev        # 개발 서버 시작
  npm run build      # 프로덕션 빌드
  Ctrl+C             # 서버 중지

  # 데이터 초기화 (브라우저 콘솔)
  localStorage.clear()
  location.reload()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 즐거운 개발 되세요!

문제가 있다면:
  → GitHub Issues:
    https://github.com/springseed-park/remindme_app/issues

GUIDE

echo ""
echo "================================"
echo "이제 시작할 준비가 되었습니다!"
echo "================================"
