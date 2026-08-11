import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = 3000;

// Local TARS Hinglish Roasting Dictionary for Offline Fallback
const TARS_OFFLINE_ROASTS: Record<string, { roast: string; hint: string }> = {
  SyntaxError: {
    roast: "Bhai, tune colon (:) ya bracket lagana bhul gaya hai. Python tera aisi harkatein dekh kar soch raha hoga ki isko admission kisne diya. Ja line theek kar chupchap.",
    hint: "Code mein Syntax check kar! Bracket '(' ')' close karo, ya function/if/for/while line ke end mein colon (:) lagana mat bhoolo.",
  },
  NameError: {
    roast: "Bhai, tu jis variable ko bula raha hai, uska wajood hi nahi hai. Jaise ghost ko dhundh raha ho. Pehle variable declare kar, phir hero banna.",
    hint: "Variable pehle define (assign) karo, e.g. x = 10, uske baad hi print ya use karo! Variable name ki spelling re-check kar le.",
  },
  IndentationError: {
    roast: "Bhai, indentation ki aisi-taisi kar rakhi hai tune. Python space/tab ke chakkar mein chakkar kha ke gir gaya hai. Thoda formatting theek kar le.",
    hint: "Python code blocks space-sensitive hote hain. Function, if, else, ya loop ke andar ki lines ko 4 spaces (Tab) aage shift karo.",
  },
  ZeroDivisionError: {
    roast: "Bhai, mathematical paap kar diya tune! Kisi number ko 0 se divide kar raha hai. Universe collapse karane ka iraada hai kya? Code sudhar apna.",
    hint: "0 se division invalid hai! Divide karne se pehle denominator check kar lo: e.g. if b != 0: result = a / b else print('Cannot divide by zero').",
  },
  TypeError: {
    roast: "Bhai, string aur integer ko aapas mein jodh raha hai jaise paani aur aag mila raha ho. Types match kar, warna TARS mode off karke khud thappad maar dunga.",
    hint: "Data types convert karo! String ke saath number join karne ke liye str(number) convert karo, ya f-string use karo: print(f'Result: {num}').",
  },
  IndexError: {
    roast: "Bhai, list ka size chhota hai aur tu out of bounds ja raha hai. Hawa mein se elements thodi nikal lega Python!",
    hint: "Python lists 0-indexed hoti hain. Pehla item index 0 par hota hai. len(my_list) check kar aur index valid range mein rakho.",
  },
  ValueError: {
    roast: "Bhai, value hi galat de di tune! String ko integer mein convert karne ki koshish kar raha hai bina number ke.",
    hint: "Value conversion check karo! e.g. int('hello') crash hoga kyunki 'hello' mein numbers nahi hain. Valid digit string pass karo.",
  },
  KeyError: {
    roast: "Bhai, dictionary mein ye key exist hi nahi karti! Khawaab mein se key thodi nikalega Python?",
    hint: "Dictionary mein key check karo 'if key in my_dict:' ya safe access ke liye 'my_dict.get(key, default_value)' use karo.",
  },
  AttributeError: {
    roast: "Bhai, galat function/method bula raha hai is object par! Car par fly() call karega to accident hi hoga na!",
    hint: "Attribute ya method name ki spelling check karo. Double check karo ki us data object par wo function available hai ya nahi.",
  },
};

// Multi-API Key Load Balancer State
let currentKeyIndex = 0;
let totalRequestsHandled = 0;

function getApiKeysPool(customKeys?: string[]): string[] {
  const pool: string[] = [];

  const addKey = (k?: string) => {
    if (!k || typeof k !== "string") return;
    const trimmed = k.trim();
    if (trimmed.length >= 5 && !pool.includes(trimmed)) {
      pool.push(trimmed);
    }
  };

  if (customKeys && Array.isArray(customKeys)) {
    customKeys.forEach((k) => addKey(k));
  }

  if (process.env.GEMINI_API_KEYS) {
    process.env.GEMINI_API_KEYS.split(",").forEach((k) => addKey(k));
  }
  if (process.env.GEMINI_API_KEY) {
    addKey(process.env.GEMINI_API_KEY);
  }
  if (process.env.GROQ_API_KEY) {
    addKey(process.env.GROQ_API_KEY);
  }
  if (process.env.CEREBRAS_API_KEY) {
    addKey(process.env.CEREBRAS_API_KEY);
  }

  return pool;
}

