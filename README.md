# RemindMe: 마음일기 (Mind Diary)

AI 기반 감정 일기 및 심리 분석 웹 애플리케이션

## 📖 소개

**RemindMe: 마음일기**는 사용자의 일상 감정을 기록하고 AI가 공감하며 분석해주는 감정 일기 앱입니다. OpenAI GPT-4o-mini를 사용하여 따뜻한 공감과 심리 분석을 제공합니다.

### 주요 기능

- **📝 감정 일기 작성**: 오늘의 감정과 일상을 자유롭게 기록
- **🤖 AI 공감 응답**: '마음이'가 따뜻하게 공감하는 메시지 전달
- **💭 실시간 채팅**: AI와 실시간으로 대화하며 마음 나누기
- **📊 감정 분석**: CBT(인지행동치료) 기반 감정 패턴 분석
- **📈 트렌드 분석**: 주간/월간 감정 변화 추이 시각화
- **🔔 자동 알림**: 위험도에 따른 맞춤형 마음챙김 제안
- **📅 기록 관리**: 캘린더 기반 과거 일기 조회

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
│   ├── DiaryCard.tsx    # 일기 카드
│   ├── Calendar.tsx     # 캘린더
│   ├── EmotionDonutChart.tsx
│   └── EmotionTrendChart.tsx
├── context/             # React Context
│   ├── DiaryContext.tsx
│   └── NotificationContext.tsx
├── screens/             # 메인 화면
│   ├── HomeScreen.tsx   # 일기 작성
│   ├── ChatScreen.tsx   # AI 채팅
│   ├── HistoryScreen.tsx # 기록 조회
│   └── AnalysisScreen.tsx # 감정 분석
├── services/            # API 서비스
│   └── openaiService.ts # OpenAI API 통합
├── types.ts             # TypeScript 타입 정의
├── App.tsx              # 메인 앱 컴포넌트
├── index.html
├── index.tsx
├── vite.config.ts
└── package.json
```

## 🎨 주요 화면

### 1. 홈 (일기 작성)
사용자가 오늘의 감정을 자유롭게 기록하면, AI가 따뜻하게 공감하는 메시지를 전달합니다.

### 2. 채팅
실시간으로 AI '마음이'와 대화하며 마음을 나눌 수 있습니다.

### 3. 기록 조회
캘린더 기반으로 과거 일기를 조회하고, AI의 분석 결과를 다시 확인할 수 있습니다.

### 4. 감정 분석
- 7일/15일/30일 단위 감정 분포 차트
- 감정 변화 추이 그래프
- AI 기반 주간 심리 리포트

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
