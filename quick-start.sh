#!/bin/bash

# RemindMe App - Quick Start Script
# 이 스크립트는 앱을 빠르게 시작하도록 도와줍니다

echo "🚀 RemindMe: 마음일기 - 빠른 시작"
echo "================================"
echo ""

# 1. Node.js 버전 확인
echo "📦 Node.js 버전 확인 중..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되지 않았습니다."
    echo "   https://nodejs.org 에서 Node.js를 설치해주세요."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION 발견"
echo ""

# 2. .env.local 파일 확인
echo "🔑 환경 변수 확인 중..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local 파일이 없습니다."
    echo "   .env.example을 복사하여 생성합니다..."
    cp .env.example .env.local
    echo "✅ .env.local 파일이 생성되었습니다."
    echo ""
    echo "📝 다음 단계:"
    echo "   1. .env.local 파일을 열어주세요"
    echo "   2. OPENAI_API_KEY=your-api-key-here 부분에 실제 API 키를 입력하세요"
    echo "   3. API 키는 https://platform.openai.com/api-keys 에서 발급받을 수 있습니다"
    echo ""
    read -p "API 키를 입력하셨나요? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ API 키를 먼저 설정해주세요."
        exit 1
    fi
fi

# API 키가 설정되어 있는지 확인
if grep -q "your-api-key-here" .env.local || grep -q "your-openai-api-key-here" .env.local; then
    echo "⚠️  API 키가 아직 설정되지 않은 것 같습니다."
    echo ""
    echo "📝 API 키 설정 방법:"
    echo "   1. VSCode에서 .env.local 파일을 엽니다"
    echo "   2. OPENAI_API_KEY=sk-proj-xxxxx 형식으로 실제 키를 입력합니다"
    echo "   3. 파일을 저장합니다"
    echo ""
    read -p "계속하시겠습니까? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ .env.local 파일 확인 완료"
echo ""

# 3. node_modules 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 패키지를 설치합니다..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 의존성 설치 완료"
    else
        echo "❌ 의존성 설치 실패"
        exit 1
    fi
else
    echo "✅ 의존성 패키지가 이미 설치되어 있습니다"
fi
echo ""

# 4. 개발 서버 시작
echo "🎉 모든 준비가 완료되었습니다!"
echo ""
echo "🚀 개발 서버를 시작합니다..."
echo "   브라우저에서 http://localhost:3000 을 열어주세요"
echo ""
echo "💡 팁:"
echo "   - 서버를 중지하려면 Ctrl+C 를 누르세요"
echo "   - 코드를 수정하면 자동으로 새로고침됩니다"
echo ""
echo "================================"
echo ""

npm run dev
