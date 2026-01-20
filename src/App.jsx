import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RSVPReader from "./RSVPReader";
import ScrollReader from "./ScrollReader";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";



pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";


export default function App() {
  const [text, setText] = useState(
    "Upload a PDF or EPUB to start reading."
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const savedText = localStorage.getItem("rsvp-text");
      const savedIndex = localStorage.getItem("rsvp-index");

    if (savedText) setText(savedText);
    if (savedIndex) setIndex(Number(savedIndex));
    } catch (err) {
      console.warn("Failed to restore saved state", err);
    }
  }, []);

  useEffect(() => {
    // Save only if there is meaningful text
    if (text && text.trim().length > 0) {

      try {
        localStorage.setItem("rsvp-text", text);
        localStorage.setItem("rsvp-index", String(index));
      } catch (err) {
        console.warn("LocalStorage full, cannot persist text", err);
      }
    }
  }, [text, index]);

  const words = text.trim().split(/\s+/);




  /* ======================
     File loading logic
     ====================== */



  async function loadEPUB(file) {
  try {
    console.time("EPUB load");

    const zip = await JSZip.loadAsync(file);

    let fullText = "";

    // EPUB text is usually in OEBPS or EPUB folders
    const xhtmlFiles = Object.keys(zip.files).filter(
      (name) =>
        name.endsWith(".xhtml") ||
        name.endsWith(".html") ||
        name.endsWith(".htm")
    );

    console.log("XHTML files found:", xhtmlFiles.length);

    for (const name of xhtmlFiles) {
      const raw = await zip.files[name].async("string");

      const text = raw
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      fullText += text + " ";
    }

    console.timeEnd("EPUB load");
    console.log("Extracted text length:", fullText.length);

    if (fullText.length < 100) {
      throw new Error("EPUB contains no readable text");
    }

    setText(fullText);
    setIndex(0);
  } catch (err) {
    console.error("EPUB parsing failed:", err);
    alert("Failed to load EPUB");
  }
}


  async function loadPDF(file) {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + " ";
    }

    setText(fullText);
    setIndex(0);
  }


  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      loadPDF(file);
    } else if (file.name.endsWith(".epub")) {
      loadEPUB(file);
    } else {
      alert("Unsupported file type");
    }
  }

  return (
    <Routes>
      <Route
        path="/reader"
        element={
          <RSVPReader
            words={words}
            index={index}
            setIndex={setIndex}
            handleFileUpload={handleFileUpload} // 👈 HERE
          />
        }
      />
      <Route
        path="/text"
        element={
          <ScrollReader
            words={words}
            index={index}
            setIndex={setIndex}
          />
        }
      />
      <Route path="*" element={<Navigate to="/reader" />} />
    </Routes>
  );
}
