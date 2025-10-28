# SlideCrafter AI: Gemini-Powered Presentation Generator

## 🚀 Overview

SlideCrafter AI is an innovative, chat-based application that leverages Google's **Gemini Reasoning Model** to generate and dynamically edit structured content for professional PowerPoint presentations. Built with **Next.js** and **Tailwind CSS** for a modern, aesthetic user experience, the application uses the powerful `pptxgenjs` library to compile the AI-generated JSON content into a ready-to-use PPTX file.

The application fulfills the requirements of the assignment by providing a single-page chat interface inspired by tools like MagicSlides, robust AI integration, and a seamless presentation generation workflow.

---

## 🌐 Live Application

The working application is deployed and available here:
**[https://ai-powered-presentation-generator.vercel.app/](https://ai-powered-presentation-generator.vercel.app/)**

---

## ✨ Features

* **AI-Powered Generation:** Uses the `gemini-2.5-pro` model to generate structured presentation content (title, bullet points) in a JSON format from a single user prompt.
* **Aesthetic UI:** Modern, responsive split-screen design using Tailwind CSS, featuring a chat history pane and a visual slide preview pane.
* **Styled PPT Output:** Generates a visually appealing PPTX file with a **custom Master Slide**, ensuring consistent branding, background, title styling, and footers.
* **Dynamic Editing:** The core requirement for editing is implemented! The application can send the **existing slide JSON** back to the AI with a new prompt (e.g., "Change the title of slide 3 to 'The Ant Army'"), allowing the Gemini model to dynamically update the presentation structure.
* **Download Functionality:** Direct download of the generated `.pptx` file via the browser.

---

## 🛠️ Tech Stack

* **Frontend:** React, Next.js (App Router)
* **Styling:** Tailwind CSS
* **AI:** Google Gemini API (`@google/genai`)
* **PPT Generation:** `pptxgenjs`

---

## ⚙️ Project Setup

### Prerequisites

* Node.js (v18+)
* npm or yarn
* A Gemini API Key (available from Google AI Studio)

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_URL]
    cd slidecrafter-ai
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env.local` in the root directory and add your Gemini API Key:
    ```
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

4.  **Run the Application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be accessible at `http://localhost:3000`.

---

## 🧑‍💻 Usage Instructions

1.  **Enter a Prompt:** In the chat input field on the left, type a topic for your presentation (e.g., "A pitch deck for a new sustainable coffee brand").
2.  **Generate Slides:** Click **Send**. The AI generates the content, and the resulting JSON is mapped and displayed as a visual preview on the right side.
3.  **Review and Edit (Dynamic Editing):** To edit the slides, enter a new prompt referencing the existing content (e.g., "On slide 2, change the second bullet point to red and make it about pricing."). The AI will update the current slides instantly.
4.  **Download PPTX:** Click the **Download PPTX** button in the preview header to generate and download the professionally styled file.

---

## 📝 Assumptions & Design Decisions

### 1. PPT Stability (Image Removal)

* **Decision:** All image generation and display logic has been **removed** from the final `slideMapper.ts` and `PptPreview.tsx`.
* **Reasoning:** This was necessary due to frequent 404/CORS errors from AI-generated image URLs during testing, ensuring the core functionality (PPT download) is **100% stable** and reliable.

### 2. Model Choice

* The API is configured to use the high-quality **`gemini-2.5-pro`** model in `route.ts` to handle complex content structuring and dynamic editing accurately.

### 3. UI Library

* All UI elements are created using **Tailwind CSS** for rapid, utility-first styling, achieving a modern, aesthetic appearance.
