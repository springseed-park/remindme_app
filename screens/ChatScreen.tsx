
import React, { useState, useRef, useEffect, useCallback } from 'react';
import OpenAI from 'openai';
import type { ChatMessage } from '../types';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const openaiRef = useRef<OpenAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<Array<{role: 'system' | 'user' | 'assistant', content: string}>>([]);

  useEffect(() => {
    const initChat = async () => {
      try {
        openaiRef.current = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY!,
          dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
        });

        const systemMessage = {
          role: 'system' as const,
          content: `당신은 '마음이'라는 이름을 가진, 따뜻하고 공감 능력이 뛰어난 친구입니다. 사용자와 실시간으로 대화하며, 그들의 이야기에 귀 기울여 주세요. 판단하거나 해결책을 제시하기보다는, 친구처럼 편안하게 대화를 이어나가며 정서적 지지를 보내는 데 집중하세요. 항상 한국어로, 다정하고 친근한 말투를 사용해주세요.`
        };
        chatHistoryRef.current = [systemMessage];

        setMessages([
          { id: 'initial', sender: 'ai', text: '안녕! 무슨 이야기든 들을 준비가 됐어. 편하게 말해줘.' }
        ]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([
          { id: 'error', sender: 'ai', text: '미안, 지금은 대화하기가 좀 힘드네. 잠시 후에 다시 찾아와 줄래?' }
        ]);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !openaiRef.current) return;

    const currentInput = input;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentInput,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add user message to chat history
    chatHistoryRef.current.push({
      role: 'user',
      content: currentInput
    });

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '...' }]);

    try {
      const stream = await openaiRef.current.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatHistoryRef.current,
        stream: true,
        temperature: 0.8,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, text: fullResponse + '...' } : msg
            )
          );
        }
      }

      // Remove typing indicator
      setMessages(prev =>
        prev.map(msg => (msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg))
      );

      // Add assistant response to chat history
      chatHistoryRef.current.push({
        role: 'assistant',
        content: fullResponse
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: '앗, 미안. 대답을 생각하다가 깜빡했나 봐. 다시 한번 말해줄래?' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
       <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10">
         <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-xs p-3 text-center">
            <strong>주의:</strong> 이 대화는 AI와의 대화이며, 전문적인 심리 상담을 대체할 수 없습니다. 위기 상황 시에는 전문가의 도움을 받으세요. (자살예방 상담전화 1393)
        </div>
        <div className="p-3 border-b border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-gray-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            이 대화는 앱을 닫으면 사라져요.
            </div>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="마음이에게 말을 걸어보세요..."
            className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
