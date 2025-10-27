"use client";

import { useState } from "react";
import Image from "next/image";

export default function Screenshot() {
  type MatchResult = {
    image: string;
    patternName: string | null;
    similarity: string | null;
    error: string | null;
  };

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/find_matches", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function checkHealth() {
    const res = await fetch("/api/health");
    const data = await res.json();
    alert(`Backend status: ${data.status}`);
  }

  return (
    <section id="screenshot" className="max-w-5xl mx-auto pt-8">
      <h2 className="text-3xl font-bold text-center">Upload Screenshot</h2>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row">
        <input
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="m-4 p-2 border border-gray-300 rounded"
          style={{ cursor: "pointer" }}
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="m-4 p-2 bg-blue-500 text-white rounded"
          style={{ cursor: "pointer" }}
        >
          {loading ? "Processing..." : "Find Matches"}
        </button>
      </form>
      {result &&
        (!result.error ? (
          <div className="mt-4">
            <h2>{result.patternName}</h2>
            <p>Score: {result.similarity}</p>
            <Image
              className="mt-4"
              src={result.image}
              alt="Matched Pattern"
              width={500}
              height={500}
            />
          </div>
        ) : (
          <div className="mt-4">
            <h2>Error</h2>
            <p>{result.error}</p>
          </div>
        ))}
      <button
        onClick={checkHealth}
        className="m-4 p-2 bg-gray-500 text-white rounded"
        style={{ cursor: "pointer" }}
      >
        Server Status
      </button>
    </section>
  );
}
