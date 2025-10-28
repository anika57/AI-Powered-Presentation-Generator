import React from 'react';

interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onSend: (prompt: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ prompt, setPrompt, onSend, isLoading }: ChatInputProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(prompt);
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your presentation topic or edit request here..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition duration-150 text-gray-900"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-150 transform hover:scale-[1.02]"
                disabled={isLoading || !prompt.trim()}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
        </form>
    );
}