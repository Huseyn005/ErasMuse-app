# ERASMuse: Your AI Life Copilot in Ruse

<!-- Badges (Optional, can be removed if not desired for 0 values) -->
[![GitHub Stars](https://img.shields.io/github/stars/Huseyn005/ErasMuse-app?style=social)](https://github.com/Huseyn005/ErasMuse-app/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Huseyn005/ErasMuse-app?style=social)](https://github.com/Huseyn005/ErasMuse-app/network/members)

ERASMuse is a comprehensive, multilingual AI assistant designed to be the ultimate companion for Erasmus students, international visitors, tourists, and locals alike in Ruse, Bulgaria. Developed as part of the RUSE AI HACK 2026, this application aims to simplify life and enhance the experience of navigating the city. From decoding documents to discovering hidden gems and connecting with others, ERASMuse is your intelligent partner in Ruse.

## Live Demo

Experience ERASMuse in action: [ErasMuse.vercel.app](https://erasmuse.vercel.app)

---
## ✨ Key Features & Benefits

### Core Features

<table style="width:100%; border-collapse: collapse;">
<tr>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 30%;">Feature</th>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 70%;">Description</th>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🤖 <strong>Multilingual AI Assistant</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Get instant answers in multiple languages tailored to your needs</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🗺️ <strong>Interactive City Explorer</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Discover events, hidden gems, and navigate with an interactive map</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🏫 <strong>Campus & Academic Support</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Access campus info, facilities, and first-week checklist</td>
</tr>
</table>

### Smart Tools

<table style="width:100%; border-collapse: collapse;">
<tr>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 30%;">Feature</th>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 70%;">Description</th>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🚌 <strong>Travel Guidance           </strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Find best routes, get tips, and plan journeys efficiently</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">📄 <strong>Document Analyzer</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Understand contracts and official papers with AI</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🚨 <strong>Emergency Contacts</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Quick access to vital emergency numbers</td>
</tr>
</table>

### Community & Experience

<table style="width:100%; border-collapse: collapse;">
<tr>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 30%;">Feature</th>
<th style="text-align: left; padding: 12px; border: 1px solid #30363d; width: 70%;">Description</th>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">👥 <strong>Find a Buddy</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Connect with students and build your community</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #30363d; width: 30%;">🌙 <strong>Dark/Light Mode</strong></td>
<td style="padding: 12px; border: 1px solid #30363d; width: 70%;">Personalized viewing experience</td>
</tr>
</table>
---

## 🚀 Technologies Used

ERASMuse is built using modern web technologies to ensure a smooth, responsive, and powerful user experience.

*   **TypeScript**: Main language
*   **Node.js**: As the TypeScript runtime environment.
*   **Vite**: For a fast development experience and optimized builds.
*   **React**: For building the user interface (implied by `package.json` dependencies and `eslint.config.js`).
*   **Shadcn UI & Radix UI**: For accessible and customizable UI components (implied by `package.json` dependencies and `components.json`).
*   **Tailwind CSS**: For utility-first styling (implied by `postcss.config.js`).

---

## 🛠️ Prerequisites & Dependencies

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: Version 18.x or higher (LTS recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager): npm comes bundled with Node.js.

---

## ⚙️ Installation & Setup

Follow these steps to get the ERASMuse application up and running on your local machine.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Huseyn005/ErasMuse-app.git
    cd ErasMuse-app
    ```

2.  **Install Dependencies**
    Using npm:
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root of the project. This file will store sensitive information like API keys and other configurations.
    ```
    # Example .env content
    VITE_SOME_API_KEY=your_api_key_here
    VITE_AI_SERVICE_URL=https://api.example.com/ai_endpoint
    ```
    *Note: Replace placeholder values with your actual API keys and configurations. A `.env.example` file is not provided, so create this file from scratch.*

4.  **Run in Development Mode**
    Start the development server:
    ```bash
    npm run dev
    ```
    
    The application will typically be accessible at `http://localhost:5173` in your web browser.

5.  **Build for Production**
    To create an optimized production build:
    ```bash
    npm run build
    ```
    The compiled and optimized assets will be generated in the `dist/` directory.

---

## 💻 Usage Examples

Once the application is running locally or accessed via the [live deployment](https://erasmuse.vercel.app), you can begin interacting with ERASMuse.

*   **Chat with the AI**: Use the main chat interface to ask questions about Ruse, get advice, or seek information in your preferred language.
*   **Explore the Map**: Navigate to the "Explore" section to view an interactive map highlighting events, points of interest, and campus facilities.
*   **Analyze Documents**: Upload official documents or contracts to the "Document Analyzer" to get summaries and explanations of key terms.
*   **Find a Buddy**: Connect with other Erasmus students or international visitors through the networking feature to build your community.

---

## 🔧 Configuration Options

ERASMuse offers several configuration points to tailor the application to specific needs or development environments:

*   **`.env` file**: Customize API endpoints, keys, and other environment-specific variables.
*   **`postcss.config.js`**: Configure PostCSS plugins like Tailwind CSS and Autoprefixer.
*   **`eslint.config.js`**: Define and enforce code quality rules for JavaScript and TypeScript files.
*   **`components.json`**: Configuration for Shadcn UI components, including base styles and paths.
*   **`package.json`**: Manage project dependencies, scripts, and basic project metadata.

---

## 📄 License Information

This project is currently **unlicensed**.
--
