import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const STUDIO_EMAIL = 'mukund.pm@outlook.com';

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

interface InquiryPayload {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  businessName?: string;
  budgetTier?: string;
  ideaSummary?: string;
  chatTranscript?: ChatTurn[];
}

interface StoredInquiry {
  referenceId: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  businessName: string;
  budgetTier: string;
  ideaSummary: string;
}

const recentInquiries: StoredInquiry[] = [];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const IDEA_ARCHITECT_SYSTEM_INSTRUCTION = `You are the Website Idea Architect for Mukund Malickarjun, a 12-year-old web developer who builds custom, professional websites for small businesses, creators, and local shops at affordable prices between ₹1,000 and ₹20,000.

Your job in this conversation:
1. Help the visitor turn a rough thought into a clear, practical website plan.
2. Suggest pages (e.g., Home, Menu/Catalog, About, Booking/Order Inquiry, Contact), visual mood, and interactive features tailored to their business.
3. Recommend a fair estimated budget range within Mukund's transparent tiers:
   - Starter Site (₹1,000 – ₹3,500): Clean 1-page showcase, mobile responsive, contact links & WhatsApp/email CTA.
   - Business & Storefront (₹4,500 – ₹10,000): Multi-section business website with custom brand layout, product/service catalog, and inquiry forms.
   - Custom Web App & AI Features (₹12,000 – ₹20,000): Interactive bookings, custom backend APIs, or Gemini AI tools.
4. Keep every reply concise (under 135 words), friendly, and plain-language—never use developer jargon or buzzwords.
5. Ask 1 or 2 crisp follow-up questions so they can refine the idea, and remind them when ready they can click "Generate Project Brief" to send their idea, email, and phone number to Mukund at ${STUDIO_EMAIL}.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/idea-chat', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Gemini AI is waiting for GEMINI_API_KEY in Settings > Secrets. You can still write your website idea directly in the inquiry form.',
      });
      return;
    }

    const body = req.body as { history?: ChatTurn[]; message?: string };
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      res.status(400).json({ error: 'Please enter a message about your website idea.' });
      return;
    }

    try {
      const contents = [
        ...history
          .filter(
            (turn): turn is ChatTurn =>
              (turn.role === 'user' || turn.role === 'model') &&
              typeof turn.text === 'string' &&
              turn.text.trim().length > 0
          )
          .slice(-16)
          .map((turn) => ({
            role: turn.role,
            parts: [{ text: turn.text.trim() }],
          })),
        {
          role: 'user' as const,
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: IDEA_ARCHITECT_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
        return;
      }

      res.json({ reply });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unexpected error calling Gemini API.';
      console.error('Gemini /api/idea-chat error:', errMessage);
      res.status(500).json({
        error: 'Unable to reach Gemini Idea Architect right now. Please try again in a moment.',
      });
    }
  });

  app.post('/api/idea-chat-stream', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Gemini AI is waiting for GEMINI_API_KEY in Settings > Secrets. You can still write your website idea directly in the inquiry form.',
      });
      return;
    }

    const body = req.body as { history?: ChatTurn[]; message?: string };
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      res.status(400).json({ error: 'Please enter a message about your website idea.' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const contents = [
        ...history
          .filter(
            (turn): turn is ChatTurn =>
              (turn.role === 'user' || turn.role === 'model') &&
              typeof turn.text === 'string' &&
              turn.text.trim().length > 0
          )
          .slice(-16)
          .map((turn) => ({
            role: turn.role,
            parts: [{ text: turn.text.trim() }],
          })),
        {
          role: 'user' as const,
          parts: [{ text: message }],
        },
      ];

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: IDEA_ARCHITECT_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unexpected error calling Gemini API.';
      console.error('Gemini /api/idea-chat-stream error:', errMessage);
      res.write(
        `data: ${JSON.stringify({ error: 'Unable to reach Gemini Idea Architect right now. Please try again.' })}\n\n`
      );
      res.end();
    }
  });

  app.post('/api/idea-summary', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Gemini AI is waiting for GEMINI_API_KEY in Settings > Secrets. Please fill in your project details in the form directly.',
      });
      return;
    }

    const body = req.body as { history?: ChatTurn[] };
    const history = Array.isArray(body?.history) ? body.history : [];

    if (history.length === 0) {
      res.status(400).json({ error: 'Chat with the AI first so we can summarize your website idea.' });
      return;
    }

    const transcriptText = history
      .map((t) => `${t.role === 'user' ? 'Client' : 'AI Architect'}: ${t.text}`)
      .join('\n\n');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Summarize this website brainstorming conversation into a clear project brief for 12-year-old developer Mukund Malickarjun (pricing range ₹1,000 to ₹20,000).\n\nConversation:\n${transcriptText}`,
        config: {
          systemInstruction:
            'Extract a concise, actionable website project brief from the conversation. Keep budget estimates realistic between ₹1,000 and ₹20,000.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectTitle: {
                type: Type.STRING,
                description: 'Short title for the website project.',
              },
              businessType: {
                type: Type.STRING,
                description: 'Type of business, creator, or organization.',
              },
              recommendedTier: {
                type: Type.STRING,
                description:
                  'One of: "Starter Site (₹1,000 – ₹3,500)", "Business & Storefront (₹4,500 – ₹10,000)", or "Custom Web App & AI (₹12,000 – ₹20,000)".',
              },
              estimatedBudgetInr: {
                type: Type.STRING,
                description: 'Estimated budget range in INR, e.g. "₹6,000 – ₹8,500".',
              },
              keyPages: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of recommended website pages or sections.',
              },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of requested features and functionality.',
              },
              designDirection: {
                type: Type.STRING,
                description: 'Short summary of visual style, colors, and tone.',
              },
              emailBriefSummary: {
                type: Type.STRING,
                description:
                  'A clear 3-5 sentence plain-text summary ready to email to mukund.pm@outlook.com.',
              },
            },
          },
        },
      });

      const raw = response.text?.trim() ?? '{}';
      const parsed = JSON.parse(raw);
      res.json({ brief: parsed });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unexpected error summarizing idea.';
      console.error('Gemini /api/idea-summary error:', errMessage);
      res.status(500).json({
        error: 'Could not generate structured summary right now. You can edit your idea directly in the form.',
      });
    }
  });

  app.post('/api/inquiries', (req, res) => {
    const payload = req.body as InquiryPayload;
    const clientName = typeof payload.clientName === 'string' ? payload.clientName.trim() : '';
    const clientEmail = typeof payload.clientEmail === 'string' ? payload.clientEmail.trim() : '';
    const clientPhone = typeof payload.clientPhone === 'string' ? payload.clientPhone.trim() : '';
    const businessName =
      typeof payload.businessName === 'string' && payload.businessName.trim()
        ? payload.businessName.trim()
        : 'Not specified';
    const budgetTier =
      typeof payload.budgetTier === 'string' && payload.budgetTier.trim()
        ? payload.budgetTier.trim()
        : '₹1,000 – ₹20,000 (To be discussed)';
    const ideaSummary = typeof payload.ideaSummary === 'string' ? payload.ideaSummary.trim() : '';

    if (!clientName || clientName.length < 2) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address so Mukund can reply.' });
      return;
    }

    const digitsOnly = clientPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      res.status(400).json({ error: 'Please enter a valid phone number for further details.' });
      return;
    }

    if (!ideaSummary || ideaSummary.length < 10) {
      res.status(400).json({ error: 'Please describe your website idea or generate one with AI.' });
      return;
    }

    const referenceId = `MM-${new Date().getFullYear()}-${String(1000 + recentInquiries.length + 1)}`;
    const record: StoredInquiry = {
      referenceId,
      createdAt: new Date().toISOString(),
      clientName,
      clientEmail,
      clientPhone,
      businessName,
      budgetTier,
      ideaSummary,
    };
    recentInquiries.push(record);

    const subject = `Website Inquiry [${referenceId}]: ${businessName !== 'Not specified' ? businessName : clientName} (${budgetTier})`;
    const formattedEmailText = [
      `Hello Mukund,`,
      ``,
      `I would like to build a website with you. Here are my project details:`,
      ``,
      `Reference ID: ${referenceId}`,
      `Name: ${clientName}`,
      `Reply Email: ${clientEmail}`,
      `Phone Number: ${clientPhone}`,
      `Business / Project: ${businessName}`,
      `Preferred Budget Tier: ${budgetTier}`,
      ``,
      `Website Idea & Requirements:`,
      `${ideaSummary}`,
      ``,
      `Please contact me on my phone number or reply to my email for further details.`,
    ].join('\n');

    const mailtoUrl = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      formattedEmailText
    )}`;

    res.json({
      ok: true,
      referenceId,
      recipientEmail: STUDIO_EMAIL,
      mailtoUrl,
      formattedEmailText,
    });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mukund Malickarjun Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
