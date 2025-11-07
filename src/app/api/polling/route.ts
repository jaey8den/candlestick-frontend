"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    const task_id = req.nextUrl.searchParams.get("task_id");
    const res = await fetch(
      "https://jaey8den-candlestick-matcher-backend.hf.space/status/" + task_id
    );
    const data = await res.json();

    if (data.status !== "completed") {
      return NextResponse.json({
        status: data.status,
      });
    } else {
      const { pattern, score, image } = data.result;
      return NextResponse.json({
        status: data.status,
        image: `data:image/jpg;base64,${image}`,
        name: pattern_dict[pattern as keyof typeof pattern_dict],
        similarity: score,
      });
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
