"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeMatchProps {
  matchId: string | null;
  onReceiveMove: (from: string, to: string, promotion?: string) => void;
}

export function useRealtimeMatch({ matchId, onReceiveMove }: UseRealtimeMatchProps) {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Store the callback in a ref to avoid re-subscribing on every function recreation
  const onReceiveMoveRef = useRef(onReceiveMove);
  useEffect(() => {
    onReceiveMoveRef.current = onReceiveMove;
  }, [onReceiveMove]);

  useEffect(() => {
    if (!matchId) {
      setStatus("disconnected");
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      return;
    }

    setStatus("connecting");

    // Initialize the channel for broadcasting
    const channel = supabase.channel(`match:${matchId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "chess_move" }, (payload) => {
        const { from, to, promotion } = payload.payload;
        if (onReceiveMoveRef.current) {
          onReceiveMoveRef.current(from, to, promotion);
        }
      })
      .subscribe((statusEnum) => {
        if (statusEnum === "SUBSCRIBED") {
          setStatus("connected");
        } else {
          setStatus("disconnected");
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [matchId]);

  const sendMove = useCallback((from: string, to: string, promotion?: string) => {
    if (channelRef.current && status === "connected") {
      channelRef.current.send({
        type: "broadcast",
        event: "chess_move",
        payload: { from, to, promotion },
      });
    }
  }, [status]);

  return { status, sendMove };
}
