"use server";

import Replicate, { Prediction } from "replicate";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { waitUntil } from "@vercel/functions";

export async function uploadAgePredict(previousState: any, formData: FormData) {
  const replicate = new Replicate({
    // get your token from https://replicate.com/account
    auth: process.env.REPLICATE_API_TOKEN || "",
  });

  // Authenticate
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const user_id = user?.id;
  if (!user_id) return { message: "Please sign in to continue", status: 401 };

  // get image
  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400 };
  }

  const buffer = await image.arrayBuffer();

  const supabaseAdmin = createAdminClient();

  const { data: storageData, error: storageError } = await supabaseAdmin.storage
    .from("temp")
    .upload(`/${user_id}/${nanoid()}`, buffer, {
      contentType: image.type,
      cacheControl: "3600",
      upsert: true,
    });
  if (storageError)
    return {
      message: "Unexpected error uploading image, please try again",
      status: 400,
    };

  try {
    const prediction = await replicate.predictions.create({
      version:
        "0c3080879f50097e4f7847c68a22d9586fd69196bed06239b85688d02c93d2eb",
      input: {
        image: `https://zufrwdcmaojotovkjeww.supabase.co/storage/v1/object/public/temp/${storageData?.path}`,
      },
    });

    if (
      prediction.error ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return { message: "Prediction error generating age", status: 500 };
    }

    const get = prediction.urls.get;
    const output = pollExtrapolate({ url: get, timeout: 5000 });
    waitUntil(deleteImage({ path: storageData?.path }));
    return output;
  } catch (e) {
    console.log("e", e);
    return {
      message: "Unexpected error generating age, please try again",
      status: 500,
    };
  }
}

async function deleteImage({ path }: { path: string }) {
  const supabaseAdmin = createAdminClient();
  await supabaseAdmin.storage.from("temp").remove([path]);
}

async function pollExtrapolate({
  url,
  timeout,
}: {
  url: string;
  timeout: number;
}) {
  const startTime = new Date().getTime();

  for (let i = 0; ; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      const data: Prediction = await response.json();
      if (data.status === "succeeded") {
        return {
          message: `You look like you are ${data.output} years old.`,
          status: 200,
        };
      }
    } catch (error) {
      return { message: "Unexpected error occurred", status: 500 };
    }

    // Check for timeout
    const currentTime = new Date().getTime();
    if (currentTime - startTime > timeout) {
      return { message: "Function timed out", status: 504 };
    }

    // Wait 0.5 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
