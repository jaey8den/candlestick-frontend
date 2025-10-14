"use server";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching health check...");
    const res = await fetch(
      "https://jaey8den-candlestick-matcher-backend.hf.space/healthcheck/"
    );
    console.log("Health check responded");
    return NextResponse.json({ status: res.status });
  } catch (err: unknown) {
    console.log("Health check error");
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
