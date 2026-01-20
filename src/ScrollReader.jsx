import { useEffect, useRef } from "react";

export default function ScrollReader({
   words, index, setIndex, goToRSVP
  }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById(`word-${index}`);
    if (el) {
      el.scrollIntoView({ block: "center" });
    }
  }, [index]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        padding: "1.5rem",
        fontSize: "1.1rem",
        lineHeight: "1.6",
        background: "#0f1115",
        color: "#fff",
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
        }}
      >
        Back to RSVP
      </button>

      <p>
        {words.map((word, i) => (
          <span
            key={i}
            id={`word-${i}`}
            onClick={() => setIndex(i)}
            style={{
              cursor: "pointer",
              backgroundColor:
                i === index ? "#ef4444" : "transparent",
              padding: "0.1rem",
            }}
          >
            {word}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
