export type VoteOption = 'a' | 'b';
export type VoteTotals = Record<VoteOption, number>;

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isPollConfigured = Boolean(supabaseUrl && supabaseKey);

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
};

const parseRows = (rows: Array<{ option_id: string; vote_count: number }>): VoteTotals => ({
  a: Number(rows.find((row) => row.option_id === 'a')?.vote_count || 0),
  b: Number(rows.find((row) => row.option_id === 'b')?.vote_count || 0),
});

export async function getVoteTotals(pollId: string): Promise<VoteTotals> {
  if (!isPollConfigured) throw new Error('Live voting is not configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/poll_totals?poll_id=eq.${encodeURIComponent(pollId)}&select=option_id,vote_count`, { headers });
  if (!response.ok) throw new Error('Could not load live totals');
  return parseRows(await response.json());
}

export async function castVote(pollId: string, optionId: VoteOption, visitorId: string): Promise<VoteTotals> {
  if (!isPollConfigured) throw new Error('Live voting is not configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/cast_vote`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ p_poll_id: pollId, p_option_id: optionId, p_visitor_id: visitorId }),
  });
  if (!response.ok) throw new Error(response.status === 409 ? 'This browser has already voted' : 'Could not record vote');
  return parseRows(await response.json());
}

export function subscribeToVoteTotals(pollId: string, onChange: () => void): () => void {
  if (!isPollConfigured || typeof WebSocket === 'undefined') return () => undefined;
  const socketUrl = `${supabaseUrl.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(supabaseKey)}&vsn=1.0.0`;
  const socket = new WebSocket(socketUrl);
  let heartbeat: number | null = null;
  let ref = 1;

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      topic: 'realtime:public:poll_totals',
      event: 'phx_join',
      payload: { config: { broadcast: { self: false }, presence: { key: '' }, postgres_changes: [{ event: '*', schema: 'public', table: 'poll_totals', filter: `poll_id=eq.${pollId}` }] } },
      ref: String(ref++),
    }));
    heartbeat = window.setInterval(() => socket.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(ref++) })), 25_000);
  });
  socket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data) as { event?: string };
      if (message.event === 'postgres_changes') onChange();
    } catch {
      // Ignore non-JSON realtime frames and retain polling as a fallback.
    }
  });

  return () => {
    if (heartbeat !== null) window.clearInterval(heartbeat);
    socket.close();
  };
}
