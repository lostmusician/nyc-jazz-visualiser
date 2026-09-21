import React, { useEffect, useMemo, useState } from 'react';
import { FEATURED_LISTENING_PAIR } from '../data/exhibits';
import { useMuseumVisit } from '../context/useMuseumVisit';
import { castVote, getVoteTotals, isPollConfigured, subscribeToVoteTotals, type VoteOption, type VoteTotals } from '../services/pollService';

const VISITOR_KEY = 'nyc-jazz-museum-visitor-id';

const getVisitorId = () => {
  const saved = window.localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;
  const id = window.crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
};

export const ListeningBooth: React.FC = () => {
  const { pollChoice, setPollChoice, completeExhibit, playClip, stopAudio, activeAudioId, audioMuted } = useMuseumVisit();
  const [totals, setTotals] = useState<VoteTotals | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'live' | 'offline'>(isPollConfigured ? 'loading' : 'offline');
  const [heard, setHeard] = useState<Set<VoteOption>>(new Set());
  const [audioError,setAudioError]=useState(false);

  const refreshTotals = async () => {
    if (!isPollConfigured) return;
    try {
      setTotals(await getVoteTotals(FEATURED_LISTENING_PAIR.id));
      setStatus('live');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    void refreshTotals();
    const unsubscribe = subscribeToVoteTotals(FEATURED_LISTENING_PAIR.id, () => void refreshTotals());
    const fallback = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refreshTotals();
    }, 12_000);
    return () => { unsubscribe(); window.clearInterval(fallback); };
  }, []);

  const totalVotes = (totals?.a || 0) + (totals?.b || 0);
  const percentages = useMemo(() => ({
    a: totalVotes ? Math.round(((totals?.a || 0) / totalVotes) * 100) : 0,
    b: totalVotes ? Math.round(((totals?.b || 0) / totalVotes) * 100) : 0,
  }), [totalVotes, totals]);

  const listen = async (option: VoteOption, src: string, excerpt: [number, number]) => {
    setHeard((current) => new Set(current).add(option));
    try { setAudioError(false);await playClip(`booth-${option}`, src, excerpt); } catch { setAudioError(true); }
  };

  const vote = async (option: VoteOption) => {
    if (pollChoice) return;
    stopAudio();
    setPollChoice(option);
    completeExhibit('listening');
    if (!isPollConfigured) { setStatus('offline'); return; }
    try {
      setStatus('loading');
      setTotals(await castVote(FEATURED_LISTENING_PAIR.id, option, getVisitorId()));
      setStatus('live');
    } catch {
      setStatus('offline');
    }
  };

  return (
    <section id="listening-booth" className="listening-booth museum-room" aria-labelledby="listening-title">
      <div className="room-number">01 — Listen</div>
      <header className="room-heading">
        <p>No dates. No names. Just the room.</p>
        <h2 id="listening-title" className="font-display" data-route-heading tabIndex={-1}>{FEATURED_LISTENING_PAIR.prompt}</h2>
        <span>Listen to both. Then choose where you would stay.</span>
      </header>

      <div className="listening-doors">
        {FEATURED_LISTENING_PAIR.options.map((option) => {
          const playing = activeAudioId === `booth-${option.id}`;
          const chosen = pollChoice === option.id;
          const revealed = Boolean(pollChoice);
          return (
            <article key={option.id} className={`listening-door ${chosen ? 'is-chosen' : ''}`}>
              <div className="door-letter font-display">{option.id.toUpperCase()}</div>
              <h3 className="sr-only">{option.label}</h3>
              <div className={`sound-line ${playing ? 'is-playing' : ''}`} aria-hidden="true">{Array.from({length:18},(_,index)=><i key={index}/>)}</div>
              <p>{revealed ? option.credit.description : 'An unlabelled twenty-four-second listening window.'}</p>
              <button type="button" onClick={() => playing ? stopAudio() : void listen(option.id, option.src, option.excerpt)} disabled={audioMuted}>
                {audioMuted ? 'Sound is muted' : playing ? 'Stop excerpt' : heard.has(option.id) ? 'Listen again' : 'Listen'}
              </button>
              {!pollChoice && <button type="button" className="vote-button" onClick={() => void vote(option.id)} disabled={heard.size < 2}>Stay in {option.label}</button>}
              <details className="silent-listening" onToggle={event=>{if(event.currentTarget.open)setHeard(current=>new Set(current).add(option.id));}}><summary>Read the sound description</summary><p>{option.credit.description}</p></details>
              {revealed && (
                <div className="listening-reveal">
                  <span>{option.credit.date}</span><strong>{option.credit.title}</strong><small>{option.credit.artist}</small>
                  {totals && <div className="vote-result"><i style={{ width: `${percentages[option.id]}%` }} /><b>{percentages[option.id]}% · {totals[option.id]} votes</b></div>}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {heard.size < 2 && !pollChoice && <p className="listening-instruction" aria-live="polite">Both excerpts must be opened before the voting slips appear.</p>}
      {audioError && <p role="status">The recording could not play. You can use its sound description to continue.</p>}
      {pollChoice && (
        <div className="listening-reflection" aria-live="polite">
          <span>The labels return</span>
          <h3 className="font-display">Which sound would receive another night in the room?</h3>
          <p>{FEATURED_LISTENING_PAIR.reflection}</p>
          <p>{status === 'live' ? `${totalVotes} shared responses are currently on the wall.` : status === 'loading' ? 'Updating the shared response wall…' : 'Your choice is saved on this device. Live totals are temporarily unavailable.'}</p>
          <details>
            <summary>Audio credits and release status</summary>
            {FEATURED_LISTENING_PAIR.options.map((option) => <p key={option.id}><b>{option.label}:</b> {option.credit.attribution} {option.credit.license}</p>)}
            <p className="rights-warning">Curatorial prototype: replace both studies with verified, rights-cleared archival and contemporary excerpts before public release.</p>
          </details>
        </div>
      )}
    </section>
  );
};
