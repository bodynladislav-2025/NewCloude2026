import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://rstuhinwhcguefpyfsdz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdHVoaW53aGNndWVmcHlmc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDcxNTMsImV4cCI6MjA5MDk4MzE1M30.TqjmhdwxTkU4pfubGXju5T124HEENcwnR1eFsX_FU2E'
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
