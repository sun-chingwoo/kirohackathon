import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.post('/analyze', async (req, res) => {
  const { log } = req.body;

  if (!log || typeof log !== 'string') {
    return res.status(400).json({ error: 'Invalid log input' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    
    const systemPrompt = 'Analyze the log. Return ONLY this JSON, no explanation:\n\n{"failure":"","affected_component":"","evidence":"","suggested_fix":""}\n\nevidence = exact quoted line from input. If none found, return\n\n{"failure":"none detected","affected_component":null,"evidence":null,"suggested_fix":null}';

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt + '\n\n' + log }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 200
      }
    });

    const responseText = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse LLM response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});   

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Failure Analyzer running on http://localhost:${PORT}`);
});
