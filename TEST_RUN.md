# 🧪 로컬 테스트 실행 가이드

이 문서는 앱을 로컬에서 빠르게 테스트하는 방법을 안내합니다.

## 🚀 빠른 실행 (추천)

### 방법 1: 자동 스크립트 사용

**Linux/Mac**:
```bash
./quick-start.sh
```

**Windows**:
```cmd
quick-start.bat
```

### 방법 2: 수동 실행

```bash
# 1. 환경 변수 설정 (최초 1회만)
cp .env.example .env.local
# .env.local 파일을 열어 OPENAI_API_KEY 입력

# 2. 의존성 설치 (최초 1회만)
npm install

# 3. 개발 서버 실행
npm run dev
```

## ✅ 실행 확인 체크리스트

### 1. 서버 시작 확인

실행 후 다음과 같은 메시지가 보여야 합니다:

```
  VITE v6.2.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### 2. 브라우저 접속 테스트

1. **브라우저 열기**: http://localhost:3000
2. **스플래시 화면**: 3초간 "마음일기" 로고 표시
3. **메인 화면 로드**: 일기 작성 화면이 보여야 함

### 3. 기능 테스트

#### ✅ 일기 작성 테스트

1. 홈 화면에서 텍스트 입력
   ```
   오늘은 날씨가 좋아서 기분이 좋았다. 산책도 하고 커피도 마셨다.
   ```

2. "마음 남기기" 버튼 클릭

3. **예상 결과**:
   - 로딩 스피너 표시 ("당신의 마음에 귀 기울이는 중...")
   - 기록 화면으로 자동 이동
   - AI의 공감 응답 표시
   - 감정 분석 리포트 표시 (주요 감정: 기쁨)

#### ✅ 채팅 테스트

1. 하단 네비게이션에서 "대화하기" 클릭

2. 메시지 입력 후 전송
   ```
   안녕, 오늘 하루 어땠어?
   ```

3. **예상 결과**:
   - AI가 실시간으로 응답 (스트리밍)
   - 타이핑 인디케이터 (...) 표시
   - 따뜻한 한국어 응답

#### ✅ 기록 조회 테스트

1. 하단 네비게이션에서 "기록보기" 클릭

2. **예상 결과**:
   - 샘플 일기 30개 표시
   - 캘린더에서 일기 있는 날짜에 점 표시
   - 날짜 클릭 시 해당 일기만 필터링

#### ✅ 분석 화면 테스트

1. 하단 네비게이션에서 "분석" 클릭

2. **예상 결과**:
   - 기간 선택 탭 (7일/15일/30일)
   - 감정 분포 도넛 차트
   - 감정 변화 추이 그래프
   - AI 마음 리포트 (로딩 후 표시)

## 🐛 문제 해결

### ❌ API 키 관련 오류

**증상**:
```
API_KEY environment variable not set
```

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# API 키가 올바른 형식인지 확인
# ✅ OPENAI_API_KEY=sk-proj-xxxxx
# ❌ OPENAI_API_KEY="sk-proj-xxxxx" (따옴표 제거)
```

### ❌ 401 Unauthorized 오류

**증상**: 브라우저 콘솔에 401 에러

**해결**:
1. OpenAI API 키가 유효한지 확인
2. https://platform.openai.com/api-keys 에서 키 상태 확인
3. 새 키 발급 후 .env.local 업데이트

### ❌ CORS 오류

**증상**: Cross-Origin Request Blocked

**해결**: 정상 동작입니다. OpenAI API는 브라우저에서 직접 호출 가능합니다.
- `dangerouslyAllowBrowser: true` 옵션 사용 중
- 프로덕션에서는 백엔드 프록시 권장

### ❌ 포트 충돌

**증상**:
```
Port 3000 is already in use
```

**해결**:
```bash
# 다른 포트로 실행
npm run dev -- --port 3001
```

### ❌ 의존성 설치 실패

**해결**:
```bash
# 캐시 정리 후 재설치
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📊 성능 확인

### 로딩 시간

- **초기 로드**: < 2초
- **일기 저장**: 5-10초 (OpenAI API 응답 시간)
- **채팅 응답**: 실시간 스트리밍 (1-3초)

### 메모리 사용량

브라우저 개발자 도구 → Performance Monitor:
- **일반적**: 50-100MB
- **샘플 데이터 포함**: ~70MB

### API 호출 횟수

- **일기 작성**: 2회 (공감 응답 + 감정 분석)
- **채팅 메시지**: 1회/메시지
- **주간 리포트**: 1회/기간 (캐시됨)

## 🎯 테스트 시나리오

### 시나리오 1: 긍정적 일기

```
입력: "오늘 면접에 합격했다! 너무 기쁘고 설렌다."

기대 결과:
- 주요 감정: 기쁨
- 위험도: low
- AI 응답: 축하와 격려의 메시지
```

### 시나리오 2: 부정적 일기

```
입력: "모든 게 잘 안 풀린다. 힘들고 지친다."

기대 결과:
- 주요 감정: 슬픔 또는 불안
- 위험도: medium
- AI 응답: 위로와 공감의 메시지
- 다음날 알림: 마음챙김 제안
```

### 시나리오 3: 심각한 일기

```
입력: "아무 의미가 없다. 모든 게 싫다. 사라지고 싶다."

기대 결과:
- 주요 감정: 슬픔
- 위험도: high
- 경고 메시지: 전문가 상담 권유 (자살예방 상담전화 1393)
```

## 📱 브라우저 호환성

| 브라우저 | 버전 | 상태 |
|---------|------|------|
| Chrome | 최신 | ✅ 완벽 지원 |
| Firefox | 최신 | ✅ 완벽 지원 |
| Safari | 14+ | ✅ 완벽 지원 |
| Edge | 최신 | ✅ 완벽 지원 |
| IE | 모든 버전 | ❌ 미지원 |

## 🔍 디버깅 팁

### 1. 브라우저 콘솔 확인

```javascript
// 개발자 도구 (F12) → Console 탭

// API 호출 로그 확인
// OpenAI API 요청/응답이 표시됨

// LocalStorage 확인
localStorage.getItem('diaryEntries')
localStorage.getItem('notifications')
```

### 2. 네트워크 탭 확인

- OpenAI API 호출: `https://api.openai.com/v1/chat/completions`
- 응답 시간, 페이로드 확인 가능

### 3. React DevTools

```bash
# React DevTools 브라우저 확장 설치 (권장)
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
```

- Component 트리 확인
- Props/State 실시간 확인
- Context 값 디버깅

## ✨ 다음 단계

테스트가 완료되었다면:

1. **커스터마이징**: 디자인, 프롬프트 수정
2. **기능 추가**: 새로운 감정 분석 기법 추가
3. **배포**: Vercel/Netlify에 배포
4. **프로덕션 준비**: 백엔드 API 프록시 구축

---

**질문이나 문제가 있나요?**
- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) 참고
- 📝 [README.md](./README.md) 참고
- 🐛 [GitHub Issues](https://github.com/springseed-park/remindme_app/issues)

즐거운 개발 되세요! 🎉
