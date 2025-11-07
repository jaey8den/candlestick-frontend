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
      "https://jaey8den-candlestick-matcher-backend.hf.space/match-pattern/",
      {
        method: "POST",
        body: forwardForm,
      }
    );

    console.log("Response received from backend. Status:", response.status);

    const data = await response.json();

    return NextResponse.json({
      task_id: data.task_id,
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
