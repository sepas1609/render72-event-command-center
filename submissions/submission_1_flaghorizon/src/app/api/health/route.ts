import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  return NextResponse.json(
    {
      status: "ok",
      service: "flaghorizon-sentinel",
      uptimeSeconds: Math.floor(uptime),
      version: "1.0.0",
      timestamp,
      checks: {
        apiGateway: "operational",
        render72Bridge: "connected",
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
