import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [fraunces, interRegular, interSemiBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Fraunces-SemiBold.woff")),
    readFile(join(process.cwd(), "assets/fonts/Inter-Regular.woff")),
    readFile(join(process.cwd(), "assets/fonts/Inter-SemiBold.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px 100px",
          backgroundColor: "#0b0d12",
          color: "#f2efe9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#fb923c",
              marginRight: 14,
            }}
          />
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#fb923c",
            }}
          >
            Full-Stack Developer
          </div>
        </div>

        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: 118,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginTop: 30,
          }}
        >
          Chunlin He
        </div>

        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: 1.5,
            color: "rgba(242,239,233,0.68)",
            marginTop: 32,
            maxWidth: 860,
          }}
        >
          Full-stack products end to end — Next.js interfaces backed by
          real databases, auth, and APIs.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interSemiBold, weight: 600, style: "normal" },
      ],
    }
  );
}
