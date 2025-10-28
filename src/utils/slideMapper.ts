import pptxgen from "pptxgenjs";

// Define spacing constants
const MAIN_TITLE_HEIGHT = 0.5;
const FONT_SIZE = 16;
const LINE_HEIGHT_INCHES = 0.35; 
const CONTENT_START_X = 0.8; 
const CONTENT_WIDTH = 5.0; 

// --- Utility function to handle Markdown bolding ---
function parseFormattedText(text: string): any[] {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(p => p.length > 0);
    const textObjects: any[] = [];

    parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
            textObjects.push({ 
                text: part.substring(2, part.length - 2), 
                options: { bold: true } 
            });
        } else {
            textObjects.push({ 
                text: part, 
                options: {} 
            });
        }
    });
    return textObjects;
}

export function mapSlidesFromJson(pres: pptxgen, data: any) {
  if (!data?.slides || !Array.isArray(data.slides)) {
    return;
  }
  
  data.slides.forEach((slideData: any, i: number) => { 
    const slide = pres.addSlide();
    let currentY = 0.5; 

    // 1. Add Main Slide Title
    slide.addText(slideData.title, { 
      x: 0.5, y: currentY, 
      fontSize: 28, bold: true, 
      w: 9, h: MAIN_TITLE_HEIGHT 
    });
    currentY += MAIN_TITLE_HEIGHT + 0.3; 

    // 2. Iterate over the content array
    if (Array.isArray(slideData.content)) {
        slideData.content.forEach((point: string) => { 
            
            const charCount = point.length;
            const estimatedLines = Math.max(1, Math.ceil(charCount / 65)); 
            const requiredHeight = estimatedLines * LINE_HEIGHT_INCHES; 

            const textObjects = parseFormattedText(point);

            slide.addText(textObjects, { 
                x: CONTENT_START_X, 
                y: currentY, 
                fontSize: FONT_SIZE, 
                w: CONTENT_WIDTH, 
                h: requiredHeight,
                bullet: true 
            });
            
            currentY += requiredHeight + 0.1; 
        });
    }

    // 3. IMPLEMENTATION OF IMAGE RENDERING LOGIC WITH HARDCODED TEST
    let imageUrl = slideData.image_url;

    if (i === 0) { 
        imageUrl = "https://images.unsplash.com/photo-1518779576417-8e68e71c9987?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 
    }
    
    if (imageUrl && imageUrl.startsWith('http')) {
        slide.addImage({
            path: imageUrl,
            x: 6.0,   
            y: 1.5,   
            w: 3.5,   
            h: 5.0,   
            sizing: { type: 'contain', w: 3.5, h: 5.0 } 
        });
    }
  });
}