"use server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const pattern_dict = {
    hammer: "Hammer",
    bullish_marubozu: "Bullish Marubozu",
    bullish_engulfing: "Bullish Engulfing",
    tweezer_bottom: "Tweezer Bottom",
    tws: "Three White Soldiers",
    mds: "Morning Doji Star",
    shooting_star: "Shooting Star",
    bearish_marubozu: "Bearish Marubozu",
    bearish_engulfing: "Bearish Engulfing",
    tweezer_top: "Tweezer Top",
    tbc: "Three Black Crows",
    eds: "Evening Doji Star",
  };
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File uploaded.");

    const forwardForm = new FormData();
    forwardForm.append("file", file);

    console.log("Forwarding request to backend...");

    const response = await fetch(
      "https://jaey8den-candlestick-matcher-backend.hf.space/match-pattern/",
      {
        method: "POST",
        body: forwardForm,
      }
    );

    console.log("Response received from backend. Status:", response.status);

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const patternName = response.headers.get("Pattern");
    const similarity = response.headers.get("Score");

    return NextResponse.json({
      image: `data:image/jpg;base64,${base64}`,
      patternName: pattern_dict[patternName as keyof typeof pattern_dict],
      similarity,
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
