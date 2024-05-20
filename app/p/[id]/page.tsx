import PhotoPage from "@/app/p/[id]/photo-page";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// export const revalidate = 1;

// export async function generateStaticParams() {
//   return [];
// }

async function getData(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("data")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return notFound();

  return data;
}

export default async function Photo({ params }: { params: { id: string } }) {
  const { id } = params;
  const fallbackData = await getData(id);

  return <PhotoPage id={id} data={fallbackData} />;
}
