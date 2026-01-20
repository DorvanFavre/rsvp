import { useEffect, useMemo, useState } from "react";



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
  const [jumpPercent, setJumpPercent] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatch, setSearchMatch] = useState(null); // { start, length }

  const chunks = useMemo(
    () => chunkWords(words, chunkSize),
    [words]
  );

  const currentChunkIndex = Math.floor(index / chunkSize);

  function findPhrase() {
  const query = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/);

  if (query.length === 0) return;

  for (let i = 0; i <= words.length - query.length; i++) {
    let match = true;

    for (let j = 0; j < query.length; j++) {
      if (
        words[i + j].toLowerCase().replace(/[^\w]/g, "") !==
        query[j].replace(/[^\w]/g, "")
      ) {
        match = false;
        break;
      }
    }

    if (match) {
      setSearchMatch({ start: i, length: query.length });
      setIndex(i);
      return;
    }
  }

  alert("Phrase not found");
}


  function jumpToPercentage() {
    const percent = Number(jumpPercent);

    if (isNaN(percent) || percent < 0 || percent > 100) return;

    const targetIndex = Math.floor(
      (percent / 100) * words.length
    );

    setIndex(targetIndex);
  }

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

      <div
  style={{
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    alignItems: "center",
  }}
>
  <input
    type="number"
    min="0"
    max="100"
    placeholder="%"
    value={jumpPercent}
    onChange={(e) => setJumpPercent(e.target.value)}
    style={{
      width: "4.5rem",
      padding: "0.4rem",
      borderRadius: "6px",
      border: "1px solid #374151",
      background: "#111827",
      color: "white",
    }}
  />

  <button
    onClick={jumpToPercentage}
    style={{
      padding: "0.4rem 0.8rem",
      borderRadius: "6px",
      border: "none",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
    }}
  >
    Jump
  </button>

  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
    of book
  </div>
</div>

<div
  style={{
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <input
    type="text"
    placeholder="Find phrase"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{
      flex: 1,
      minWidth: "10rem",
      padding: "0.4rem",
      borderRadius: "6px",
      border: "1px solid #374151",
      background: "#111827",
      color: "white",
    }}
  />

  <button
    onClick={findPhrase}
    style={{
      padding: "0.4rem 0.8rem",
      borderRadius: "6px",
      border: "none",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
    }}
  >
    Find
  </button>
</div>

      {chunks.map((chunk, chunkIdx) => {
        if (Math.abs(chunkIdx - currentChunkIndex) > 1) return null;

        return (
          <p key={chunkIdx} style={{ marginBottom: "1rem" }}>
            {chunk.map((word, i) => {
              const globalIndex = chunkIdx * chunkSize + i;

              const isSearchMatch =
              searchMatch &&
              globalIndex >= searchMatch.start &&
              globalIndex < searchMatch.start + searchMatch.length;

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
                      : isSearchMatch
                      ? "#2563eb"
                      : "transparent",
                  color:
                    globalIndex === index || isSearchMatch
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
