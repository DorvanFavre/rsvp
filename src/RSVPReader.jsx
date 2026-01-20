import { useEffect, useRef, useState } from "react";
/* ======================
   Pivot logic
   ====================== */

function getPivotIndex(word) {
  if (!word || word.length <= 1) return 0;
  if (word.length <= 5) return 1;
  if (word.length <= 9) return 2;
  return Math.floor(word.length / 2) - 1;
}

function PivotWord({ word }) {
  if (!word) return null;

  const clean = word.replace(/^[^\w]+|[^\w]+$/g, "");
  const pivot = getPivotIndex(clean);

  const left = clean.slice(0, pivot);
  const pivotChar = clean[pivot] || "";
  const right = clean.slice(pivot + 1);

  return (
    <div style={pivotStyles.container}>
      <span style={pivotStyles.left}>{left}</span>
      <span style={pivotStyles.pivot}>{pivotChar}</span>
      <span style={pivotStyles.right}>{right}</span>
    </div>
  );
}







/* ======================
   RSVP Reader
   ====================== */

export default function RSVPReader({
  words,
  index,
  setIndex,
  handleFileUpload,
  goToScroll
}) {

  const [running, setRunning] = useState(false);
  const [wpm, setWpm] = useState(300);

  const timerRef = useRef(null);
  const intervalMs = 60000 / wpm;

  useEffect(() => {
    if (!running) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setIndex((i) =>
        i < words.length - 1 ? i + 1 : i
      );
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [running, intervalMs, words.length, setIndex]);

  return (
    <div style={styles.container}>

      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        accept=".pdf,.epub"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerActions}>
          <button
            style={styles.headerButtonPrimary}
            onClick={() =>
              document.getElementById("file-input").click()
            }
          >
            Import PDF / EPUB
          </button>

          <button
            style={styles.headerButton}
            onClick={goToScroll}
          >
            Text view
          </button>
        </div>

        <div style={styles.headerStatus}>
          {words.length} words
        </div>
      </div>

      {/* Word display */}
      <div
      style={styles.wordContainer}
      onClick={() => setRunning((r) => !r)}
    >
      <PivotWord word={words[index]} />
    </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.buttonsRow}>
          <button
            style={{
              ...styles.button,
              ...(running ? {} : styles.buttonPrimary),
            }}
            onClick={() => setRunning(!running)}
          >
            {running ? "Pause" : "Start"}
          </button>

          <button
            style={styles.button}
            onClick={() => setIndex(0)}
          >
            Reset
          </button>
        </div>

        <div style={styles.sliderRow}>
          <div style={styles.sliderLabel}>
            Speed: {wpm} WPM
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={wpm}
            onChange={(e) =>
              setWpm(Number(e.target.value))
            }
            style={styles.slider}
          />
        </div>
      </div>
    </div>
  );
}

/* ======================
   Styles
   ====================== */

const styles = {
  container: {
    position: "fixed",
    inset: 0,              // top:0 right:0 bottom:0 left:0
    backgroundColor: "#0f1115",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    boxSizing: "border-box",
    overflow: "hidden",    // 🔒 no internal scrolling
    touchAction: "none",
  },


  wordContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  buttonsRow: {
    display: "flex",
    gap: "1rem",
  },

  button: {
    flex: 1,
    padding: "0.9rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#1f2937",
    color: "white",
    cursor: "pointer",
  },

  buttonPrimary: {
    backgroundColor: "#3b82f6",
  },

  sliderRow: {
    display: "flex",
    flexDirection: "column",
  },

  sliderLabel: {
    fontSize: "0.85rem",
    color: "#aaa",
    textAlign: "center",
  },

  slider: {
    width: "100%",
  },

  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  headerActions: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  headerButtonPrimary: {
    flex: 1,
    padding: "0.7rem 1rem",
    fontSize: "0.95rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  headerButton: {
    flex: 1,
    padding: "0.7rem 1rem",
    fontSize: "0.95rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#1f2937",
    color: "white",
    cursor: "pointer",
  },

  headerStatus: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#888",
  },
};

const pivotStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    width: "25ch",
    fontFamily: "monospace",
    fontSize: "clamp(3rem, 8vw, 5rem)",
    fontWeight: 600,
  },

  left: {
    width: "12ch",
    textAlign: "right",
  },

  pivot: {
    width: "1ch",
    color: "#ef4444",
    textAlign: "center",
  },

  right: {
    width: "12ch",
    textAlign: "left",
  },
};
