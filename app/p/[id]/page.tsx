import { getPlaiceholder } from "plaiceholder";
import { DataProps } from "@/lib/types";
import PhotoPage from "@/components/photo-page";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// export const revalidate = 1;

// export async function generateStaticParams() {
//   return [];
// }

async function getData(id: string) {
  const input = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/data/${id}`;

  // TODO: error handling
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("data")
    .select("*")
    .eq("id", id)
    .returns<DataProps[]>()
    .single();

  const buffer = await fetch(input).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );
  const { base64: blurDataURL } = await getPlaiceholder(buffer);

  return {
    input,
    blurDataURL,
    data,
  };
}

export default async function Photo({ params }: { params: { id: string } }) {
  const { id } = params;
  const { input, blurDataURL, data: fallbackData } = await getData(id);

  return (
    <PhotoPage
      id={id}
      input={input}
      blurDataURL={blurDataURL}
      data={fallbackData}
    />
  );
}
