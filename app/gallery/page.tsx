import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { GalleryPage } from "@/components/gallery-page";

export default async function Gallery() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data } = await supabase
    .from("data")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", session?.user.id || "");

  return <GalleryPage data={data} />;
}
