import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { applyXPGain, calculateXPGain } from "@/lib/game-utils";
import { AnalysisResult, GameResult } from "@/lib/types";

/**
 * POST /api/save-game
 * Saves a completed game + analysis to Supabase and updates player XP/level.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      pgn,
      result,
      analysis,
      aiFeedback,
    }: {
      userId: string;
      pgn: string;
      result: GameResult;
      analysis: AnalysisResult;
      aiFeedback: string;
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 1. Save game record
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: userId,
        pgn,
        result,
      })
      .select()
      .single();

    if (gameError) {
      console.error("Game save error:", gameError);
      return NextResponse.json({ error: "Failed to save game" }, { status: 500 });
    }

    // 2. Save analysis record
    const { error: analysisError } = await supabase.from("analysis").insert({
      game_id: game.id,
      mistakes_count: analysis.mistakes.length,
      blunders_count: analysis.blunders.length,
      inaccuracies_count: analysis.inaccuracies.length,
      ai_feedback: aiFeedback,
      moves_analysis: JSON.stringify(
        [...analysis.blunders, ...analysis.mistakes, ...analysis.inaccuracies]
      ),
    });

    if (analysisError) {
      console.error("Analysis save error:", analysisError);
    }

    // 3. Fetch current player stats
    const { data: user } = await supabase
      .from("users")
      .select("level, xp, coins")
      .eq("id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Calculate XP gain
    const won = result === "white"; // simplified: assume player is white
    const xpGain = calculateXPGain(won, analysis.accuracy, analysis.blunders.length);
    const { newXp, newLevel, leveledUp } = applyXPGain(user.xp, user.level, xpGain.total);

    // 5. Update player stats
    const { error: updateError } = await supabase
      .from("users")
      .update({
        level: newLevel,
        xp: newXp,
        coins: user.coins + Math.floor(xpGain.total / 5),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("User update error:", updateError);
    }

    return NextResponse.json({
      gameId: game.id,
      xpGain,
      newLevel,
      newXp,
      leveledUp,
    });
  } catch (error) {
    console.error("Save game error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
