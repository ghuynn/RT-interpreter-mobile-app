# Real-Time Interpreter (Expo)

Prototype app to record speech, transcribe with OpenAI Whisper API, and translate text using GPT-4o mini.

## Quick start

1. Install dependencies:
   ```bash
   npm i
   ```
2. Create a file named `.env` in project root and add:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...  # your key (do not share)
   ```
3. Run the app:
   ```bash
   npx expo start
   ```

## Security
- Keys with `EXPO_PUBLIC_` are bundled in the app; use only for prototypes. For production, proxy via your backend.


## Chạy app

- Mở file .env điền IPv4 Wifi port 3000
- Mở terminal cd backend, npm run dev
- Mở terminal mới npx expo start --clear
