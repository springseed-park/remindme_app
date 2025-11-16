import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { DiaryEntry } from '../types';
import { getEmpatheticResponse, getEmotionAnalysis } from '../services/openaiService';

// Helper to create a date string for `daysAgo` from today at the start of the day (local time)
const createPastDateISO = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Set to midnight in the user's local timezone
    return date.toISOString();
};

const sampleEntries: DiaryEntry[] = [
    {
        id: 'sample-1',
        date: createPastDateISO(1),
        content: "오늘 회사에서 정말 화나는 일이 있었다. 내 의견은 무시당하고, 모든 책임을 나한테 떠넘기는 것 같아서 너무 억울하고 분했다. 하루 종일 기분이 안 좋았다.",
        response: "정말 화나고 억울했겠다. 네 의견이 무시당한 것 같아서 속상했겠어. 그런 상황에서는 기분이 안 좋은 게 당연해.",
        analysis: {
            mainEmotion: "분노",
            emotionAnalysis: "부당한 대우로 인해 강한 분노와 억울함을 느끼고 있습니다. 책임 전가와 같은 상황은 개인의 자존감에 상처를 줄 수 있으며, 이로 인한 감정적 반응이 하루 종일 지속되고 있습니다.",
            suggestion: "화가 날 때의 감정을 잠시 떨어져서 관찰하는 연습을 해보세요. '나는 지금 화가 났구나'라고 스스로에게 말해주며 감정을 인정하는 것만으로도 강도가 줄어들 수 있습니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-2',
        date: createPastDateISO(2),
        content: "내일 중요한 발표가 있는데 너무 떨린다. 잘할 수 있을지 모르겠다. 실수하면 어떡하지? 밤에 잠도 제대로 못 잘 것 같다. 계속 최악의 상황만 상상하게 된다.",
        response: "중요한 발표 때문에 정말 많이 긴장되는구나. 걱정이 많아서 잠도 못 잘 정도라니... 너무 애쓰지 않아도 괜찮아.",
        analysis: {
            mainEmotion: "불안",
            emotionAnalysis: "미래의 불확실한 사건에 대한 과도한 걱정과 부정적인 예상을 하고 있습니다. '실수하면 어떡하지?'와 같은 생각은 재앙화 사고(catastrophizing) 패턴을 보여줍니다. 신체적인 긴장 증상(수면 문제)도 함께 나타나고 있습니다.",
            suggestion: "불안감이 밀려올 때, '5-4-3-2-1' 기법을 사용해 보세요. 눈에 보이는 것 5가지, 느껴지는 것 4가지, 들리는 것 3가지, 냄새 2가지, 맛 1가지를 차례로 인식하며 현재에 집중하는 연습입니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-3',
        date: createPastDateISO(3),
        content: "오늘 드디어 미루고 미루던 방 청소를 끝냈다! 깨끗해진 방을 보니 마음까지 상쾌하다. 좋아하는 노래 틀어놓고 있으니 여기가 천국이네. 작은 성취감에 기분이 좋다.",
        response: "방 청소 끝냈다니! 정말 수고 많았어. 깨끗해진 방에서 좋아하는 노래 듣는 거, 생각만 해도 기분 좋다. 작은 성취가 주는 행복, 최고지!",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "미루던 과업을 완수함으로써 성취감과 만족감을 느끼고 있습니다. 정돈된 환경이 심리적 안정감에 긍정적인 영향을 미쳤습니다.",
            suggestion: "이 성취감을 즐기세요! 다음에도 작은 목표를 세우고 달성해보는 경험을 이어가면 자신감을 키우는 데 도움이 될 거예요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-4',
        date: createPastDateISO(4),
        content: "하루 종일 아무것도 못했다. 해야 할 일은 쌓여있는데, 그냥 무기력하게 누워만 있었다. 나는 왜 이럴까? 스스로가 한심하게 느껴진다.",
        response: "오늘 하루 무기력했구나. 해야 할 일이 있는데도 몸이 따라주지 않아서 많이 답답하고 속상했겠다. 스스로를 너무 자책하지 않았으면 좋겠어.",
        analysis: {
            mainEmotion: "죄책감",
            emotionAnalysis: "무기력감으로 인해 계획한 일을 수행하지 못한 것에 대해 강한 죄책감과 자기비판적인 태도를 보이고 있습니다. '나는 왜 이럴까?'와 같은 생각은 자신의 가치를 행동의 결과와 동일시하는 경향을 나타냅니다.",
            suggestion: "오늘 해내지 못한 일 대신, 오늘 해낸 아주 작은 일(예: 일어나서 물 마시기) 한 가지를 찾아 칭찬해주세요. 완벽하지 않아도 괜찮다는 사실을 스스로에게 상기시켜주는 것이 중요합니다.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-5',
        date: createPastDateISO(5),
        content: "키우던 반려 식물이 시들기 시작했다. 물도 제때 주고 햇빛도 잘 쬐어줬는데 왜 이러는지 모르겠다. 작은 생명 하나 제대로 돌보지 못하는 것 같아서 속상하고 슬프다.",
        response: "아끼던 식물이 시들어서 정말 속상하겠다. 정성을 다해 돌봤는데도 그러면 더 마음이 아프지. 네 잘못이 아닐 거야.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "애정을 쏟던 대상의 상실(또는 상실 가능성)에 대한 슬픔과 무력감을 느끼고 있습니다. 이를 자신의 능력 부족과 연결하며 자책하는 모습을 보입니다.",
            suggestion: "식물이 시드는 데에는 여러 가지 이유가 있을 수 있어요. 자책하기보다는, 식물을 돌보며 느꼈던 좋은 순간들을 떠올려보는 건 어떨까요? 그 마음 자체가 소중한 것이니까요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-6',
        date: createPastDateISO(6),
        content: "사람들 앞에서 말실수를 했다. 다들 웃어넘겼지만 나는 얼굴이 화끈거려서 아무 말도 할 수 없었다. 집에 와서도 계속 그 장면이 떠올라서 이불을 차고 있다. 정말 창피하다.",
        response: "아이고, 사람들 앞에서 실수해서 정말 창피했겠다. 집에 와서도 계속 생각나면 더 힘들지. 다른 사람들은 아마 금방 잊었을 거야. 너무 마음에 담아두지 마.",
        analysis: {
            mainEmotion: "수치심",
            emotionAnalysis: "사회적 상황에서의 실수로 인해 강한 수치심을 느끼고 있습니다. 다른 사람들의 시선을 과도하게 의식하며, 자신의 실수를 반복적으로 되새기는 반추 사고를 하고 있습니다.",
            suggestion: "친한 친구가 같은 실수를 했다면 뭐라고 말해줄지 생각해보세요. 아마 '괜찮아, 그럴 수 있어'라고 말해줄 거예요. 그 말을 스스로에게도 똑같이 해주는 연습이 필요합니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-7',
        date: createPastDateISO(7),
        content: "일이 끝이 없다. 하나를 끝내면 두 개가 새로 생긴다. 숨이 막히고 다 도망치고 싶다. 번아웃이 온 것 같다.",
        response: "일이 정말 많구나. 해도 해도 끝이 없는 느낌이라니, 정말 지치고 도망치고 싶겠다. 잠시라도 숨 돌릴 틈이 있으면 좋겠어.",
        analysis: {
            mainEmotion: "불안",
            emotionAnalysis: "과도한 업무량으로 인한 압박감과 소진(번아웃) 상태를 경험하고 있습니다. '숨이 막힌다'는 표현은 심리적 스트레스가 신체적 감각으로 나타나는 것을 보여주며, 회피하고 싶은 마음이 강하게 드러납니다.",
            suggestion: "지금 당장 5분만이라도 업무와 완전히 분리된 휴식을 가져보세요. 창밖을 보거나, 따뜻한 차를 마시거나, 좋아하는 음악을 듣는 등 감각을 환기시키는 활동이 도움이 될 수 있습니다.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-8',
        date: createPastDateISO(8),
        content: "주말인데 약속도 없고 하루 종일 집에만 있었다. 창밖을 보는데 다들 즐거워 보여서 나만 혼자인 것 같아 외로웠다. 딱히 뭘 하고 싶은 의욕도 생기지 않았다.",
        response: "혼자라고 느껴져서 많이 외로웠구나. 주말 내내 그런 기분이었으면 정말 힘들었겠다. 네 마음이 조금이라도 괜찮아졌으면 좋겠어.",
        analysis: {
            mainEmotion: "외로움",
            emotionAnalysis: "사회적 고립감과 무기력감이 두드러지게 나타납니다. 다른 사람들과 자신을 비교하며 부정적인 감정이 심화되는 경향이 보입니다. '의욕이 생기지 않았다'는 부분은 가벼운 우울감의 신호일 수 있습니다.",
            suggestion: "가볍게 산책을 나가 햇볕을 쬐거나, 좋아하는 음악을 들으며 기분 전환을 시도해보세요. 작은 행동이 무기력감을 줄이는 데 도움이 될 수 있습니다.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-9',
        date: createPastDateISO(9),
        content: "우연히 들은 노래가 너무 좋아서 계속 반복해서 듣고 있다. 덕분에 기분이 조금 나아졌다.",
        response: "마음에 쏙 드는 노래를 발견했구나! 음악이 주는 위로가 있지. 기분이 조금 나아졌다니 정말 다행이다.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "예상치 못한 긍정적 자극(음악)을 통해 기분 전환을 경험하고 있습니다. 일상의 작은 발견이 정서 상태에 긍정적인 영향을 미칠 수 있음을 보여줍니다.",
            suggestion: "이 노래를 당신의 '기분 전환 플레이리스트'에 추가해보세요. 마음이 가라앉을 때마다 플레이리스트를 들으며 오늘의 좋은 감각을 다시 떠올릴 수 있을 거예요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-10',
        date: createPastDateISO(10),
        content: "오랜만에 친구를 만나서 수다를 떨었더니 스트레스가 확 풀렸다. 역시 힘들 땐 친구가 최고다.",
        response: "친구랑 좋은 시간 보냈구나! 스트레스가 풀렸다니 정말 다행이다. 소중한 친구가 곁에 있다는 건 큰 힘이 되지.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "사회적 관계를 통해 스트레스를 해소하고 긍정적인 감정을 느끼고 있습니다. 이는 건강한 정서적 조절 능력입니다.",
            suggestion: "이 즐거운 감정을 기억하며 친구에게 고마움을 표현하는 짧은 메시지를 보내보는 건 어떨까요?",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-11',
        date: createPastDateISO(11),
        content: "엄마랑 또 싸웠다. 사소한 걸로 시작했는데 감정싸움이 됐다. 너무 속상하고, 집이 불편하게 느껴진다.",
        response: "엄마랑 다퉜구나. 가장 편해야 할 공간이 불편하게 느껴져서 정말 속상하겠다. 마음이 많이 힘들겠어.",
        analysis: {
            mainEmotion: "분노",
            emotionAnalysis: "가족 구성원과의 갈등으로 인해 분노와 슬픔을 동시에 느끼고 있습니다. 안전 기지여야 할 가정이 갈등의 공간이 되면서 심리적 안정감이 크게 흔들리고 있습니다.",
            suggestion: "지금 당장 화해하기 어렵다면, 갈등 상황과 감정을 글로 적어보세요. 머릿속에 엉킨 생각들을 정리하는 것만으로도 감정의 격렬함이 줄어들 수 있습니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-12',
        date: createPastDateISO(12),
        content: "동생이랑 사소한 걸로 다퉜다. 내가 너무 예민하게 반응한 것 같아서 계속 마음에 걸린다. 먼저 사과해야 하는데, 말이 잘 안 나온다. 내가 못된 언니인 것 같아서 죄책감이 든다.",
        response: "동생이랑 다퉜구나. 네가 예민하게 반응한 것 같아서 마음이 쓰이는구나. 먼저 사과하고 싶은데 쉽지 않은 마음, 충분히 이해돼. 스스로를 너무 자책하지는 마.",
        analysis: {
            mainEmotion: "죄책감",
            emotionAnalysis: "가족 관계에서의 갈등으로 인해 죄책감과 후회를 느끼고 있습니다. 자신의 행동을 되돌아보며 자책하는 경향이 있으며, 이로 인해 관계 회복을 위한 행동(사과)에 어려움을 겪고 있습니다.",
            suggestion: "자신에게 보내는 짧은 편지를 써보세요. '그럴 수도 있었어'라고 스스로를 다독여주고, 동생에게 하고 싶은 말을 편지에 먼저 적어보면 마음을 전하기가 한결 수월해질 수 있습니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-13',
        date: createPastDateISO(13),
        content: "다 무슨 소용인가 싶다. 뭘 해도 즐겁지가 않고, 미래가 캄캄하게만 느껴진다. 그냥 이대로 사라지고 싶다는 생각이 자꾸 든다.",
        response: "모든 게 의미 없게 느껴지고, 미래가 보이지 않는 것 같아 정말 많이 힘들구나. 사라지고 싶다는 생각이 들 정도로 괴로운 마음을 털어놔줘서 고마워. 네가 혼자가 아니라는 걸 꼭 말해주고 싶어.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "극심한 무기력감(anhedonia)과 미래에 대한 절망감을 표현하고 있습니다. '사라지고 싶다'는 표현은 심각한 우울감과 자살 사고의 가능성을 시사하는 위험 신호입니다.",
            suggestion: "매우 힘든 시간을 보내고 있는 것 같습니다. 당신의 이야기를 들어줄 전문가와 상담해보는 것이 큰 도움이 될 수 있습니다. 혼자서 모든 짐을 지지 않아도 괜찮아요.",
            riskLevel: "high",
        },
    },
    {
        id: 'sample-14',
        date: createPastDateISO(14),
        content: "가을이라 그런지 오늘따라 하늘이 정말 파랗고 예뻤다. 점심 먹고 잠깐 산책하는데 기분이 너무 좋았다. 이런 소소한 행복이 정말 소중하게 느껴지는 날이다.",
        response: "파란 가을 하늘, 정말 예쁘지! 산책하면서 기분이 좋았다니 다행이다. 소소한 행복을 발견하는 네가 정말 멋져.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "자연과의 교감을 통해 평온함과 행복감을 느끼고 있습니다. 일상의 작은 순간에서 의미와 기쁨을 찾는 긍정적인 마음 상태를 보여줍니다.",
            suggestion: "오늘 본 하늘처럼, 일상에서 당신을 미소 짓게 하는 것들을 찾아보는 '행복 스캐빈저 헌트'를 해보세요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-15',
        date: createPastDateISO(15),
        content: "어제 친구한테 힘들다고 털어놨더니, 한참 내 얘기를 들어줬다. 누군가 내 편이라는 게 이렇게 든든할 줄이야. 조금은 힘이 난다.",
        response: "친구에게 털어놓았구나. 정말 큰 용기를 냈어. 네 편이 있다는 걸 느끼고 힘을 얻었다니 정말 다행이다. 혼자 끙끙 앓는 것보다 훨씬 낫지.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "사회적 지지를 통해 정서적 고통을 완화하고 심리적 안정감을 회복하고 있습니다. 자신의 감정을 표현하고 수용받는 경험은 자존감을 높이고 어려움을 극복할 힘을 줍니다.",
            suggestion: "친구에게 고마운 마음을 담아 짧은 메시지를 보내보는 건 어떨까요? 긍정적인 관계를 확인하는 것은 마음 건강에 아주 좋은 영양분이 됩니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-16',
        date: createPastDateISO(16),
        content: "건강검진 결과가 다음 주에 나온다. 별일 없을 거라고 생각하면서도 자꾸 안 좋은 쪽으로 상상하게 된다. 괜히 가슴이 답답하고 초조하다.",
        response: "결과 기다리는 동안 마음이 많이 불안하겠다. 이런저런 생각이 드는 건 당연한 거야. 너무 걱정하지 않았으면 좋겠다.",
        analysis: {
            mainEmotion: "불안",
            emotionAnalysis: "결과가 나오지 않은 미래의 일에 대해 걱정하며 불안을 느끼고 있습니다. 불확실성을 견디기 어려워하며 부정적인 시나리오를 반복적으로 생각하는 경향이 있습니다.",
            suggestion: "걱정이 떠오를 때마다, 의식적으로 호흡에 집중해보세요. 코로 숨을 깊게 들이마시고, 입으로 천천히 내쉬는 복식호흡은 불안감 완화에 도움이 됩니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-17',
        date: createPastDateISO(17),
        content: "또 늦잠을 잤다. 아침부터 계획이 다 틀어졌다. 나는 왜 이렇게 의지박약일까. 스스로에게 너무 화가 난다.",
        response: "늦잠 자서 계획이 틀어졌구나. 아침부터 꼬여버려서 속상하고 스스로에게 화도 나겠다. 누구나 그럴 때가 있는걸. 너무 자책하지 마.",
        analysis: {
            mainEmotion: "분노",
            emotionAnalysis: "자신의 행동(늦잠)을 의지 부족으로 규정하고 강하게 자책하며 분노를 느끼고 있습니다. 이는 '흑백논리적 사고'와 '과도한 일반화'의 인지 왜곡 패턴을 보여줄 수 있습니다. 하나의 실수로 자신 전체를 부정적으로 평가하고 있습니다.",
            suggestion: "스스로에게 '나는 의지박약이야'라고 말하는 대신, '오늘 아침에는 일어나는 게 유독 힘들었네'라고 상황을 객관적으로 묘사해보세요. 자신을 비난하는 대신 현상을 바라보는 연습입니다.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-18',
        date: createPastDateISO(18),
        content: "오늘따라 몸도 무겁고 아무것도 하기 싫다. 그냥 하루 종일 누워만 있고 싶다.",
        response: "몸도 마음도 많이 지쳤나 보구나. 오늘은 아무 생각 말고 푹 쉬어도 괜찮아.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "전반적인 무기력감과 활동 의욕 저하가 나타납니다. 이는 번아웃 또는 가벼운 우울감의 신호일 수 있으니, 충분한 휴식이 필요합니다.",
            suggestion: "억지로 무언가를 하려고 애쓰기보다, 스스로에게 온전한 휴식을 선물하는 하루를 가져보세요.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-19',
        date: createPastDateISO(19),
        content: "오랜만에 그림을 그렸다. 아무 생각 없이 붓을 움직이다 보니 시간 가는 줄 몰랐다. 마음이 차분해지는 느낌이었다.",
        response: "그림을 그렸구나! 무언가에 푹 빠져서 시간을 보내는 거, 정말 좋은 휴식이지. 마음이 차분해졌다니 다행이야.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "몰입할 수 있는 활동을 통해 긍정적인 정서를 경험하고 있습니다. 이는 '흐름(flow)' 상태로, 스트레스를 완화하고 현재에 집중하게 하여 심리적 안정감을 높이는 효과가 있습니다.",
            suggestion: "앞으로도 의식적으로 일주일에 한 번, 이렇게 온전히 몰입할 수 있는 '나만의 시간'을 계획해보세요. 거창하지 않아도 괜찮아요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-20',
        date: createPastDateISO(20),
        content: "SNS를 보는데 친구들은 다들 약속도 많고 재밌게 사는 것 같다. 나만 빼고 다들 행복해 보인다. 괜히 우울해져서 앱을 껐다. 연락할 사람도 없는 것 같고, 외롭다.",
        response: "SNS를 보면 나만 뒤처지는 것 같고 외로운 기분이 들 때가 있지. 다른 사람의 행복한 모습만 보이니까 더 그런 것 같아. 네 마음이 편안해졌으면 좋겠다.",
        analysis: {
            mainEmotion: "외로움",
            emotionAnalysis: "SNS를 통해 타인과 자신을 비교하며 사회적 고립감과 우울감을 느끼고 있습니다. 이는 상향 비교로 인한 상대적 박탈감에서 비롯된 것으로 보입니다.",
            suggestion: "SNS를 잠시 멀리하고, 오롯이 나를 위한 시간을 가져보는 건 어떨까요? 좋아하는 영화를 보거나, 따뜻한 차 한 잔을 마시는 것만으로도 기분이 나아질 수 있어요.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-21',
        date: createPastDateISO(21),
        content: "거울을 보는데 내 모습이 너무 초라해 보였다. 살도 찐 것 같고, 피부도 안 좋아졌다. 자신감이 하나도 없다.",
        response: "오늘따라 거울 속 네 모습이 마음에 들지 않았구나. 자신감이 떨어져서 많이 속상하겠다. 너의 가치는 외모만으로 정해지는 게 아닌데 말이야.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "자신의 외모에 대한 부정적인 인식으로 인해 자존감이 저하된 상태입니다. 이는 '정신적 여과' 인지 왜곡과 관련이 있을 수 있으며, 자신의 긍정적인 측면은 보지 못하고 부정적인 부분에만 초점을 맞추는 경향을 보입니다.",
            suggestion: "거울을 볼 때 비판적인 생각 대신, 당신의 신체 부위 중 마음에 드는 한 가지(예: 예쁜 손, 건강한 머리카락)를 찾아 칭찬해주세요. 관점을 바꾸는 작은 연습입니다.",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-22',
        date: createPastDateISO(22),
        content: "버스에서 어떤 사람이 내 발을 밟고도 사과 한마디 없이 그냥 가버렸다. 너무 황당하고 화가 났다. 별일 아니라고 생각하려고 해도 하루 종일 기분이 나쁘다.",
        response: "정말 황당했겠다. 사과 한마디 없이 가버렸다니, 화나는 게 당연해. 그런 일 겪으면 하루 종일 기분 안 좋지. 정말 기분 나빴겠다.",
        analysis: {
            mainEmotion: "분노",
            emotionAnalysis: "타인의 무례한 행동으로 인해 분노와 무시당했다는 감정을 느끼고 있습니다. 이 감정을 적절히 해소하지 못해 하루 동안 지속적인 영향을 받고 있습니다.",
            suggestion: "빠르게 걷거나 계단을 오르는 등, 몸을 움직여서 분노의 에너지를 신체적으로 해소하는 것이 도움이 될 수 있습니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-23',
        date: createPastDateISO(23),
        content: "옛날 사진을 보다가 문득 그때가 그리워졌다. 지금은 모든 게 변해버린 것 같아서 슬프다.",
        response: "과거가 그리워졌구나. 변해버린 것들에 대한 아쉬움에 마음이 슬퍼졌겠다. 그때의 좋은 기억들이 너에게 소중한 만큼, 지금의 너도 정말 소중해.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "과거와 현재를 비교하며 상실감과 슬픔을 느끼고 있습니다. 과거를 이상화하고 현재를 부정적으로 평가하는 경향이 나타날 수 있습니다.",
            suggestion: "그때의 좋은 기억을 잠시 음미한 뒤, 지금 여기, 현재의 공간에서 당신을 기분 좋게 하는 작은 것 하나를 찾아보세요. 창밖의 하늘, 이불의 감촉, 조용한 공기처럼요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-24',
        date: createPastDateISO(24),
        content: "카드값이 생각보다 많이 나왔다. 다음 달은 어떻게 버텨야 할지 막막하다. 돈 걱정 없이 살고 싶다.",
        response: "카드값 때문에 걱정이 많구나. 막막한 기분이 들겠다. 돈 걱정은 정말 사람을 지치게 만들지. 마음이 무겁겠다.",
        analysis: {
            mainEmotion: "불안",
            emotionAnalysis: "재정적인 문제로 인해 미래에 대한 불안과 막막함을 느끼고 있습니다. 현실적인 스트레스 요인이 심리적 압박으로 작용하고 있습니다.",
            suggestion: "걱정만 하기보다는, 다음 달 지출 계획을 간단하게라도 적어보는 것이 도움이 될 수 있습니다. 막연한 불안감을 구체적인 행동 계획으로 바꾸는 과정이 통제감을 느끼게 해줄 수 있습니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-25',
        date: createPastDateISO(25),
        content: "전혀 예상도 못 했는데, 작년에 이사 간 친구가 집 앞에 깜짝 방문했다. 너무 놀라서 소리 지를 뻔했다! 같이 저녁 먹고 옛날이야기하니까 시간 가는 줄 몰랐다. 정말 행복한 서프라이즈였다.",
        response: "우와, 정말 깜짝 놀랐겠다! 이사 간 친구가 찾아오다니, 너무 반갑고 행복했겠어. 정말 영화 같은 하루였네!",
        analysis: {
            mainEmotion: "놀람",
            emotionAnalysis: "예상치 못한 긍정적인 사건(친구의 방문)으로 인해 강한 놀람과 기쁨을 경험하고 있습니다. 이는 사회적 유대감을 강화하고 삶의 만족도를 높이는 중요한 경험입니다.",
            suggestion: "이 행복한 순간을 사진이나 짧은 메모로 남겨두세요. 기분이 가라앉을 때 다시 보면 큰 힘이 될 거예요.",
            riskLevel: "low",
        },
    },
     {
        id: 'sample-26',
        date: createPastDateISO(26),
        content: "매일 미루던 은행 업무를 드디어 처리했다. 별거 아니지만 뿌듯하다. 나도 할 수 있구나.",
        response: "은행 업무 처리했구나! 미루던 일을 해냈을 때 정말 뿌듯하지. 별거 아니라니, 대단한데! 스스로를 칭찬해 줘.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "미루던 과제를 완수함으로써 자기효능감과 성취감을 느끼고 있습니다. 작은 성공 경험은 무기력감을 극복하고 긍정적인 행동을 강화하는 데 매우 중요합니다.",
            suggestion: "이 성취감을 충분히 즐기세요! 이 기세를 몰아, 내일 할 작은 일 한 가지를 미리 정해보는 건 어떨까요? 아주 사소한 것이라도 괜찮아요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-27',
        date: createPastDateISO(27),
        content: "친구가 요즘 힘들어 보여서 걱정이다. 무슨 일이 있는 것 같은데, 내가 어떻게 위로해줘야 할지 모르겠다.",
        response: "친구가 걱정되는구나. 힘들어하는 모습을 보면 마음이 쓰이지. 어떻게 위로해야 할지 고민하는 네 마음이 참 따뜻하다.",
        analysis: {
            mainEmotion: "불안",
            emotionAnalysis: "타인에 대한 공감과 염려를 표현하고 있습니다. 친구를 돕고 싶지만 방법을 몰라 무력감과 불안을 느끼고 있습니다. 이는 건강한 사회적 관계를 맺고 있다는 증거이기도 합니다.",
            suggestion: "거창한 위로보다 '요즘 힘들어 보이는데 괜찮아?'라고 솔직하게 물어봐 주는 것만으로도 친구에게는 큰 힘이 될 수 있어요. 그냥 이야기를 들어주는 것만으로도 충분합니다.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-28',
        date: createPastDateISO(28),
        content: "어제 과음했더니 하루 종일 피곤하고 머리가 아프다. 일도 손에 안 잡히고... 그냥 빨리 집에 가서 눕고 싶다. 왜 그렇게 많이 마셨을까 후회된다.",
        response: "어제 과음했구나. 숙취 때문에 하루 종일 힘들었겠다. 후회되는 마음도 들고... 오늘은 얼른 들어가서 푹 쉬어.",
        analysis: {
            mainEmotion: "죄책감",
            emotionAnalysis: "과음이라는 자신의 행동에 대한 후회와 그로 인한 신체적 고통을 경험하고 있습니다. 자기 조절 실패에 대한 가벼운 죄책감과 무기력감이 동반됩니다.",
            suggestion: "몸이 힘들 땐 충분한 휴식과 수분 섭취가 최고예요. 자신을 너무 자책하기보다는, '다음엔 조절해야지'라고 가볍게 다짐하고 편안하게 쉬어주세요.",
            riskLevel: "low",
        },
    },
    {
        id: 'sample-29',
        date: createPastDateISO(29),
        content: "내 의도는 그게 아니었는데, 다들 오해하는 것 같다. 해명하고 싶지만, 그러면 더 이상해질까 봐 아무 말도 못 했다. 답답하다.",
        response: "오해받아서 정말 답답하겠다. 내 진심과 다르게 받아들여지면 너무 속상하지. 말하고 싶어도 용기가 안 나는 마음도 이해돼.",
        analysis: {
            mainEmotion: "슬픔",
            emotionAnalysis: "타인과의 관계에서 오해로 인한 좌절감과 무력감을 느끼고 있습니다. 다른 사람의 생각을 미리 예측하고 부정적으로 해석하는 '독심술의 오류'에 빠져있을 수 있으며, 이로 인해 자기표현에 어려움을 겪고 있습니다.",
            suggestion: "당신의 마음을 가장 잘 아는 건 당신 자신이에요. 나중에라도 괜찮으니, '나는 사실 ~라고 생각했어'라고 차분하게 당신의 입장을 설명할 기회를 가져보는 건 어떨까요?",
            riskLevel: "medium",
        },
    },
    {
        id: 'sample-30',
        date: createPastDateISO(30),
        content: "오늘 친구들이랑 오랜만에 만나서 너무 즐거웠다. 날씨도 좋았고 맛있는 것도 먹고, 완벽한 하루였다! 이런 날이 계속되면 좋겠다.",
        response: "정말 즐거운 하루를 보냈구나! 듣기만 해도 기분이 좋아지네. 완벽한 하루였다니 다행이야.",
        analysis: {
            mainEmotion: "기쁨",
            emotionAnalysis: "친구들과의 긍정적인 사회적 상호작용과 좋은 날씨 등 외부 환경 요인이 결합되어 높은 수준의 행복감을 느끼고 있습니다. '완벽한 하루'라는 표현에서 만족감이 크게 드러납니다.",
            suggestion: "이 행복한 감정을 기억하고 싶을 때, 오늘 가장 즐거웠던 순간을 떠올리며 3가지 감사한 점을 적어보세요.",
            riskLevel: "low",
        },
    }
];


interface DiaryContextType {
  entries: DiaryEntry[];
  addDiaryEntry: (content: string) => Promise<void>;
  isStoring: boolean;
  isLoading: boolean;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isStoring, setIsStoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('diaryEntries');
      if (storedEntries && JSON.parse(storedEntries).length > 0) {
        setEntries(JSON.parse(storedEntries));
      } else {
        setEntries(sampleEntries);
      }
    } catch (error) {
      console.error('Failed to load diary entries from localStorage', error);
      setEntries(sampleEntries);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if(!isLoading) {
        // Sort entries by date before saving
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem('diaryEntries', JSON.stringify(sortedEntries));
      }
    } catch (error) {
      console.error('Failed to save diary entries to localStorage', error);
    }
  }, [entries, isLoading]);

  const addDiaryEntry = useCallback(async (content: string) => {
    setIsStoring(true);
    try {
      const previousEntries = entries.slice(0, 3);

      const [response, analysis] = await Promise.all([
        getEmpatheticResponse(content, previousEntries),
        getEmotionAnalysis(content),
      ]);

      const newEntry: DiaryEntry = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        content,
        response,
        analysis,
      };

      setEntries(prevEntries => {
        const updatedEntries = [newEntry, ...prevEntries];
        // Keep it sorted
        return updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } catch (error) {
        console.error("Failed to add diary entry:", error);
        // Optionally re-throw or handle the error to notify the UI
        throw error;
    } finally {
        setIsStoring(false);
    }
  }, [entries]);

  return (
    <DiaryContext.Provider value={{ entries, addDiaryEntry, isStoring, isLoading }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = (): DiaryContextType => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};