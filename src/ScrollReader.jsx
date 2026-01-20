import { useEffect, useMemo } from "react";

function chunkWords(words, chunkSize = 300) {
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }
  return chunks;
}

export default function ScrollReader({
  words,
  index,
  setIndex,
  goToRSVP,
}) {
  const chunkSize = 300;

  const chunks = useMemo(
    () => chunkWords(words, chunkSize),
    [words]
  );

  const currentChunkIndex = Math.floor(index / chunkSize);

  // Scroll current word into view
  useEffect(() => {
    const el = document.getElementById(`word-${index}`);
    if (el) {
      el.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [index]);

  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "1.5rem",
        fontSize: "1.1rem",
        lineHeight: "1.6",
        background: "#0f1115",
        color: "#fff",
        touchAction: "pan-y",
      }}
    >
      <button
        onClick={goToRSVP}
        style={{
          position: "sticky",
          top: 0,
          marginBottom: "1rem",
          padding: "0.6rem 1rem",
          background: "#3b82f6",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Back to RSVP
      </button>

      {chunks.map((chunk, chunkIdx) => {
        if (Math.abs(chunkIdx - currentChunkIndex) > 1) return null;

        return (
          <p key={chunkIdx} style={{ marginBottom: "1rem" }}>
            {chunk.map((word, i) => {
              const globalIndex = chunkIdx * chunkSize + i;

              return (
                <span
                  key={globalIndex}
                  id={`word-${globalIndex}`}  
                  onClick={() => setIndex(globalIndex)}
                  style={{
                    cursor: "pointer",
                    background:
                      globalIndex === index
                        ? "#ef4444"
                        : "transparent",
                    color:
                      globalIndex === index
                        ? "white"
                        : "#e5e7eb",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