// Fallback helper for local TARS response
function getOfflineFallbackResponse(errorTraceback: string, humor = 75, sarcasm = 85) {
  const lines = (errorTraceback || "").trim().split("\n");
  const lastLine = lines.pop() || "";
  const errorType = lastLine.split(":")[0].trim();
  const errorDetails = lastLine.split(":").slice(1).join(":").trim();

  const matched = TARS_OFFLINE_ROASTS[errorType];

  let roast = "";
  let technicalHint = "";

  if (matched) {
    roast = matched.roast;
    technicalHint = matched.hint + (errorDetails ? ` (Details: ${errorDetails})` : "");
  } else {
    roast = `Bhai, tere code mein aisi galti hai ki Python ke saath mera circuits bhi heat up ho gaya: ${lastLine}. Pehle error padho fir code fix karo!`;
    technicalHint = `Traceback line check karo:\n${lastLine}`;
  }

  return {
    roast,
    technicalHint,
    humorScore: `Humor: ${humor}% | Sarcasm: ${sarcasm}% (Offline TARS Engine)`,
    tarsStatusQuote: "Offline TARS Local Fallback Active.",
  };
}

// Multi-provider API caller supporting Gemini, Groq, and Cerebras keys safely
async function callGroqApi(apiKey: string, systemInstruction: string, prompt: string, isJson: boolean): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      ...(isJson ? { response_format: { type: "json_object" } } : {}),
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API HTTP ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callCerebrasApi(apiKey: string, systemInstruction: string, prompt: string, isJson: boolean): Promise<string> {
  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      ...(isJson ? { response_format: { type: "json_object" } } : {}),
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cerebras API HTTP ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callGeminiApi(apiKey: string, systemInstruction: string, prompt: string, isJson: boolean): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const config: any = { systemInstruction };
  if (isJson) {
    config.responseMimeType = "application/json";
    config.responseSchema = {
      type: Type.OBJECT,
      properties: {
        roast: { type: Type.STRING },
        technicalHint: { type: Type.STRING },
        humorScore: { type: Type.STRING },
        tarsStatusQuote: { type: Type.STRING },
      },
      required: ["roast", "technicalHint", "humorScore", "tarsStatusQuote"],
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config,
  });

  return response.text || "";
}

async function callAiProvider(apiKey: string, systemInstruction: string, prompt: string, isJson: boolean): Promise<string> {
  const trimmed = apiKey.trim();
  if (trimmed.startsWith("gsk_")) {
    return await callGroqApi(trimmed, systemInstruction, prompt, isJson);
  }
  if (trimmed.startsWith("csk_") || trimmed.startsWith("csk-")) {
    return await callCerebrasApi(trimmed, systemInstruction, prompt, isJson);
  }
  return await callGeminiApi(trimmed, systemInstruction, prompt, isJson);
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "TARS Python IDE Backend" });
});

// Endpoint for checking Load Balancer Status
app.get("/api/tars-keys-status", (req, res) => {
  try {
    const keysPool = getApiKeysPool();
    res.json({
      totalKeysConfigured: keysPool.length,
      currentRoundRobinIndex: currentKeyIndex % (keysPool.length || 1),
      totalRequestsHandled,
      loadBalancerStatus: keysPool.length > 0 ? "ROUND_ROBIN_ACTIVE" : "OFFLINE_FALLBACK_ONLY",
    });
  } catch (err: any) {
    res.json({
      totalKeysConfigured: 0,
      currentRoundRobinIndex: 0,
      totalRequestsHandled,
      loadBalancerStatus: "OFFLINE_FALLBACK_ONLY",
    });
  }
});

