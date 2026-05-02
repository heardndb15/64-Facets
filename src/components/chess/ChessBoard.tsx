"use client";

import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useChessGame } from "@/hooks/useChessGame";
import { GameResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  RotateCcw,
  Flag,
  Clock,
  Cpu,
  Users,
  Crown,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChessBoardProps {
  onGameEnd: (pgn: string, result: GameResult) => void;
  playAgainstAI?: boolean;
  engineMoveFetcher?: (fen: string, depth?: number) => Promise<string | null>;
}

/**
 * Interactive chess board component.
 * Wraps react-chessboard with our game hook, move history, and controls.
 */
export function ChessBoardComponent({ onGameEnd, playAgainstAI = false, engineMoveFetcher }: ChessBoardProps) {
  const {
    gameState,
    makeMove,
    resetGame,
    resignGame,
    highlightedSquares,
    onSquareClick,
    selectedSquare,
  } = useChessGame(playAgainstAI, engineMoveFetcher);

  const [hasNotifiedEnd, setHasNotifiedEnd] = useState(false);

  // Notify parent when game ends (once)
  React.useEffect(() => {
    if (gameState.isGameOver && !hasNotifiedEnd && gameState.pgn) {
      setHasNotifiedEnd(true);
      onGameEnd(gameState.pgn, gameState.result ?? "draw");
    }
  }, [gameState.isGameOver, gameState.pgn, gameState.result, hasNotifiedEnd, onGameEnd]);

  const handleReset = () => {
    setHasNotifiedEnd(false);
    resetGame();
  };

  const handleResign = () => {
    if (!gameState.isGameOver) {
      resignGame();
    }
  };

  const resultDisplay: Record<string, { icon: React.ReactNode; text: string; color: string }> = {
    white: { icon: <Crown size={18} />, text: "White wins!", color: "text-yellow-400" },
    black: { icon: <Crown size={18} />, text: "Black wins!", color: "text-gray-300" },
    draw: { icon: <Handshake size={18} />, text: "Draw!", color: "text-blue-400" },
    abandoned: { icon: <Flag size={18} />, text: "Resigned", color: "text-red-400" },
  };

  const res = gameState.result ? resultDisplay[gameState.result] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Board */}
      <div className="flex-1 min-w-0">
        {/* Game over overlay info */}
        {gameState.isGameOver && res && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-aura-card border border-aura-border">
            <span className={cn(res.color, "flex items-center gap-2 font-semibold text-sm")}>
              {res.icon} {res.text}
            </span>
            <span className="text-gray-500 text-sm ml-auto">Game over</span>
          </div>
        )}

        {/* Turn indicator */}
        {!gameState.isGameOver && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
            <Clock size={14} />
            <span>
              {gameState.turn === "w" ? "⬜ White" : "⬛ Black"} to move
              {playAgainstAI && gameState.turn === "b" && (
                <span className="ml-1 text-garden-400 animate-pulse">(AI thinking...)</span>
              )}
            </span>
          </div>
        )}

        {/* Board wrapper */}
        <div className="chess-wrapper w-full max-w-[520px] mx-auto lg:mx-0">
          <Chessboard
            id="aura-chess-board"
            position={gameState.fen}
            onPieceDrop={(from, to) => makeMove(from, to)}
            onSquareClick={onSquareClick}
            boardOrientation={playAgainstAI ? "white" : (gameState.turn === "w" ? "white" : "black")}
            customSquareStyles={highlightedSquares}
            customBoardStyle={{
              borderRadius: "12px",
              boxShadow: "none",
            }}
            customDarkSquareStyle={{ backgroundColor: "#2d4a3e" }}
            customLightSquareStyle={{ backgroundColor: "#a8c5a0" }}
            animationDuration={200}
            arePiecesDraggable={!gameState.isGameOver}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-3 max-w-[520px] mx-auto lg:mx-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw size={14} />
            New Game
          </Button>
          {!gameState.isGameOver && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleResign}
              className="flex-1"
            >
              <Flag size={14} />
              Resign
            </Button>
          )}
          {gameState.isGameOver && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => {
                /* analysis handled by parent */
              }}
            >
              <ChevronRight size={14} />
              View Analysis
            </Button>
          )}
        </div>
      </div>

      {/* Move history panel */}
      <div className="w-full lg:w-56 shrink-0">
        <Card className="h-full">
          <CardContent className="p-0">
            <div className="px-4 pt-4 pb-2 border-b border-aura-border flex items-center gap-2">
              {playAgainstAI ? (
                <Cpu size={14} className="text-garden-400" />
              ) : (
                <Users size={14} className="text-garden-400" />
              )}
              <CardTitle className="text-xs">Move History</CardTitle>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {gameState.moveHistory.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-6">
                  Make your first move!
                </p>
              ) : (
                <div className="space-y-0.5">
                  {Array.from({ length: Math.ceil(gameState.moveHistory.length / 2) }).map((_, i) => {
                    const white = gameState.moveHistory[i * 2];
                    const black = gameState.moveHistory[i * 2 + 1];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs px-2 py-1 rounded-lg hover:bg-aura-muted"
                      >
                        <span className="text-gray-600 w-5 shrink-0">{i + 1}.</span>
                        <span className="text-white font-mono w-12 shrink-0">{white}</span>
                        {black && (
                          <span className="text-gray-400 font-mono">{black}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
