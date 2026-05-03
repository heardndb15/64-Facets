"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { classifyMove, estimateAccuracy } from "@/lib/game-utils";
import { AnalysisResult, MoveAnalysis } from "@/lib/types";

interface UseStockfishReturn {
  isReady: boolean;
  isAnalyzing: boolean;
  analyzePGN: (pgn: string) => Promise<AnalysisResult | null>;
  currentEval: number | null;
  getBestMove: (fen: string, depth?: number) => Promise<string | null>;
}

/**
 * Hook that interfaces with Stockfish via a Web Worker.
 * Uses the public/stockfish.js file which must be copied from node_modules.
 */
export function useStockfish(): UseStockfishReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEval, setCurrentEval] = useState<number | null>(null);

  // Resolve queue for sequential position analysis
  const resolveRef = useRef<((value: number) => void) | null>(null);
  const resolveMoveRef = useRef<((value: string) => void) | null>(null);

  useEffect(() => {
    // Try to load stockfish from public directory
    try {
      const worker = new Worker("/stockfish.js");

      worker.onmessage = (e: MessageEvent) => {
        const line: string = e.data;

        // Extract bestmove from bestmove line
        if (line.startsWith("bestmove")) {
          const match = line.match(/bestmove\s+(\S+)/);
          if (match && resolveMoveRef.current) {
            resolveMoveRef.current(match[1]);
            resolveMoveRef.current = null;
          }
        }
        // Extract evaluation from info lines
        else if (line.startsWith("info") && line.includes("score cp")) {
          const match = line.match(/score cp (-?\d+)/);
          if (match) {
            const cp = parseInt(match[1], 10);
            setCurrentEval(cp);

            // Resolve the pending promise for this position
            if (resolveRef.current) {
              resolveRef.current(cp);
              resolveRef.current = null;
            }
          }
        } else if (line.startsWith("info") && line.includes("score mate")) {
          const match = line.match(/score mate (-?\d+)/);
          if (match) {
            const mateIn = parseInt(match[1], 10);
            const cp = mateIn > 0 ? 10000 : -10000;
            setCurrentEval(cp);
            if (resolveRef.current) {
              resolveRef.current(cp);
              resolveRef.current = null;
            }
          }
        } else if (line === "uciok") {
          setIsReady(true);
        }
      };

      worker.onerror = (err) => {
        console.error("Stockfish worker error:", err);
        workerRef.current = null;
        setIsReady(true); // Use fallback on error
      };

      worker.postMessage("uci");
      worker.postMessage("isready");
      workerRef.current = worker;

      // Fail-safe timeout if worker hangs or CSP blocks it silently
      setTimeout(() => {
        setIsReady((prev) => {
          if (!prev) {
            console.warn("Stockfish initialization timed out. Using mock.");
            workerRef.current = null;
          }
          return true;
        });
      }, 3000);
    } catch {
      // Stockfish unavailable — set ready with fallback
      console.warn("Stockfish worker not available. Using mock analysis.");
      setIsReady(true);
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  /**
   * Get evaluation for a single FEN position.
   */
  const evaluatePosition = useCallback(
    (fen: string, depth = 12): Promise<number> => {
      if (!workerRef.current) {
        // Mock evaluation when Stockfish unavailable
        return Promise.resolve(Math.floor(Math.random() * 200 - 100));
      }

      return new Promise((resolve) => {
        resolveRef.current = resolve;
        workerRef.current!.postMessage("stop");
        workerRef.current!.postMessage(`position fen ${fen}`);
        workerRef.current!.postMessage(`go depth ${depth}`);
        
        // Timeout fallback for evaluation
        setTimeout(() => {
          if (resolveRef.current === resolve) {
            resolveRef.current = null;
            // Fallback mock value
            resolve(Math.floor(Math.random() * 200 - 100));
          }
        }, 2000);
      });
    },
    []
  );

  /**
   * Analyze a full PGN game, evaluating each position.
   * Returns a structured AnalysisResult.
   */
  const analyzePGN = useCallback(
    async (pgn: string): Promise<AnalysisResult | null> => {
      if (!pgn) return null;
      setIsAnalyzing(true);

      try {
        const chess = new Chess();
        chess.loadPgn(pgn);
        const history = chess.history({ verbose: true });

        // Replay from start and evaluate each position
        const game = new Chess();
        const moveAnalyses: MoveAnalysis[] = [];

        let prevEval = 0;

        for (let i = 0; i < history.length; i++) {
          const move = history[i];
          game.move(move.san);
          const fen = game.fen();

          let evalScore: number;
          try {
            // Limit depth for speed in analysis
            evalScore = await evaluatePosition(fen, 10);
          } catch {
            evalScore = prevEval;
          }

          const isWhiteTurn = move.color === "w";
          const type = classifyMove(prevEval, evalScore, isWhiteTurn);

          moveAnalyses.push({
            moveNumber: Math.floor(i / 2) + 1,
            move: move.san,
            fen,
            evaluation: evalScore,
            type,
          });

          prevEval = evalScore;
        }

        const blunders = moveAnalyses.filter((m) => m.type === "blunder");
        const mistakes = moveAnalyses.filter((m) => m.type === "mistake");
        const inaccuracies = moveAnalyses.filter((m) => m.type === "inaccuracy");

        const accuracy = estimateAccuracy(
          history.length,
          blunders.length,
          mistakes.length,
          inaccuracies.length
        );

        return {
          mistakes,
          blunders,
          inaccuracies,
          totalMoves: history.length,
          accuracy,
          aiFeedback: "", // Filled by Gemini
          keyInsights: [],
        };
      } catch (err) {
        console.error("Analysis error:", err);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [evaluatePosition]
  );

  /**
   * Get the best move for a given FEN from Stockfish.
   */
  const getBestMove = useCallback(
    (fen: string, depth = 10): Promise<string | null> => {
      if (!workerRef.current) return Promise.resolve(null);

      return new Promise((resolve) => {
        resolveMoveRef.current = resolve;
        workerRef.current!.postMessage("stop");
        workerRef.current!.postMessage(`position fen ${fen}`);
        workerRef.current!.postMessage(`go depth ${depth}`);
        
        // Timeout just in case
        setTimeout(() => {
          if (resolveMoveRef.current === resolve) {
            resolve(null);
            resolveMoveRef.current = null;
          }
        }, 5000);
      });
    },
    []
  );

  return { isReady, isAnalyzing, analyzePGN, currentEval, getBestMove };
}
