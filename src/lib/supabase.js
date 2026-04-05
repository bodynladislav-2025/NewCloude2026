import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://rstuhinwhcguefpyfsdz.supabase.co',
  'sb_publishable_xuyqGDGC09ZgMTRzHR0HFg_Zq6GslIY'
);

// DB (snake_case) → App (camelCase)
export const fromDB = {
  player: (p) => ({ id: p.id, name: p.name, isMe: p.is_me }),
  match: (m) => ({
    id: m.id,
    date: m.date,
    player1Id: m.player1_id,
    player2Id: m.player2_id,
    score1: m.score1,
    score2: m.score2,
  }),
};
