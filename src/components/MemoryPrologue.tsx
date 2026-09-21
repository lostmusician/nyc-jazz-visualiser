export function MemoryPrologue({ onComplete }: { onComplete:()=>void; onProgress?:(p:number)=>void; replay?:number; suspended?:boolean }) {
  return (
    <section id="journey-prologue" className="quiet-prologue" data-intro-state="complete">
      <div className="quiet-prologue-copy">
        <p className="quiet-kicker">Fifths &amp; Sevenths, Priced to the Nines</p>
        <h1 data-route-heading tabIndex={-1}>A room is never<br />just a room.</h1>
        <p className="quiet-thesis">A music scene begins with somewhere to gather.</p>
      </div>
      <button className="quiet-enter" onClick={onComplete}>Enter the room <span>↓</span></button>
      <p className="quiet-scroll" aria-hidden="true">Scroll to gather</p>
    </section>
  );
}
