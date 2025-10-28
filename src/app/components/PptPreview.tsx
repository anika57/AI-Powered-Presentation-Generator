// src/components/PptPreview.tsx (UPDATED: Images Removed from Preview)
"use client";
import React from "react";
import pptxgen from "pptxgenjs";
import { mapSlidesFromJson } from "@/utils/slideMapper"; 

interface Slide {
    title: string;
    content: string[];
    // image_url is no longer used for display
}

export default function PptPreview({ slideData }: { slideData: Slide[] | null }) { 
    
    // imageError state is no longer needed

    const handleGeneratePPT = () => {
        if (!slideData) return alert("No slide data yet!");
        
        const pres = new pptxgen();
        mapSlidesFromJson(pres, { slides: slideData }); 
        pres.writeFile({ fileName: "AI_Presentation.pptx" });
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full h-full flex flex-col">
            <header className="p-4 border-b border-blue-100 bg-white rounded-t-2xl text-xl font-bold text-blue-700 flex justify-between items-center">
                <span>Presentation Preview ({slideData ? slideData.length : 0} Slides)</span>
                {slideData && (
                    <button
                        onClick={handleGeneratePPT}
                        className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition shadow-md"
                    >
                        Download PPTX
                    </button>
                )}
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                {slideData && slideData.length > 0 ? (
                    slideData.map((slide, index) => (
                        <div 
                            key={index} 
                            // ... (keep card styling) ...
                            className="p-6 bg-white rounded-xl shadow-lg border border-blue-50 transform hover:scale-[1.01] transition duration-200 ease-in-out"
                        >
                            <div className="text-xs font-mono text-blue-400 mb-3">Slide {index + 1} / {slideData.length}</div>
                            
                            {/* Slide Content Area - Now uses full width (w-full) */}
                            <div className="flex flex-col space-y-4"> 
                                
                                {/* Content (Points) */}
                                <div className="w-full">
                                    <h3 className="text-2xl font-extrabold mb-4 text-gray-900 border-b pb-2 border-blue-100">{slide.title}</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                                        {slide.content.map((point, i) => (
                                            <li key={i} className="text-sm">
                                                {/* Simple logic to bold text enclosed in **...** */}
                                                {point.split(/(\*\*.*?\*\*)/g).map((part, pIndex) => 
                                                    part.startsWith('**') && part.endsWith('**')
                                                        ? <strong key={pIndex}>{part.slice(2, -2)}</strong>
                                                        : <span key={pIndex}>{part}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* IMAGE PREVIEW LOGIC IS REMOVED */}
                            </div>
                        </div>
                    ))
                ) : (
                    // ... (keep empty state styling) ...
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-white rounded-xl p-8 shadow-inner border border-gray-200">
                        <svg className="w-16 h-16 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v14m-12 3h12a2 2 0 002-2v-11a2 2 0 00-2-2H9a2 2 0 00-2 2v11a2 2 0 002 2zm0 0v-4"></path></svg>
                        <p className="text-xl font-semibold text-gray-700">Ready to Create Magic?</p>
                        <p className="text-sm mt-1">Your stunning presentation slides will appear here after generation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}