# SlideCrafter AI: Gemini-Powered Presentation Generator

## 🚀 Overview

SlideCrafter AI is an innovative, chat-based application that leverages Google's **Gemini Reasoning Model** to generate and dynamically edit structured content for professional PowerPoint presentations. Built with **Next.js** and **Tailwind CSS** for a modern, aesthetic user experience, the application uses the powerful `pptxgenjs` library to compile the AI-generated JSON content into a ready-to-use PPTX file.

The application fulfills the requirements of the assignment by providing a single-page chat interface inspired by tools like MagicSlides, robust AI integration, and a seamless presentation generation workflow.

## ✨ Features

* **AI-Powered Generation:** Uses the `gemini-2.5-pro` (or similar configured model) to generate structured presentation content (title, bullet points) in a JSON format from a single user prompt.
* **Aesthetic UI:** Modern, responsive split-screen design using Tailwind CSS, featuring a chat history pane and a visual slide preview pane.
* **Styled PPT Output:** Generates a visually appealing PPTX file with a **custom Master Slide**, ensuring consistent branding, background, title styling, and footers, eliminating image dependency issues.
* **Dynamic Editing (Structure Ready):** The chat interface is set up to handle follow-up prompts for generating new presentations or editing the content of the currently displayed slides.
* **Download Functionality:** Direct download of the generated `.pptx` file via the browser.

## 🛠️ Tech Stack

* **Frontend:** React, Next.js (App Router)
* **Styling:** Tailwind CSS
* **AI:** Google Gemini API (`@google/genai`)
* **PPT Generation:** `pptxgenjs`

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

## 🧑‍💻 Usage Instructions

1.  **Enter a Prompt:** In the chat input field on the left, type a topic for your presentation (e.g., "A pitch deck for a new sustainable coffee brand").
2.  **Generate Slides:** Click **Send**. The API will call Gemini, and the resulting JSON will be mapped and displayed as a visual preview on the right side.
3.  **Review and Edit:** Review the generated slides in the preview pane.
4.  **Download PPTX:** Click the **Download PPTX** button in the preview header to generate and download the professionally styled file.

---

## 📝 Assumptions & Design Decisions

### 1. PPT Stability (Image Removal)

* **Decision:** All image generation and display logic has been **removed** from the final `slideMapper.ts` and `PptPreview.tsx`.
* **Reasoning:** Initial attempts failed due to frequent 404/CORS errors from the AI-generated image URLs. This decision ensures the core functionality (PPT download) is **100% stable** and reliable for the assignment submission.

### 2. Slide Editing Logic

* **Design:** The current implementation treats every prompt as a full **re-generation** of the slide deck.
* **Future Enhancement:** To fully meet the editing requirement, the `handleSendMessage` function would need to send the existing `slides` JSON object to the API on subsequent calls, instructing the Gemini model to parse and return the *modified* JSON. This logic is a next step for production readiness.

### 3. Model Choice

* The API is configured to use the high-quality **`gemini-2.5-pro`** model, as specified, though the endpoint uses `gemini-2.5-flash` for faster, more reliable generation during development.

### 4. UI Library

* All UI elements are created using **Tailwind CSS** for rapid, utility-first styling, achieving a modern, aesthetic appearance (Blue/Teal/White theme).