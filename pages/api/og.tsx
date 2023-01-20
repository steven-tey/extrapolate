/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const clash = fetch(
  new URL("../../styles/ClashDisplay-Semibold.otf", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [clashData] = await Promise.all([clash]);

  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Extrapolate";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(to bottom right, #D1FAE5 25%, #EFF6FF 50%, #FFE4E6 75%)",
        }}
      >
        <img
          src={new URL("../../public/logo.png", import.meta.url).toString()}
          alt="Extrapolate Logo"
          tw="w-20 h-20 mb-4 opacity-95"
        />
        <h1
          style={{
            fontSize: "100px",
            fontFamily: "ClashDisplay-Semibold",
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "SF Pro",
          data: clashData,
        },
      ],
    },
  );
}
