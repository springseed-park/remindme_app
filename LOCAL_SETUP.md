# 💻 로컬 개발 환경 설정 완벽 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [프로젝트 다운로드](#프로젝트-다운로드)
3. [API 키 설정](#api-키-설정)
4. [앱 실행](#앱-실행)
5. [문제 해결](#문제-해결)

---

## 사전 준비

### 1. Node.js 설치 확인

**터미널에서 확인**:
```bash
node --version
# 출력: v18.x.x 이상이어야 함
```

**Node.js가 없다면**:
- https://nodejs.org 방문
- LTS 버전 다운로드 및 설치

---

## 프로젝트 다운로드

### 방법 1: Git으로 클론 (권장)

```bash
# 원하는 위치로 이동
cd ~/Documents  # Mac/Linux
cd C:\Users\YourName\Documents  # Windows

# 저장소 클론
git clone https://github.com/springseed-park/remindme_app.git

# 프로젝트 폴더로 이동
cd remindme_app
```

### 방법 2: ZIP 파일 다운로드

1. GitHub 페이지 방문: https://github.com/springseed-park/remindme_app
2. 녹색 "Code" 버튼 클릭
3. "Download ZIP" 선택
4. 압축 해제 후 폴더로 이동

---

## API 키 설정

### 1️⃣ OpenAI API 키 발급받기

1. **OpenAI 계정 만들기**
   - https://platform.openai.com/signup 방문
   - 이메일로 가입

2. **API 키 생성**
   - https://platform.openai.com/api-keys 접속
   - "Create new secret key" 클릭
   - 이름 입력: `RemindMe App`
   - **생성된 키 복사** (sk-proj-xxx... 형식)
   - ⚠️ 이 키는 다시 볼 수 없으니 반드시 복사하세요!

### 2️⃣ 프로젝트에 API 키 설정

#### VSCode 사용 시 (권장):

```bash
# VSCode로 프로젝트 열기
code .
```

1. 왼쪽 파일 탐색기에서 `.env.local` 파일 클릭
2. 없다면 `.env.example`을 복사해서 `.env.local` 생성:
   ```bash
   cp .env.example .env.local  # Mac/Linux
   copy .env.example .env.local  # Windows
   ```
3. `.env.local` 파일 내용:
   ```env
   OPENAI_API_KEY=sk-proj-여기에_실제_API_키_붙여넣기
   ```
4. `Ctrl+S` (Mac: `Cmd+S`)로 저장

#### 터미널 사용 시:

```bash
# Mac/Linux
echo "OPENAI_API_KEY=sk-proj-여기에_실제_API_키" > .env.local

# Windows (PowerShell)
echo "OPENAI_API_KEY=sk-proj-여기에_실제_API_키" | Out-File -FilePath .env.local -Encoding utf8
```

#### 메모장 사용 시:

1. 메모장 열기
2. 다음 내용 입력:
   ```
   OPENAI_API_KEY=sk-proj-여기에_실제_API_키
   ```
3. 다른 이름으로 저장 → 파일명: `.env.local` → 인코딩: UTF-8

---

## 앱 실행

### 🎯 방법 1: 자동 스크립트 (가장 쉬움!)

#### Mac/Linux:
```bash
# 실행 권한 부여 (최초 1회만)
chmod +x quick-start.sh

# 스크립트 실행
./quick-start.sh
```

#### Windows:
```cmd
# PowerShell 또는 CMD에서 실행
quick-start.bat
```

**스크립트가 자동으로 해주는 것**:
- ✅ Node.js 버전 확인
- ✅ .env.local 파일 생성/확인
- ✅ npm install 실행
- ✅ 개발 서버 시작

---

### 🎯 방법 2: 수동 실행

```bash
# 1. 의존성 설치 (최초 1회만)
npm install

# 2. 개발 서버 실행
npm run dev
```

---

## ✅ 실행 확인

### 성공 메시지:

```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h + enter to show help
```

### 브라우저에서 확인:

1. 브라우저 열기 (Chrome, Firefox, Safari 등)
2. 주소창에 입력: `http://localhost:3000`
3. **정상 작동 확인**:
   - ✅ 3초간 스플래시 화면 (마음일기 로고)
   - ✅ 일기 작성 화면 표시
   - ✅ 하단 네비게이션 4개 버튼

---

## 🧪 기능 테스트

### 1. 일기 작성 테스트

```
텍스트 입력: "오늘은 날씨가 좋아서 산책했다. 기분이 좋았다."
"마음 남기기" 버튼 클릭
```

**예상 결과**:
- 로딩 스피너 표시 (5-10초)
- 자동으로 "기록보기" 화면으로 이동
- AI의 공감 메시지 표시
- 감정 분석 리포트 표시 (주요 감정: 기쁨)

### 2. 채팅 테스트

```
하단 "대화하기" 클릭
메시지 입력: "안녕, 기분이 어때?"
전송 버튼 클릭
```

**예상 결과**:
- AI가 실시간으로 응답 (스트리밍)
- 타이핑 인디케이터 (...) 표시
- 따뜻한 한국어 응답

---

## 🐛 문제 해결

### ❌ "API_KEY environment variable not set" 오류

**원인**: API 키가 설정되지 않음

**해결**:
```bash
# .env.local 파일이 있는지 확인
ls -la .env.local  # Mac/Linux
dir .env.local     # Windows

# 파일 내용 확인
cat .env.local  # Mac/Linux
type .env.local # Windows

# 올바른 형식 확인
# ✅ OPENAI_API_KEY=sk-proj-xxxxx
# ❌ OPENAI_API_KEY="sk-proj-xxxxx" (따옴표 제거!)
# ❌ OPENAI_API_KEY = sk-proj-xxxxx (공백 제거!)
```

### ❌ 401 Unauthorized 에러

**원인**: 잘못된 API 키

**해결**:
1. https://platform.openai.com/api-keys 에서 키 상태 확인
2. 키가 유효한지 확인
3. 새 키 발급 후 `.env.local` 업데이트
4. 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### ❌ "Port 3000 is already in use"

**원인**: 다른 프로그램이 3000 포트 사용 중

**해결**:
```bash
# 다른 포트로 실행
npm run dev -- --port 3001

# 브라우저에서 http://localhost:3001 접속
```

### ❌ npm install 실패

**해결**:
```bash
# 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows

npm install
```

### ❌ 브라우저에서 빈 화면만 표시

**해결**:
1. 브라우저 콘솔 열기 (F12)
2. Console 탭에서 에러 메시지 확인
3. 페이지 새로고침 (Ctrl+R 또는 Cmd+R)
4. 시크릿 모드에서 테스트

---

## 🎨 VSCode 추천 설정

### 확장 프로그램 설치

VSCode 열기 → 확장(Extensions) → 검색 후 설치:

1. **ESLint** - 코드 품질 검사
2. **Prettier** - 코드 자동 포맷팅
3. **Tailwind CSS IntelliSense** - Tailwind 자동완성
4. **ES7+ React/Redux/React-Native snippets** - React 스니펫

### 자동 포맷팅 활성화

VSCode 설정 (Ctrl+,):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## 📊 개발 서버 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 (dist/ 폴더) |
| `npm run preview` | 빌드 결과 미리보기 |

### 서버 중지

- `Ctrl+C` (터미널에서)

### 코드 수정 시

- 자동으로 브라우저가 새로고침됨 (Hot Reload)
- 수동 새로고침: `Ctrl+R` 또는 `Cmd+R`

---

## 🔐 보안 주의사항

### ⚠️ 절대 하지 말 것

- ❌ `.env.local` 파일을 Git에 커밋
- ❌ API 키를 다른 사람과 공유
- ❌ API 키를 코드에 직접 입력
- ❌ API 키를 공개 저장소에 업로드

### ✅ 안전하게 사용하기

- ✅ `.env.local`은 `.gitignore`에 포함됨 (자동)
- ✅ API 키는 정기적으로 교체
- ✅ 사용하지 않는 키는 삭제
- ✅ OpenAI 대시보드에서 사용량 모니터링

---

## 💰 비용 관리

### OpenAI API 요금

- **GPT-4o-mini**: 매우 저렴
  - 입력: 1M 토큰당 $0.15
  - 출력: 1M 토큰당 $0.60
  
### 예상 비용

| 작업 | 토큰 | 비용 |
|------|------|------|
| 일기 1개 작성 | ~1,500 | ~$0.001 |
| 채팅 메시지 1개 | ~500 | ~$0.0003 |
| 주간 리포트 | ~2,000 | ~$0.002 |

**일일 10회 사용 시**: 월 $1 미만

### 사용량 확인

- https://platform.openai.com/usage
- 일일/월별 사용량 그래프
- 청구 금액 확인

---

## 📱 모바일에서 테스트

### 같은 Wi-Fi 연결 시

1. 터미널에서 Network 주소 확인:
   ```
   ➜  Network: http://192.168.1.100:3000/
   ```

2. 모바일 브라우저에서 해당 주소 접속

### 반응형 디자인 테스트

- Chrome DevTools (F12) → 모바일 아이콘 클릭
- 다양한 화면 크기 테스트 가능

---

## 🚀 다음 단계

환경 설정이 완료되었다면:

1. **코드 탐색**: 각 파일 구조 이해하기
2. **커스터마이징**: 디자인, 메시지 수정
3. **기능 추가**: 새로운 감정 분석 추가
4. **배포**: Vercel/Netlify에 배포

---

## 📚 추가 문서

- **README.md**: 프로젝트 전체 개요
- **SETUP_GUIDE.md**: 상세 설정 가이드
- **TEST_RUN.md**: 테스트 시나리오

---

## 💡 유용한 팁

### 1. LocalStorage 데이터 확인

브라우저 개발자 도구 (F12) → Application 탭:
- `diaryEntries`: 저장된 일기
- `notifications`: 알림 목록

### 2. 데이터 초기화

```javascript
// 브라우저 콘솔에서 실행
localStorage.clear()
location.reload()
```

### 3. 샘플 데이터로 테스트

- 앱 최초 실행 시 30개의 샘플 일기가 자동으로 로드됨
- 실제 데이터를 추가하면 샘플 데이터는 사라짐

---

**문제가 해결되지 않나요?**

- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) 참고
- 🐛 [GitHub Issues](https://github.com/springseed-park/remindme_app/issues) 등록
- 📝 에러 메시지와 함께 스크린샷 첨부

**즐거운 개발 되세요!** 🎉
