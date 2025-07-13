# Gemini Chatbot

A beautiful, modern chatbot powered by Google Gemini AI built with Next.js.

## Features

- 🤖 Powered by Google Gemini AI
- 💬 Real-time chat interface
- 🎨 Beautiful, modern UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🔄 Conversation history support
- 🔒 Secure API key management

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and add your API key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and replace `your_gemini_api_key_here` with your actual API key.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Security

- ✅ API key is stored in `.env.local` (not committed to git)
- ✅ Environment variables are properly validated
- ✅ Error handling for missing API keys
- ✅ Secure request handling

## Usage

- Type your message in the input field
- Press Enter or click the send button
- The chatbot will respond using Gemini AI
- Your conversation history is maintained during the session

## Technologies Used

- **Next.js 15** - React framework
- **Google Gemini AI** - AI model
- **Tailwind CSS** - Styling
- **JavaScript** - Programming language

## API Endpoints

- `POST /api/chat` - Handles chat requests with Gemini AI

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)

## License

MIT
