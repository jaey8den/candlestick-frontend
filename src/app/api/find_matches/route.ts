"use server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
      "https://candlestick-backend-s54n.onrender.com/match-pattern/",
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
    const coords = response.headers.get("Coords");
    const similarity = response.headers.get("Score");

    return NextResponse.json({
      image: `data:image/jpg;base64,${base64}`,
      patternName,
      coords,
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
