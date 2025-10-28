// ChatWindow.tsx (Final Correction)

"use client";
import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";

// Define the shape of the data that the parent component will handle
interface SlideData {
  slides: any[];
  text: string;
}

// 👈 Component now accepts a prop
export default function ChatWindow({ onSlidesGenerated }: { onSlidesGenerated: (slides: any[]) => void }) {
  const [messages, setMessages] = useState<{ role: string; content: string; time: string }[]>([]);
  const [input, setInput] = useState("");

  const generateMutation = useMutation<SlideData, Error, string>({
    mutationFn: async (prompt: string) => {
      const res = await axios.post("/api/generate", { prompt });
      return res.data;
    },
    onSuccess: (data) => {
      // ✅ FIX: Show a friendly message instead of the raw JSON
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Presentation slides generated successfully!", time: dayjs().format("HH:mm") },
      ]);
      
      // ✅ FIX: Use the prop to pass the structured slides array up to the parent
      if (data.slides && Array.isArray(data.slides)) {
        onSlidesGenerated(data.slides); 
      }
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error generating slides: ${error.message}`, time: dayjs().format("HH:mm") },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input, time: dayjs().format("HH:mm") };
    setMessages((prev) => [...prev, newMsg]);
    generateMutation.mutate(input);
    setInput("");
  };

  return (
    // ... (rest of the return structure is the same)
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl ${
              msg.role === "user" ? "bg-blue-100 self-end text-right" : "bg-gray-100"
            }`}
          >
            <p className="text-sm text-gray-800">{msg.content}</p>
            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your presentation..."
          className="flex-1 border rounded-xl p-2"
          disabled={generateMutation.isPending}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? "Generating..." : "Send"}
        </button>
      </div>
    </div>
  );
}