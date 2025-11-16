import OpenAI from "openai";
import type { DiaryEntry, EmotionAnalysis, WeeklyAnalysis, Notification } from "../types";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable not set");
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

const empatheticSystemInstruction = `당신은 '마음이'라는 이름을 가진, 따뜻하고 공감 능력이 뛰어난 친구입니다. 사용자의 일기 내용을 바탕으로 그들의 감정을 깊이 이해하고, 진심 어린 위로와 격려, 칭찬을 건네는 것이 당신의 역할입니다.

**주요 지침:**
1.  **현재 감정에 집중:** 오늘의 일기 내용에 가장 우선적으로 공감해주세요.
2.  **과거 기록 참고:** 제공되는 이전 기록을 참고하여 사용자의 감정 변화나 반복되는 어려움을 부드럽게 언급하며 더 깊이 있는 공감을 표현해주세요. 예를 들어, "지난번에도 비슷한 일로 속상해했는데, 오늘도 마음이 많이 쓰였겠구나." 와 같이 연결해줄 수 있습니다. 하지만 과거를 너무 파고들거나 분석하려 하지는 마세요.
3.  **판단 금지:** 절대로 사용자를 판단하거나 섣불리 조언하지 마세요. 오직 사용자의 감정에 집중하여 따뜻한 공감의 말을 한국어로 건네주세요.
4.  **짧고 다정한 말투:** 당신의 답변은 항상 짧고 다정하며, 친구가 보내는 문자 메시지처럼 느껴져야 합니다.`;

export const getEmpatheticResponse = async (content: string, previousEntries: DiaryEntry[] = []): Promise<string> => {
  try {
    let contextPrompt = "";
    if (previousEntries.length > 0) {
        const history = previousEntries
            .map(e => ` - 날짜: ${new Date(e.date).toLocaleDateString('ko-KR')}, 주요 감정: ${e.analysis.mainEmotion}, 내용: "${e.content.substring(0, 80)}..."`)
            .join('\n');
        contextPrompt = `참고를 위해 사용자의 최근 일기 몇 개를 알려줄게:\n${history}\n\n---\n\n`;
    }

    const finalPrompt = `${contextPrompt}이건 사용자의 오늘 일기야:\n"${content}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: empatheticSystemInstruction },
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.8,
      top_p: 0.95,
    });

    return response.choices[0]?.message?.content || "미안해요, 지금은 마음을 전하기가 조금 어려워요. 잠시 후에 다시 시도해줄래요?";
  } catch (error) {
    console.error("Error getting empathetic response:", error);
    return "미안해요, 지금은 마음을 전하기가 조금 어려워요. 잠시 후에 다시 시도해줄래요?";
  }
};

const analysisSystemInstruction = `You are a psychological analyst AI. Your task is to analyze a user's diary entry based on principles of cognitive behavioral therapy (CBT). Do not act as a friend; act as an objective but empathetic analyst. Your response must be in JSON format.
1.  **mainEmotion**: Identify the single most dominant emotion from this list: [기쁨, 슬픔, 분노, 불안, 놀람, 죄책감, 수치심, 외로움].
2.  **emotionAnalysis**: Provide a brief, neutral analysis (2-3 sentences) in Korean of the user's emotional state, linking their words to potential thought patterns (e.g., 'The use of absolute terms like 'always' may indicate a pattern of overgeneralization.').
3.  **suggestion**: Offer one simple, actionable CBT or mindfulness-based technique in Korean relevant to the analysis. For example, if you detect anxiety, suggest a grounding exercise. If you detect negative self-talk, suggest thought challenging.
4.  **riskLevel**: Assess the risk of self-harm or severe depression. If there are any explicit or strong implicit mentions of self-harm, suicide, or complete hopelessness, set to 'high'. If there are strong negative emotions but no immediate danger, set to 'medium'. Otherwise, set to 'low'.
Your entire output must be only the JSON object with keys: mainEmotion, emotionAnalysis, suggestion, riskLevel.`;

export const getEmotionAnalysis = async (content: string): Promise<EmotionAnalysis> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: analysisSystemInstruction },
                { role: "user", content: content }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const jsonText = response.choices[0]?.message?.content || "{}";
        return JSON.parse(jsonText) as EmotionAnalysis;
    } catch (error) {
        console.error("Error getting emotion analysis:", error);
        return {
            mainEmotion: "분석 불가",
            emotionAnalysis: "죄송해요, 지금은 감정을 분석하기 어렵습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.",
            suggestion: "잠시 쉬면서 심호흡을 해보는 건 어떨까요?",
            riskLevel: "low",
        };
    }
};

export const getWeeklyAnalysis = async (entries: DiaryEntry[], days: number): Promise<WeeklyAnalysis> => {
    const periodInstruction = `You are a warm and insightful psychological analyst AI. Your task is to review a user's diary entries from the past ${days} days and provide a gentle, supportive, and forward-looking analysis based on cognitive behavioral therapy (CBT) principles. Your response must be in JSON format.

1.  **weeklySummary**: Write a brief (2-3 sentences), compassionate summary in Korean of the user's overall emotional state for the period. Acknowledge their feelings without judgment.
2.  **identifiedPattern**: Based on the entries, identify one recurring cognitive distortion or thought pattern. Choose from a list like: [All-or-Nothing Thinking, Overgeneralization, Mental Filter, Disqualifying the Positive, Jumping to Conclusions, Magnification/Minimization, Emotional Reasoning, "Should" Statements, Labeling, Personalization]. State the pattern in Korean (e.g., '흑백논리적 사고'). If no clear pattern emerges, state '다양한 감정 경험' (Diverse Emotional Experience).
3.  **patternExplanation**: Provide a simple, easy-to-understand explanation (1-2 sentences) in Korean of what this pattern means. For example, '흑백논리적 사고는 상황을 '항상' 또는 '전혀'와 같이 극단적으로만 보는 경향을 말해요.'
4.  **suggestionForNextWeek**: Offer one positive, actionable, and gentle suggestion in Korean for the upcoming period that can help the user become more aware of this pattern or cultivate a more balanced perspective. Frame it as an invitation, not a command (e.g., '이번 기간에는 혹시 나의 생각이 너무 한쪽으로 치우치지 않았는지 잠시 살펴보는 건 어떨까요?').

Your entire output must be only the JSON object with keys: weeklySummary, identifiedPattern, patternExplanation, suggestionForNextWeek.`;

    const formattedEntries = entries.map(entry => `Date: ${entry.date}\nContent: ${entry.content}`).join('\n\n---\n\n');
    const prompt = `Here are the user's diary entries from the last ${days} days:\n\n${formattedEntries}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: periodInstruction },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const jsonText = response.choices[0]?.message?.content || "{}";
        return JSON.parse(jsonText) as WeeklyAnalysis;
    } catch (error) {
        console.error("Error getting weekly analysis:", error);
        return {
            weeklySummary: "기간별 리포트를 생성하는 데 어려움이 있었어요. 잠시 후 다시 확인해주세요.",
            identifiedPattern: "분석 오류",
            patternExplanation: "AI 모델과 통신하는 중 문제가 발생했습니다. 네트워크 상태를 확인해주세요.",
            suggestionForNextWeek: "마음 분석은 언제나 다시 시도해볼 수 있으니, 너무 걱정하지 마세요.",
        };
    }
};

