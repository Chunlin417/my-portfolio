import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fraunces = await readFile(
    join(process.cwd(), "assets/fonts/Fraunces-SemiBold.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0d12",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontWeight: 600,
            fontSize: 98,
            color: "#f2efe9",
          }}
        >
          C
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fb923c",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, weight: 600, style: "normal" }],
    }
  );
}
