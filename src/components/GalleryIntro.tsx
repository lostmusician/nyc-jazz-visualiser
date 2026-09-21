export function GalleryIntro({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="gallery-intro">
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-copy">
        <p className="intro-kicker">A jazz map of New York City</p>
        <h1>Come in. The city’s still playing.</h1>
        <p className="intro-lede">
          This isn’t a neat little walking tour. It’s more like getting lost in New York’s jazz history—in a good way.
          Wander between clubs, see what survived, and hear a little of what once spilled out onto the street.
        </p>
        <button type="button" className="intro-enter" onClick={onEnter}>Enter the gallery <span aria-hidden="true">↗</span></button>
      </div>
      <div className="intro-guide" aria-label="How to explore">
        <div><span>01</span><strong>Drag anywhere</strong><p>There’s no edge. Pull the gallery around and follow whatever catches your eye.</p></div>
        <div><span>02</span><strong>Move through time</strong><p>The decades along the bottom change both the clubs and the city around them.</p></div>
        <div><span>03</span><strong>Open a club</strong><p>Cards hold the story. The little records inside give you something from the room or its scene.</p></div>
        <div><span>04</span><strong>Use the filter</strong><p>The button up top is there when you want a particular scene—or just a list of names.</p></div>
      </div>
    </main>
  );
}
