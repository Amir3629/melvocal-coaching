'use client';
import { useChat } from 'ai/react';

export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black/80 p-4 rounded-lg border border-[#C8A97E] z-50">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <span className="font-bold text-[#C8A97E]">
              {m.role === 'user' ? 'You: ' : 'AI: '}
            </span>
            <span className="text-white">{m.content}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about vocal techniques..."
          className="flex-1 bg-[#1A1A1A] text-white px-3 py-2 rounded border border-[#333]"
        />
        <button 
          type="submit" 
          className="bg-[#C8A97E] text-black px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}