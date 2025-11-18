# RemindMe: 마음의 정원 (Mind Garden)

AI 기반 감정 관리 및 힐링 웹 애플리케이션

## 📖 소개

**RemindMe: 마음의 정원**은 사용자 맞춤형 힐링 경험을 제공하는 감정 기록 및 관리 앱입니다. OpenAI GPT-4o-mini를 사용하여 따뜻한 공감, 심리 분석, 그리고 실천 가능한 힐링 퀘스트를 제공합니다.

### 🌟 주요 기능

#### 온보딩 및 개인화
- **👤 사용자 프로필**: 나이, 성별, 관심사, 고민 분야 등을 입력하여 맞춤형 경험 제공
- **🎭 캐릭터 커스터마이징**: 성별에 따른 힐링 친구 캐릭터

#### 힐링 메인 화면
- **🌸 평화로운 공간**: 파스텔톤 배경과 편안한 분위기
- **💬 캐릭터 메시지**: 위로, 격려, 긍정적인 메시지를 랜덤으로 전달
- **🎵 배경 음악**: 자동 재생되는 힐링 음악
- **💧 출석체크 시스템**: 매일 접속 시 마음 포인트 획득

#### 감정 일기 및 퀘스트 시스템
- **📝 감정 일기 작성**: AI가 공감하며 분석하는 일기
- **🎯 자동 퀘스트 생성**: 부정적 감정 감지 시 맞춤형 힐링 미션 제공
- **⭐ 퀘스트 완료 보상**: 마음 포인트 지급 및 개선도 평가
- **💡 실천 가능한 활동**: 5-15분 내 수행 가능한 간단한 힐링 활동

#### 추가 기능
- **💌 편지함**: 과거 감정 기록 및 메시지 보관소
- **🎼 힐링 음악 스튜디오**: 배경 멜로디와 자연의 소리를 믹싱하여 나만의 음악 생성
- **🧪 심리 검사**: 우울, 불안, 스트레스 등 간단한 자가 평가 테스트
- **📊 월간 분석**: 감정 변화 추이, 퀘스트 통계, AI 기반 종합 리포트
- **💭 실시간 채팅**: AI와 실시간으로 대화하며 마음 나누기

## 🛠 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (CDN)
- **AI**: OpenAI GPT-4o-mini
- **Storage**: LocalStorage
- **Charts**: Custom SVG-based components

## 🚀 시작하기

### ⚡ 빠른 시작 (1분)

**Linux/Mac 사용자**:
```bash
git clone https://github.com/springseed-park/remindme_app.git
cd remindme_app
./quick-start.sh
```

**Windows 사용자**:
```cmd
git clone https://github.com/springseed-park/remindme_app.git
cd remindme_app
quick-start.bat
```

스크립트가 자동으로:
1. ✅ Node.js 버전 확인
2. ✅ .env.local 파일 생성
3. ✅ 의존성 설치
4. ✅ 개발 서버 실행

**중요**: `.env.local` 파일에서 `OPENAI_API_KEY`를 실제 API 키로 변경해야 합니다!

📖 **상세 가이드**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)에서 VSCode 설정 방법 확인

