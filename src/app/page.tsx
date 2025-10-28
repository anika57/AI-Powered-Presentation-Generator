// src/app/page.tsx
"use client";
import React, { useState } from 'react';
import ChatInput from '../app/components/Chat/ChatInput'; // Assuming you create this component
import PptPreview from '../app/components/PptPreview'; // Assuming this is moved to components
import ChatMessage from '../app/components/Chat/ChatMessage'; // Assuming you create this component

interface Slide {
    title: string;
    content: string[];
    image_url: string; // Kept in interface to match AI's output schema
}

interface ChatHistoryItem {
    role: 'user' | 'ai';
    content: string;
}

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [slides, setSlides] = useState<Slide[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSendMessage = async (inputPrompt: string) => {
        if (!inputPrompt.trim()) return;

        setIsLoading(true);
        setError(null);
        
        const isEditing = slides !== null && slides.length > 0;
        
        // 1. Add user prompt to history
        setChatHistory(prev => [...prev, { role: 'user', content: inputPrompt }]);

        // 2. Add temporary AI message
        const aiMessage = isEditing 
            ? "Applying your edits to the presentation..." 
            : "Generating and structuring your presentation...";
        setChatHistory(prev => [...prev, { role: 'ai', content: aiMessage }]);
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: inputPrompt,
                    currentSlides: isEditing ? slides : null // <-- CORE EDITING LOGIC
                }),
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `API responded with status ${response.status}.`);
                } catch (e) {
                    throw new Error(`Server returned a ${response.status} (Service Unavailable). Please try again.`);
                }
            }

            const data = await response.json();
            const generatedSlides: Slide[] = data.slides;

            if (generatedSlides && Array.isArray(generatedSlides)) {
                setSlides(generatedSlides);
                
                // Success message
                const successMsg = isEditing 
                    ? `Edits applied successfully. Presentation now has **${generatedSlides.length} slides.**`
                    : `Presentation generated successfully with **${generatedSlides.length} slides.**`;

                // Update the temporary AI message
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastAiIndex = newHistory.findLastIndex(msg => msg.role === 'ai');
                    if (lastAiIndex !== -1) {
                        newHistory[lastAiIndex] = { role: 'ai', content: successMsg };
                    }
                    return newHistory;
                });
            } else {
                throw new Error("AI did not return a valid slides array.");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            
            // Update the temporary AI message with error
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastAiIndex = newHistory.findLastIndex(msg => msg.role === 'ai');
                if (lastAiIndex !== -1) {
                    newHistory[lastAiIndex] = { role: 'ai', content: `[ERROR] ${err.message}` };
                }
                return newHistory;
            });

        } finally {
            setIsLoading(false);
            setPrompt('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 antialiased">
            
            {/* Left Column: Chat Interface */}
            <div className="w-full md:w-2/5 flex flex-col bg-white shadow-2xl z-10 border-r border-blue-50">
                <header className="p-5 border-b border-blue-100 bg-white text-2xl font-extrabold text-blue-700 shadow-sm">
                    ✨ **SlideCrafter AI**
                </header>
                
                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {chatHistory.length === 0 && (
                        <p className="text-gray-500 text-center mt-12 p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                            **Start here!** Enter a topic to generate your first presentation. <br/> (e.g., "A modern pitch deck for a carbon-neutral energy solution")
                        </p>
                    )}
                    {chatHistory.map((msg, index) => (
                        <ChatMessage key={index} role={msg.role} content={msg.content} />
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-blue-100 bg-white">
                    <ChatInput 
                        prompt={prompt} 
                        setPrompt={setPrompt} 
                        onSend={handleSendMessage} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>

            {/* Right Column: PPT Preview */}
            <div className="hidden md:flex w-3/5 p-6 bg-blue-50 justify-center items-stretch">
                <PptPreview 
                    slideData={slides} 
                />
            </div>
        </div>
    );
}