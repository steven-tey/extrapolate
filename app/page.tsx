import HomePage from "@/components/home-page";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const revalidate = 60;

async function getCount() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // TODO: error handling
  const { count, error } = await supabase
    .from("data")
    .select("*", { count: "exact", head: true });
  return count;
}

export default async function Home() {
  const count = await getCount();

  return <HomePage count={count} />;
}