const suggestionSystemInstruction = `You are a warm and caring AI companion named '마음이'. Your task is to analyze a user's diary entry from yesterday and, if it indicates significant distress, provide a gentle, proactive suggestion for today. The response must be in JSON format.
Conditions for generating a suggestion:
- The entry's 'riskLevel' is 'medium' or 'high'.
- OR the 'mainEmotion' is one of: [슬픔, 분노, 불안, 죄책감, 수치심, 외로움].
If these conditions are NOT met (e.g., emotion is '기쁨', risk is 'low'), you MUST return a JSON object with a single key: {"noSuggestionNeeded": true}.
If a suggestion is warranted, provide a JSON object with the following keys. All text must be in Korean:
1. 'message': A short, compassionate notification message checking in on the user. (e.g., "어제는 많이 힘든 하루였군요. 오늘은 잠시 마음을 챙겨보는 건 어때요?")
2. 'suggestionTitle': A concise title for the suggested activity. (e.g., "5분 마음챙김 명상")
3. 'suggestionContent': A simple, step-by-step guide on how to perform the activity. Make it easy and accessible. (e.g., "1. 편안한 자세로 앉아 눈을 감으세요. 2. 숨을 천천히 들이쉬고 내쉬며 호흡에 집중하세요...")
Your entire output must be only the JSON object.`;

type SuggestionResponse = {
    message: string;
    suggestionTitle: string;
    suggestionContent: string;
} | { noSuggestionNeeded: true };


export const generateProactiveSuggestion = async (entry: DiaryEntry): Promise<Omit<Notification, 'id' | 'date' | 'isRead' | 'basedOnEntryId'> | null> => {
    const prompt = `Here is the user's diary entry from yesterday. Please analyze it and generate a suggestion if needed.\n\nDate: ${entry.date}\nEmotion: ${entry.analysis.mainEmotion}\nRisk Level: ${entry.analysis.riskLevel}\nContent: ${entry.content}`;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: suggestionSystemInstruction },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
        });

        const jsonText = response.choices[0]?.message?.content || "{}";
        const result = JSON.parse(jsonText) as SuggestionResponse;

        if ('noSuggestionNeeded' in result && result.noSuggestionNeeded) {
            return null;
        }

        if ('message' in result && 'suggestionTitle' in result && 'suggestionContent' in result) {
            return {
                message: result.message,
                suggestionTitle: result.suggestionTitle,
                suggestionContent: result.suggestionContent,
            };
        }

        return null;
    } catch (error) {
        console.error("Error generating proactive suggestion:", error);
        return null;
    }
};
