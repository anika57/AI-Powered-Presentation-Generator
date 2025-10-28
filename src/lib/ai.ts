export async function generateSlides(prompt: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Gemini API key");
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create structured JSON for PowerPoint slides on: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "✅ yes" : "❌ no");

    if (!res.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Gemini API request failed");
    }

    // ✅ Extract AI output text safely
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      slides: [
        { title: "Slide 1", bullets: ["Point 1", "Point 2"] },
        { title: "Slide 2", bullets: ["Point A", "Point B"] },
      ],
      text: aiText || `Generated slides for: ${prompt}`,
    };
  } catch (err) {
    console.error("Error in generateSlides:", err);
    throw err;
  }
}
