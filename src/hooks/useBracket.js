import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useBracket(sharedBracketId) {
  const [picks, setPicks] = useState({});
  const [bracketId, setBracketId] = useState(null);
  const [displayName, setDisplayName] = useState("Anonymous");
  const [ownerName, setOwnerName] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveTimer = useRef(null);
  const picksRef = useRef(picks);
  const displayNameRef = useRef(displayName);
  const bracketIdRef = useRef(bracketId);

  // Keep refs in sync
  useEffect(() => { picksRef.current = picks; }, [picks]);
  useEffect(() => { displayNameRef.current = displayName; }, [displayName]);
  useEffect(() => { bracketIdRef.current = bracketId; }, [bracketId]);

  // ── Save to Supabase ──
  const saveToSupabase = useCallback(async () => {
    const id = bracketIdRef.current;
    if (!id || isReadOnly) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("brackets")
      .update({
        picks: picksRef.current,
        display_name: displayNameRef.current,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setIsSaving(false);
    if (!error) setLastSaved(new Date());
  }, [isReadOnly]);

  // ── Debounced save on picks or displayName change ──
  useEffect(() => {
    if (!bracketId || isReadOnly || isLoading) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveToSupabase, 1000);
    return () => clearTimeout(saveTimer.current);
  }, [picks, displayName, bracketId, isReadOnly, isLoading, saveToSupabase]);

  // ── Init: auth + load bracket ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. If viewing a shared bracket, just fetch it
      if (sharedBracketId) {
        const { data, error } = await supabase
          .from("brackets")
          .select("*")
          .eq("id", sharedBracketId)
          .single();
        if (!cancelled && data) {
          setPicks(data.picks || {});
          setOwnerName(data.display_name || "Anonymous");
          setIsReadOnly(true);
          setBracketId(data.id);
        }
        if (!cancelled) setIsLoading(false);
        return;
      }

      // 2. Sign in anonymously (reuses session from localStorage)
      const { data: { session } } = await supabase.auth.getSession();
      let userId;
      if (session?.user) {
        userId = session.user.id;
      } else {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error || !data.session) {
          console.error("Auth failed:", error);
          if (!cancelled) setIsLoading(false);
          return;
        }
        userId = data.session.user.id;
      }

      // 3. Load existing bracket or create one
      const { data: existing } = await supabase
        .from("brackets")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (!cancelled && existing) {
        setPicks(existing.picks || {});
        setDisplayName(existing.display_name || "Anonymous");
        setBracketId(existing.id);
      } else if (!cancelled) {
        const { data: created, error } = await supabase
          .from("brackets")
          .insert({ user_id: userId, picks: {}, display_name: "Anonymous" })
          .select()
          .single();
        if (created) {
          setBracketId(created.id);
        }
      }
      if (!cancelled) setIsLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, [sharedBracketId]);

  // ── Bracket helpers (moved from MarchMadness2026) ──
  function getBracketKey(region, round, slot) {
    return `${region}-R${round}-S${slot}`;
  }

  function isStillValid(picksObj, key, round, slot, region) {
    const picked = picksObj[key];
    if (!picked) return true;
    const feeder1 = getBracketKey(region, round - 1, slot * 2);
    const feeder2 = getBracketKey(region, round - 1, slot * 2 + 1);
    const f1 = picksObj[feeder1];
    const f2 = picksObj[feeder2];
    return f1 === picked || f2 === picked;
  }

  function makePick(key, team, region, round, slot) {
    if (isReadOnly) return;
    setPicks(prev => {
      const next = { ...prev, [key]: team };
      const maxRounds = 7;
      for (let r = round + 1; r <= maxRounds; r++) {
        const downSlot = Math.floor(slot / Math.pow(2, r - round));
        const dk = getBracketKey(r <= 4 ? region : "FF", r, downSlot);
        if (prev[dk] && !isStillValid(next, dk, r, downSlot, r <= 4 ? region : "FF")) {
          delete next[dk];
        }
      }
      return next;
    });
  }

  return {
    picks,
    setPicks,
    makePick,
    isReadOnly,
    ownerName,
    bracketId,
    isSaving,
    lastSaved,
    displayName,
    setDisplayName,
    isLoading,
  };
}
