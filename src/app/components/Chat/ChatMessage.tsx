// src/components/ChatMessage.tsx (Updated UI/Aesthetics)
import React from 'react';

interface ChatMessageProps {
    role: 'user' | 'ai';
    content: string;
    isError?: boolean;
}

export default function ChatMessage({ role, content, isError = false }: ChatMessageProps) {
    const isUser = role === 'user';
    
    let containerClasses = isUser 
        ? "flex justify-end" 
        : "flex justify-start";
        
    let bubbleClasses = isUser
        ? "bg-blue-600 text-white rounded-t-xl rounded-bl-xl shadow-lg" // Darker blue, strong shadow
        : isError
            ? "bg-red-50 text-red-700 rounded-xl shadow-md border border-red-200"
            : "bg-white text-gray-800 rounded-t-xl rounded-br-xl shadow-md border border-gray-100"; // Clean white/gray

    return (
        <div className={containerClasses}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 text-sm transition-all ${bubbleClasses}`}>
                {isError ? <strong>[System Error]: </strong> : null}
                {/* Simple Markdown bolding for response text */}
                {content.split(/(\*\*.*?\*\*)/g).map((part, pIndex) => 
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={pIndex}>{part.slice(2, -2)}</strong>
                        : <span key={pIndex}>{part}</span>
                )}
            </div>
        </div>
    );
}