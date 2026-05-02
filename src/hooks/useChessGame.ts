"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { GameResult, GameState } from "@/lib/types";

interface UseChessGameReturn {
  gameState: GameState;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  makeAIMove: () => void;
  resetGame: () => void;
  resignGame: () => void;
  highlightedSquares: Record<string, { background: string }>;
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
}

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Core hook managing chess game state.
 * Handles move validation, game-over detection, and simple AI opponent.
 */
export function useChessGame(
  playAgainstAI: boolean = false,
  engineMoveFetcher?: (fen: string, depth?: number) => Promise<string | null>
): UseChessGameReturn {
  const chessRef = useRef(new Chess());
  const [gameState, setGameState] = useState<GameState>({
    fen: INITIAL_FEN,
    pgn: "",
    turn: "w",
    isGameOver: false,
    result: null,
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<Record<string, { background: string }>>({});

  /**
   * Sync React state from chess.js instance.
   */
  const syncState = useCallback(() => {
    const chess = chessRef.current;
    let result: GameResult | null = null;

    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        result = chess.turn() === "w" ? "black" : "white";
      } else {
        result = "draw";
      }
    }

    setGameState({
      fen: chess.fen(),
      pgn: chess.pgn(),
      turn: chess.turn(),
      isGameOver: chess.isGameOver(),
      result,
      moveHistory: chess.history(),
      capturedPieces: { white: [], black: [] }, // simplified
    });
  }, []);

  /**
   * Make a move by from/to squares.
   * Returns true if the move was legal.
   */
  const makeMove = useCallback(
    (from: string, to: string, promotion = "q"): boolean => {
      const chess = chessRef.current;
      if (chess.isGameOver()) return false;

      try {
        const move = chess.move({ from, to, promotion });
        if (!move) return false;
        setSelectedSquare(null);
        setHighlightedSquares({});
        syncState();
        return true;
      } catch {
        return false;
      }
    },
    [syncState]
  );

  /**
   * Simple random-move AI for playing against, or Stockfish if engine is provided.
   */
  const makeAIMove = useCallback(async () => {
    const chess = chessRef.current;
    if (chess.isGameOver() || chess.turn() !== "b") return;

    if (engineMoveFetcher) {
      const bestMove = await engineMoveFetcher(chess.fen(), 10);
      if (bestMove) {
        // Stockfish returns format like e2e4 or e7e8q
        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
        makeMove(from, to, promotion);
        return;
      }
    }

    // Fallback to random move
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return;

    const captures = moves.filter((m) => m.captured);
    const pool = captures.length > 0 && Math.random() > 0.3 ? captures : moves;
    const randomMove = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      chess.move(randomMove);
      syncState();
    }, 400 + Math.random() * 600);
  }, [syncState, engineMoveFetcher, makeMove]);

  /**
   * Highlight legal moves for a selected square.
   */
  const onSquareClick = useCallback(
    (square: string) => {
      const chess = chessRef.current;
      if (chess.isGameOver()) return;

      if (selectedSquare) {
        // Try to make a move to this square
        const moved = makeMove(selectedSquare, square);
        if (!moved) {
          // Reselect if clicking a different own piece
          const piece = chess.get(square as Parameters<typeof chess.get>[0]);
          if (piece && piece.color === chess.turn()) {
            setSelectedSquare(square);
            showLegalMoves(square);
          } else {
            setSelectedSquare(null);
            setHighlightedSquares({});
          }
        }
        return;
      }

      const piece = chess.get(square as Parameters<typeof chess.get>[0]);
      if (!piece || piece.color !== chess.turn()) return;

      setSelectedSquare(square);
      showLegalMoves(square);
    },
    [selectedSquare, makeMove]
  );

  /**
   * Show legal move highlights for a square.
   */
  const showLegalMoves = useCallback((square: string) => {
    const chess = chessRef.current;
    const moves = chess.moves({ square: square as Parameters<typeof chess.moves>[0]["square"], verbose: true });
    const highlights: Record<string, { background: string }> = {
      [square]: { background: "rgba(74, 222, 128, 0.4)" },
    };
    moves.forEach((m) => {
      highlights[m.to] = {
        background: chess.get(m.to as Parameters<typeof chess.get>[0])
          ? "rgba(239, 68, 68, 0.4)" // capture = red
          : "radial-gradient(circle, rgba(74,222,128,0.4) 25%, transparent 25%)",
      };
    });
    setHighlightedSquares(highlights);
  }, []);

  /**
   * Resign the current game.
   */
  const resignGame = useCallback(() => {
    const chess = chessRef.current;
    const resigningColor = chess.turn() === "w" ? "white" : "black";
    setGameState((prev) => ({
      ...prev,
      isGameOver: true,
      result: resigningColor === "white" ? "black" : "white",
    }));
  }, []);

  /**
   * Reset to a fresh game.
   */
  const resetGame = useCallback(() => {
    chessRef.current = new Chess();
    setSelectedSquare(null);
    setHighlightedSquares({});
    syncState();
  }, [syncState]);

  // Trigger AI move after player moves (when playing vs AI)
  useEffect(() => {
    if (playAgainstAI && gameState.turn === "b" && !gameState.isGameOver) {
      makeAIMove();
    }
  }, [gameState.turn, gameState.isGameOver, playAgainstAI, makeAIMove]);

  return {
    gameState,
    makeMove,
    makeAIMove,
    resetGame,
    resignGame,
    highlightedSquares,
    onSquareClick,
    selectedSquare,
  };
}
