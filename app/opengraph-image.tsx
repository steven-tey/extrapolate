/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getURL } from "@/lib/utils";

export const runtime = "edge";

// Image metadata
export const alt = "Extrapolate";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font
  const clash = fetch(
    new URL("@/styles/ClashDisplay-Semibold.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
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
          src={getURL("/logo.png")}
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
          {"Extrapolate"}
        </h1>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: "SF Pro",
          data: await clash,
        },
      ],
    },
  );
}