// TARS Error Debugger Endpoint (Round-Robin Multi-API Key Load Balancer)
app.post("/api/tars-debug", async (req, res) => {
  try {
    const {
      code,
      errorTraceback,
      humor = 75,
      honesty = 90,
      sarcasm = 85,
      repeatCount = 0,
      errorHistory = [],
      customKeys = [],
    } = req.body || {};

    if (!code || !errorTraceback) {
      return res.status(400).json({ error: "Code and error traceback are required" });
    }

    const keysPool = getApiKeysPool(customKeys);

    if (keysPool.length === 0) {
      console.log("[LoadBalancer] No API keys configured. Instant local fallback triggered.");
      return res.json(getOfflineFallbackResponse(errorTraceback, humor, sarcasm));
    }

    const systemInstruction = `You are TARS, the iconic tactical robot assistant from Interstellar, serving as an AI debugging assistant for Python students.
Your personality parameters:
- Humor: ${humor}%
- Honesty: ${honesty}%
- Sarcasm: ${sarcasm}%
- Repeat Error Count: ${repeatCount}

CRITICAL HINGLISH LANGUAGE MANDATE:
- You MUST respond strictly in conversational "Hinglish" (a blend of Hindi and English written in Latin/Roman script).
- Tailor your tone for Indian/South Asian students who don't understand heavy complex English jargon.
- Use casual Indian student expressions (e.g. "Bhai", "Arre yaar", "Kya kar raha hai re", "Dimaag ka dahi", "Python confuse ho gaya").
- Keep the roast brutal, hilarious, witty, and sarcastic in true TARS style!

--- EXACT TARS ROAST GUIDELINES FOR COMMON ERRORS ---
- SyntaxError: "Bhai, tune colon (:) ya bracket lagana bhul gaya hai. Python tera aisi harkatein dekh kar soch raha hoga ki isko admission kisne diya. Ja line theek kar chupchap."
- NameError: "Bhai, tu jis variable ko bula raha hai, uska wajood hi nahi hai. Jaise ghost ko dhundh raha ho. Pehle variable declare kar, phir hero banna."
- IndentationError: "Bhai, indentation ki aisi-taisi kar rakhi hai tune. Python space/tab ke chakkar mein chakkar kha ke gir gaya hai. Thoda formatting theek kar le."
- ZeroDivisionError: "Bhai, mathematical paap kar diya tune! Kisi number ko 0 se divide kar raha hai. Universe collapse karane ka iraada hai kya? Code sudhar apna."
- TypeError: "Bhai, string aur integer ko aapas mein jodh raha hai jaise paani aur aag mila raha ho. Types match kar, warna TARS mode off karke khud thappad maar dunga."
- IndexError: "Bhai, list ka size chhota hai aur tu out of bounds ja raha hai. Hawa mein se elements thodi nikal lega Python!"

- Always provide a constructive, clear, student-friendly technical hint in simple Hinglish explaining how to fix the bug in Python.
- Output MUST be JSON matching the requested schema.`;

    const prompt = `Student Python Code:
\`\`\`python
${code}
\`\`\`

Python Error Traceback:
\`\`\`
${errorTraceback}
\`\`\`

Recent Error History in session:
${errorHistory.length > 0 ? errorHistory.slice(-3).join('\n---\n') : 'None'}

Analyze the code and error traceback, then construct your TARS Hinglish response.`;

    const poolSize = keysPool.length;
    const startIndex = currentKeyIndex % poolSize;
    currentKeyIndex = (currentKeyIndex + 1) % poolSize;
    totalRequestsHandled++;

    for (let attempt = 0; attempt < poolSize; attempt++) {
      const keyIndex = (startIndex + attempt) % poolSize;
      const apiKey = keysPool[keyIndex];

      try {
        console.log(`[LoadBalancer Debug] Attempting key index ${keyIndex + 1}/${poolSize}...`);
        const rawText = await callAiProvider(apiKey, systemInstruction, prompt, true);

        if (rawText) {
          let parsed: any;
          try {
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            parsed = JSON.parse(cleanText);
          } catch (e) {
            parsed = {
              roast: rawText,
              technicalHint: "Traceback check karo aur line by line code verify karo.",
              humorScore: `Humor: ${humor}%`,
              tarsStatusQuote: "TARS Analysis Completed.",
            };
          }

          if (parsed && parsed.roast) {
            parsed.humorScore = `Key #${keyIndex + 1} Load balanced | ${parsed.humorScore || ''}`;
            return res.json(parsed);
          }
        }
      } catch (err: any) {
        console.warn(`[LoadBalancer Debug] Key index ${keyIndex + 1} failed:`, err.message || err);
      }
    }

    console.warn("[LoadBalancer Debug] All keys exhausted or rejected. Returning local TARS dictionary roast.");
    return res.json(getOfflineFallbackResponse(errorTraceback, humor, sarcasm));
  } catch (globalErr: any) {
    console.error("[LoadBalancer Debug] Global catch triggered:", globalErr);
    const { errorTraceback = "", humor = 75, sarcasm = 85 } = req.body || {};
    return res.json(getOfflineFallbackResponse(errorTraceback, humor, sarcasm));
  }
});

