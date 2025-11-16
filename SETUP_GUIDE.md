# 🚀 로컬 개발 환경 설정 가이드

## 1. VSCode에서 API 키 설정하기

### 방법 1: .env.local 파일 직접 수정 (권장)

1. **VSCode에서 프로젝트 열기**
   ```bash
   code /path/to/remindme_app
   ```

2. **`.env.local` 파일 열기**
   - 파일 탐색기에서 `.env.local` 클릭
   - 또는 `Ctrl+P` (Mac: `Cmd+P`) → `.env.local` 검색

3. **API 키 입력**
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   ⚠️ **주의**:
   - `sk-proj-` 또는 `sk-`로 시작하는 실제 OpenAI API 키를 입력하세요
   - 따옴표 없이 입력합니다
   - 이 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다

4. **저장** (`Ctrl+S` 또는 `Cmd+S`)

### 방법 2: VSCode 터미널에서 설정

1. **VSCode 터미널 열기**
   - `Ctrl+` ` (백틱) 또는 메뉴: View → Terminal

2. **API 키 설정**
   ```bash
   echo "OPENAI_API_KEY=sk-proj-your-actual-api-key-here" > .env.local
   ```

### ✅ API 키 확인

```bash
cat .env.local
# 출력: OPENAI_API_KEY=sk-proj-...
```

---

## 2. 로컬 개발 환경 실행

### 사전 요구사항 확인

```bash
# Node.js 버전 확인 (18.x 이상 필요)
node --version

# npm 버전 확인
npm --version
```

### 의존성 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

### 실행 결과

```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

### 브라우저에서 확인

1. 브라우저를 열고 `http://localhost:3000` 접속
2. 앱이 정상적으로 로드되면 성공!

---

## 3. OpenAI API 키 발급받기

### API 키가 없다면?

1. **OpenAI 계정 생성**
   - https://platform.openai.com/signup 방문
   - 이메일로 가입

2. **API 키 발급**
   - https://platform.openai.com/api-keys 접속
   - "Create new secret key" 클릭
   - 이름 입력 (예: "RemindMe App")
   - 생성된 키를 **안전하게 복사** (다시 볼 수 없음!)

3. **요금제 확인**
   - 신규 가입 시 무료 크레딧 제공
   - GPT-4o-mini는 매우 저렴 (1000 토큰당 $0.00015)
   - https://platform.openai.com/usage 에서 사용량 확인

---

## 4. 문제 해결 (Troubleshooting)

### ❌ "API_KEY environment variable not set" 오류

**원인**: API 키가 설정되지 않음

**해결**:
```bash
# .env.local 파일이 있는지 확인
ls -la .env.local

# 내용 확인
cat .env.local

# 올바른 형식인지 확인
# ✅ 올바름: OPENAI_API_KEY=sk-proj-...
# ❌ 잘못됨: OPENAI_API_KEY="sk-proj-..." (따옴표 제거)
# ❌ 잘못됨: OPENAI_API_KEY = sk-proj-... (공백 제거)
```

### ❌ 401 Unauthorized 오류

**원인**: 잘못된 API 키

**해결**:
- API 키가 올바른지 확인
- OpenAI 대시보드에서 키 상태 확인
- 새 키를 발급받아 다시 시도

### ❌ 429 Rate Limit 오류

**원인**: API 요청 한도 초과

**해결**:
- 잠시 대기 후 재시도
- OpenAI 요금제 업그레이드 고려
- 사용량 확인: https://platform.openai.com/usage

### ❌ npm install 실패

**해결**:
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### ❌ 포트 3000이 이미 사용 중

**해결**:
```bash
# 다른 포트 사용
npm run dev -- --port 3001
```

---

## 5. 개발 팁

### Hot Reload 활성화

Vite는 자동으로 Hot Module Replacement를 지원합니다.
- 코드를 수정하면 브라우저가 자동으로 새로고침됩니다
- React 상태는 유지됩니다

### 브라우저 개발자 도구

1. **콘솔 열기**: `F12` 또는 `Ctrl+Shift+I`
2. **네트워크 탭**: API 호출 확인
3. **Console 탭**: 에러 메시지 확인
4. **Application 탭**: LocalStorage 데이터 확인

### VSCode 확장 프로그램 추천

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

---

## 6. 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 결과 미리보기

```bash
npm run preview
```

### 배포 전 체크리스트

- [ ] API 키가 환경 변수로 설정되어 있음
- [ ] .env.local이 .gitignore에 포함됨
- [ ] 모든 기능이 정상 작동함
- [ ] 에러가 없음 (콘솔 확인)
- [ ] 빌드가 성공적으로 완료됨

---

## 7. 보안 주의사항

### ⚠️ 절대 하지 말아야 할 것

- ❌ API 키를 Git에 커밋
- ❌ API 키를 코드에 하드코딩
- ❌ API 키를 공개 저장소에 업로드
- ❌ API 키를 다른 사람과 공유

### ✅ 안전하게 관리하기

- ✅ .env.local 파일 사용
- ✅ .gitignore에 .env.local 추가
- ✅ 프로덕션에서는 서버 환경 변수 사용
- ✅ API 키 정기적으로 교체

---

## 8. 다음 단계

개발 환경이 정상적으로 설정되었다면:

1. **코드 탐색**: `src/` 폴더의 파일들 살펴보기
2. **커스터마이징**: 디자인이나 기능 수정해보기
3. **배포 준비**: Vercel이나 Netlify에 배포하기

---

**문제가 있나요?**
- GitHub Issues: https://github.com/springseed-park/remindme_app/issues
- README.md 참고: [README.md](./README.md)

즐거운 개발 되세요! 🎉
