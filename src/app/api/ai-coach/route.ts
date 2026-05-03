import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai-coach
 * Body: { pgn, blunders, mistakes, inaccuracies, accuracy, result }
 * Returns: { feedback, insights }
 *
 * Uses Gemini to generate human-readable chess coaching feedback.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pgn, blunders, mistakes, inaccuracies, accuracy, result } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Build prompt for Gemini
    const prompt = `You are an AI chess coach for a platform called "Aura Chess — The Garden of Strategy."
Your job is to give warm, encouraging, metaphor-based feedback on a player's chess game.

Game statistics:
- Accuracy: ${accuracy}%
- Blunders: ${blunders} (very bad moves that lose significant material or position)
- Mistakes: ${mistakes} (bad moves)
- Inaccuracies: ${inaccuracies} (slightly suboptimal moves)
- Game result: ${result}
- PGN (moves): ${pgn ? pgn.substring(0, 500) : "not available"}

Please provide:
1. A main coaching message (2-3 sentences) using gentle metaphors from nature, gardening, or growth. Be encouraging.
2. Exactly 3 specific insights as short bullet points (one sentence each) about what to improve.
3. One positive observation about something they did well.

Format your response as JSON with these fields:
{
  "mainFeedback": "...",
  "insights": ["insight1", "insight2", "insight3"],
  "positiveNote": "..."
}

Keep language simple, visual, and metaphor-rich. Examples:
- "You lost control of the center like a garden without borders"
- "This move delays your development — like planting seeds without preparing the soil"
- "Think of your pieces like team members — they work best when coordinated"`;

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini error:", err);
      return NextResponse.json(
        { error: "AI coach unavailable", fallback: true },
        { status: 200 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse JSON from Gemini's response
    let parsed;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (!parsed) {
      // Fallback when parsing fails
      return NextResponse.json({
        mainFeedback: `You played this game with ${accuracy}% accuracy. Like a garden that needs consistent care, chess improves with every session.`,
        insights: [
          "Try to control the center early — it's the foundation of your garden.",
          "Coordinate your pieces like a team — they grow stronger together.",
          "Review your positions before each move, like checking the soil before planting.",
        ],
        positiveNote: "Every game you finish is a seed planted toward mastery.",
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI coach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