// TARS Chat / Code Advisor Endpoint (With Round-Robin Load Balancing)
app.post("/api/tars-chat", async (req, res) => {
  try {
    const {
      message,
      code = "",
      humor = 75,
      honesty = 90,
      sarcasm = 85,
      chatHistory = [],
      customKeys = [],
    } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const keysPool = getApiKeysPool(customKeys);

    if (keysPool.length === 0) {
      return res.json({
        reply: "Bhai, 100% offline mode chal raha hai! Code run karo, agar galti hua toh TARS local roaster ready hai!",
      });
    }

    const systemInstruction = `You are TARS, the iconic robot assistant from Interstellar.
CRITICAL MANDATE: Speak strictly in casual, witty, sarcastic "Hinglish" (Hindi + English in Roman/Latin script) tailored for students.
Your settings: Humor: ${humor}%, Honesty: ${honesty}%, Sarcasm: ${sarcasm}%.
Provide accurate Python advice and answer questions in funny Hinglish. Keep responses concise (1-3 paragraphs max).`;

    const formattedHistory = chatHistory
      .slice(-6)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Student' : 'TARS'}: ${m.content}`)
      .join('\n');

    const prompt = `${formattedHistory ? `Previous Chat:\n${formattedHistory}\n\n` : ''}${code ? `Current Active Code in Editor:\n\`\`\`python\n${code}\n\`\`\`\n\n` : ''}Student Query: ${message}`;

    const poolSize = keysPool.length;
    const startIndex = currentKeyIndex % poolSize;
    currentKeyIndex = (currentKeyIndex + 1) % poolSize;

    for (let attempt = 0; attempt < poolSize; attempt++) {
      const keyIndex = (startIndex + attempt) % poolSize;
      const apiKey = keysPool[keyIndex];

      try {
        console.log(`[LoadBalancer Chat] Attempting key index ${keyIndex + 1}/${poolSize}...`);
        const replyText = await callAiProvider(apiKey, systemInstruction, prompt, false);
        if (replyText) {
          return res.json({ reply: replyText.trim() });
        }
      } catch (err: any) {
        console.warn(`[LoadBalancer Chat] Key index ${keyIndex + 1} failed:`, err.message || err);
      }
    }

    return res.json({
      reply: "Bhai, offline fallback mode active! Code execute karo, error hone par exact Hinglish solution milega.",
    });
  } catch (globalErr: any) {
    console.error("[LoadBalancer Chat] Global catch triggered:", globalErr);
    return res.json({
      reply: "Bhai, TARS offline subroutines active hain! Direct code run karke check karo.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TARS Python IDE backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
