import React, { useMemo, useState } from 'react';
import { VENUE_SIMULATION_PRESETS } from '../data/exhibits';
import { useMuseumVisit } from '../context/useMuseumVisit';
import { calculateVenueModel } from '../utils/venueModel';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const VenueEconomics: React.FC = () => {
  const { completeExhibit } = useMuseumVisit();
  const [presetId, setPresetId] = useState(VENUE_SIMULATION_PRESETS[0].id);
  const [ticketPrice, setTicketPrice] = useState(18);
  const [performancesPerWeek, setPerformancesPerWeek] = useState(4);
  const [attendanceRate, setAttendanceRate] = useState(.7);
  const [artistShare, setArtistShare] = useState(.45);
  const [hasChanged, setHasChanged] = useState(false);
  const [stage, setStage] = useState(0);
  const preset = VENUE_SIMULATION_PRESETS.find((item) => item.id === presetId) || VENUE_SIMULATION_PRESETS[0];
  const result = useMemo(() => calculateVenueModel(preset, { ticketPrice, performancesPerWeek, attendanceRate, artistShare }), [artistShare, attendanceRate, performancesPerWeek, preset, ticketPrice]);

  const update = (setter: React.Dispatch<React.SetStateAction<number>>, value: number, nextStage: number) => {
    setter(value); setHasChanged(true); setStage((current) => Math.max(current, nextStage));
    if (nextStage >= 5) completeExhibit('economics');
  };

  const protectedPriority = artistShare >= .55 ? 'artist pay' : ticketPrice <= 15 ? 'audience access' : performancesPerWeek >= 6 ? 'a dense calendar' : 'financial breathing room';
  const pressure = result.monthlyBalance >= 0 ? 'This version keeps the ledger above water.' : `The room finishes the month ${money.format(Math.abs(result.monthlyBalance))} short.`;

  return (
    <section id="venue-economics" className="venue-economics museum-room" aria-labelledby="economics-title">
      <div className="room-number font-typewriter">ROOM 03 / THE VENUE LEDGER</div>
      <header className="room-heading economics-heading">
        <p>An illustrative model—not a historical account book.</p>
        <h2 id="economics-title" className="font-display" data-route-heading tabIndex={-1}>Can you keep the room open?</h2>
        <span>Change the terms of one month. Every choice protects something and puts pressure somewhere else.</span>
      </header>

      <div className="economics-layout">
        <div className="economic-room" aria-hidden="true" style={{'--access':1-(ticketPrice-5)/65,'--artist-light':artistShare,'--reserve':1-artistShare} as React.CSSProperties}>
          <div className="economic-door"/><div className="economic-stage"/><div className="economic-reserve"/>
          <div className="economic-calendar">{Array.from({length:performancesPerWeek*4},(_,i)=><i key={i}>{i+1}</i>)}</div>
          <div className="economic-audience">{Array.from({length:20},(_,i)=><i key={i} className={i<Math.round(attendanceRate*20)?'occupied':''}/>)}</div>
          <span>THE ROOM YOUR CHOICES MAKE</span>
        </div>
        <form className="ledger-controls" onSubmit={(event) => event.preventDefault()}>
          <div className="ledger-progress" aria-live="polite"><span style={{ width: `${Math.max(8, Math.min(100, stage * 20))}%` }} /><b>{stage === 0 ? 'Choose the room' : stage < 5 ? `Decision ${stage} of 4` : 'The month is assembled'}</b></div>
          <fieldset>
            <legend className="font-typewriter">CHOOSE A ROOM</legend>
            <div className="preset-tabs">{VENUE_SIMULATION_PRESETS.map((item) => <button type="button" key={item.id} className={presetId === item.id && stage > 0 ? 'is-selected' : ''} onClick={() => { setPresetId(item.id); setAttendanceRate(item.attendanceRate); setHasChanged(true); setStage((current) => Math.max(current, 1)); }}><b>{item.year}</b><span>{item.label}</span></button>)}</div>
            <p className="preset-note">{preset.place} · {preset.capacity} seats. {preset.note}</p>
          </fieldset>

          {stage >= 1 && <label><small>01 / ACCESS</small><span>Ticket price <b>{money.format(ticketPrice)}</b></span><input type="range" min="5" max="55" step="1" value={ticketPrice} onChange={(event) => update(setTicketPrice, Number(event.target.value), 2)} /></label>}
          {stage >= 2 && <label><small>02 / FREQUENCY</small><span>Performances each week <b>{performancesPerWeek}</b></span><input type="range" min="1" max="8" step="1" value={performancesPerWeek} onChange={(event) => update(setPerformancesPerWeek, Number(event.target.value), 3)} /></label>}
          {stage >= 3 && <label><small>03 / THE CROWD</small><span>Seats filled <b>{Math.round(attendanceRate * 100)}%</b></span><input type="range" min=".3" max="1" step=".05" value={attendanceRate} onChange={(event) => update(setAttendanceRate, Number(event.target.value), 4)} /></label>}
          {stage >= 4 && <label><small>04 / PRIORITY</small><span>Ticket revenue paid to artists <b>{Math.round(artistShare * 100)}%</b></span><input type="range" min=".25" max=".75" step=".05" value={artistShare} onChange={(event) => update(setArtistShare, Number(event.target.value), 5)} /></label>}
        </form>

        <aside className={`venue-ledger ${result.monthlyBalance >= 0 ? 'is-positive' : 'is-negative'} ${stage < 5 ? 'is-veiled' : ''}`} aria-live="polite">
          <div className="receipt-edge" aria-hidden="true" />
          <span className="font-typewriter">MONTHLY PROJECTION · {preset.year}</span>
          {stage < 5 && <div className="ledger-veil"><span>{stage === 0 ? 'Choose a room to receive its ledger.' : stage < 4 ? 'The totals remain folded until all four decisions are visible.' : 'Set the artist-pay priority to open the ledger.'}</span></div>}
          <dl aria-hidden={stage < 5}>
            <div><dt>Door revenue</dt><dd>{money.format(result.monthlyRevenue)}</dd></div>
            <div><dt>Artist pay</dt><dd>− {money.format(result.artistPay)}</dd></div>
            <div><dt>Rent + room costs</dt><dd>− {money.format(result.operatingCosts)}</dd></div>
            <div className="ledger-total"><dt>Balance</dt><dd>{money.format(result.monthlyBalance)}</dd></div>
          </dl>
          <div className="ledger-reflection" aria-hidden={stage<5}><b>{pressure}</b><p>{hasChanged ? `Your choices currently protect ${protectedPriority}. They also determine who can afford to enter and how much artistic risk the room can absorb.` : 'Move any control to begin. There is no perfect ledger hiding behind the sliders.'}</p></div>
          <div className="experimental-nights" aria-hidden={stage<5}><strong>{result.experimentalNights}</strong><span>unfunded or experimental nights this surplus could underwrite</span></div>
        </aside>
      </div>

      <details id="methodology" className="model-methodology">
        <summary>How this illustrative model works</summary>
        <p>Monthly revenue = seats × attendance × ticket price × performances per week × 4.33. Artist pay is the selected share of that revenue. Costs combine the preset rent, fixed room costs and $240 per performance. A positive balance can underwrite experimental nights at an illustrative $650 each.</p>
        <p>These presets are comparative teaching scenarios, not claims about any named venue’s books. The map’s census layer measures residential contract rent and is not used as commercial venue rent.</p>
        <div className="model-sources"><span>Context behind the three scenarios:</span>{VENUE_SIMULATION_PRESETS.flatMap((item) => item.sources).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>
      </details>
    </section>
  );
};
