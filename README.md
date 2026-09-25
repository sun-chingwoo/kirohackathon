# Log Failure Analyzer

A minimal MVP log analyzer that diagnoses failures instantly using AI. Paste raw logs, get structured analysis in seconds.

## Features

- **Instant Analysis**: Single LLM call with temperature=0, max_tokens=200 for minimal latency
- **Structured Output**: Returns JSON with failure, component, evidence, and suggested fix
- **Free Tier Model**: Uses Gemini 3.5 Flash Lite for cost-effective API calls
- **Neobrutalist UI**: Bold, high-contrast interface with color-coded results
- **Zero History**: No database, no auth, no persistence—pure stateless analysis

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (neobrutalism design)
- **Backend**: Node.js + Express
- **LLM**: Google Gemini 3.5 Flash Lite
- **Config**: dotenv for environment variables

## Setup

### Prerequisites
- Node.js 16+
- Gemini API key (free tier)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd log-failure-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`
```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

Get your free API key at: https://ai.google.dev

### Run

```bash
npm start
```

Server runs on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Paste raw log text (stack traces, error logs, warnings, etc.)
3. Click "Analyze Now"
4. View structured results:
   - **Failure** (red): What broke
   - **Component** (orange): Which system
   - **Evidence** (green): Exact quoted line from log
   - **Fix** (blue): Suggested resolution

## Example Log

```
[2024-09-25 15:47:32.123] ERROR - Authentication Service
Failed to validate JWT token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
javax.crypto.BadPaddingException: Given final block not properly padded
	at com.sun.crypto.provider.CipherCore.doFinal(CipherCore.java:1076)
	at com.sun.crypto.provider.AESCipher.engineDoFinal(AESCipher.java:338)
Connection refused to 10.45.23.189:6379
Failed to write session: no more retries
User request rejected: unauthorized access attempt from IP 192.168.1.105
```

Expected output:
- **Failure**: JWT validation failure + Redis connection issue
- **Component**: Authentication Service / Session Storage
- **Evidence**: `javax.crypto.BadPaddingException: Given final block not properly padded`
- **Fix**: Verify JWT secret key is correct / Check Redis server status

## Architecture

### Frontend
- Single textarea for log input
- Instant feedback with loading state
- Color-coded result display
- Responsive, mobile-friendly layout

### Backend
- `/analyze` endpoint (POST)
- Receives raw log text
- Sends to Gemini with fixed system prompt
- Extracts JSON from LLM response
- Returns structured analysis

### LLM Configuration
- **Model**: gemini-3.5-flash-lite

## Development

Built in 30 minutes using Kiro specs workflow for rapid MVP development.

### Project Structure
```
.
├── index.html          # Frontend (neobrutalism UI)
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env                # API key (not committed)
├── .env.example        # Template for .env
├── .gitignore          # Prevent .env from git
```