---

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- OpenAI API Key ([여기서 발급](https://platform.openai.com/api-keys))

### 수동 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/springseed-park/remindme_app.git
   cd remindme_app
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**

   `.env.local` 파일에서 OpenAI API 키를 설정하세요:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   브라우저에서 `http://localhost:3000` 접속

5. **프로덕션 빌드**
   ```bash
   npm run build
   npm run preview
   ```

## 📦 배포

### GitHub Pages 배포

1. **vite.config.ts 수정** (base 경로 추가)
   ```typescript
   export default defineConfig({
     base: '/remindme_app/',
     // ... 나머지 설정
   })
   ```

2. **빌드 및 배포**
   ```bash
   npm run build
   # dist 폴더를 GitHub Pages에 배포
   ```

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. 저장소 import
3. 환경 변수 설정: `OPENAI_API_KEY`
4. Deploy 버튼 클릭

**⚠️ 중요**: 프로덕션 환경에서는 OpenAI API 키를 브라우저에 직접 노출하지 마세요. 백엔드 프록시 서버를 구축하는 것을 권장합니다.

## 🔐 보안 권장사항

현재 구현은 **개발/테스트 목적**입니다. 프로덕션 배포 시:

1. **백엔드 API 프록시 구축**
   - Express, Next.js API Routes 등을 사용
   - OpenAI API 호출을 서버에서 처리
   - API 키를 클라이언트에 노출하지 않음

2. **환경 변수 보호**
   - `.env.local`을 `.gitignore`에 추가 (이미 추가됨)
   - Vercel/Netlify 등의 환경 변수 관리 사용

3. **Rate Limiting 구현**
   - 과도한 API 호출 방지
   - 사용자별 요청 제한

## 📂 프로젝트 구조

```
remindme_app/
├── components/          # React 컴포넌트
│   ├── BottomNav.tsx    # 하단 네비게이션
│   ├── SideMenu.tsx     # 햄버거 메뉴 (사이드바)
│   ├── QuestCard.tsx    # 퀘스트 카드
│   ├── DiaryCard.tsx    # 일기 카드
│   ├── Calendar.tsx     # 캘린더
│   ├── EmotionDonutChart.tsx
│   └── EmotionTrendChart.tsx
├── context/             # React Context
│   ├── UserContext.tsx      # 사용자 프로필, 포인트, 출석체크
│   ├── QuestContext.tsx     # 퀘스트 관리
│   ├── DiaryContext.tsx     # 일기 관리
│   └── NotificationContext.tsx
├── screens/             # 메인 화면
│   ├── OnboardingScreen.tsx    # 온보딩 (사용자 정보 입력)
│   ├── HealingHomeScreen.tsx   # 힐링 메인 화면
│   ├── MailboxScreen.tsx       # 편지함
│   ├── MusicStudioScreen.tsx   # 음악 스튜디오
│   ├── PsychTestScreen.tsx     # 심리 검사
│   ├── HomeScreen.tsx          # 일기 작성
│   ├── ChatScreen.tsx          # AI 채팅
│   ├── HistoryScreen.tsx       # 기록 조회
│   └── AnalysisScreen.tsx      # 감정 분석
├── services/            # API 서비스
│   └── openaiService.ts # OpenAI API 통합 (퀘스트 생성 포함)
├── types.ts             # TypeScript 타입 정의 (확장됨)
├── App.tsx              # 메인 앱 컴포넌트
├── index.html
├── index.tsx
├── vite.config.ts
└── package.json
```

## 🎨 주요 화면

### 1. 온보딩
- 5단계 진행 방식
- 생년월일, 성별, 관심사, 궁금증, 싫어하는 것 입력
- 개인화된 힐링 경험을 위한 기초 데이터 수집

### 2. 힐링 메인 화면
- 파스텔톤 그라데이션 배경
- 중앙 캐릭터와 랜덤 위로 메시지
- 출석체크 보상 애니메이션
- 마음 포인트 표시
- 채팅창 바로가기 위젯

### 3. 채팅 및 일기
- 실시간으로 AI '마음이'와 대화
- 감정 일기 작성 시 AI가 공감하며 분석
- 부정적 감정 감지 시 자동으로 힐링 퀘스트 생성

### 4. 퀘스트 시스템
- 감정 기반 맞춤형 미션 자동 생성
- 난이도별 퀘스트 (쉬움/보통/어려움)
- 완료 전후 마음 상태 평가
- 개선도에 따른 추가 보상

### 5. 편지함
- 과거 감정 일기 조회
- AI 응답 및 분석 결과 재확인
- 시간순 정렬 및 감정별 필터링

### 6. 힐링 음악 스튜디오
- 5가지 배경 멜로디 선택
- 6가지 자연의 소리 믹싱
- 볼륨 조절 및 저장
- 메인 화면 배경음악으로 적용

### 7. 심리 검사
- 우울, 불안, 스트레스 등 자가 평가
- 즉시 결과 및 해석 제공
- 권장사항 및 전문가 연락처 안내
- 검사 기록 저장

### 8. 월간 분석
- 7일/15일/30일 단위 감정 분포 차트
- 감정 변화 추이 그래프
- 관심사별 감정 분석
- 퀘스트 통계 (완료율, 평균 개선도)
- AI 기반 종합 심리 리포트

## 🤝 기여

이 프로젝트는 원본 Google Gemini API 버전을 OpenAI API로 재구축한 버전입니다.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## ⚠️ 면책 조항

이 애플리케이션은 전문적인 심리 상담을 대체할 수 없습니다. 심각한 정신 건강 문제가 있는 경우 반드시 전문가의 도움을 받으세요.

- **자살예방 상담전화**: 1393 (24시간)
- **정신건강 위기상담전화**: 1577-0199

## 📞 문의

문제가 발생하거나 질문이 있으시면 [Issues](https://github.com/springseed-park/remindme_app/issues)에 등록해주세요.

---

Made with ❤️ using OpenAI GPT-4o-mini
