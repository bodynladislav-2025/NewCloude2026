import { useState, useEffect, useCallback } from 'react';
import { supabase, fromDB } from '../lib/supabase';

export function useAppData() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Načtení dat při startu
  useEffect(() => {
    async function loadData() {
      try {
        const [{ data: pData, error: pErr }, { data: mData, error: mErr }] = await Promise.all([
          supabase.from('players').select('*').order('created_at'),
          supabase.from('matches').select('*').order('created_at', { ascending: false }),
        ]);
        if (pErr) throw pErr;
        if (mErr) throw mErr;
        setPlayers((pData || []).map(fromDB.player));
        setMatches((mData || []).map(fromDB.match));
      } catch (e) {
        setError('Nepodařilo se načíst data. Zkontrolujte připojení.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── HRÁČI ──────────────────────────────────────────────

  const addPlayer = useCallback(async (player) => {
    if (player.isMe) {
      await supabase.from('players').update({ is_me: false }).eq('is_me', true);
    }
    const { data, error } = await supabase
      .from('players')
      .insert({ id: player.id, name: player.name, is_me: player.isMe })
      .select().single();
    if (error) throw error;
    setPlayers(prev => {
      const base = player.isMe ? prev.map(p => ({ ...p, isMe: false })) : prev;
      return [...base, fromDB.player(data)];
    });
  }, []);

  const updatePlayer = useCallback(async (id, updates) => {
    const { error } = await supabase
      .from('players')
      .update({ name: updates.name })
      .eq('id', id);
    if (error) throw error;
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePlayer = useCallback(async (id) => {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const setPlayerAsMe = useCallback(async (id) => {
    await supabase.from('players').update({ is_me: false }).neq('id', id);
    await supabase.from('players').update({ is_me: true }).eq('id', id);
    setPlayers(prev => prev.map(p => ({ ...p, isMe: p.id === id })));
  }, []);

  // ── ZÁPASY ─────────────────────────────────────────────

  const addMatch = useCallback(async (match) => {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        id: match.id,
        date: match.date,
        player1_id: match.player1Id,
        player2_id: match.player2Id,
        score1: match.score1,
        score2: match.score2,
      })
      .select().single();
    if (error) throw error;
    setMatches(prev => [fromDB.match(data), ...prev]);
  }, []);

  const updateMatch = useCallback(async (id, updates) => {
    const { error } = await supabase
      .from('matches')
      .update({
        date: updates.date,
        player1_id: updates.player1Id,
        player2_id: updates.player2Id,
        score1: updates.score1,
        score2: updates.score2,
      })
      .eq('id', id);
    if (error) throw error;
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMatch = useCallback(async (id) => {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) throw error;
    setMatches(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    players, matches, loading, error,
    addPlayer, updatePlayer, deletePlayer, setPlayerAsMe,
    addMatch, updateMatch, deleteMatch,
  };
}
