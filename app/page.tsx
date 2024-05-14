import HomePage from "@/components/home-page";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const revalidate = 60;

async function getCount() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { count } = await supabase
    .from("data")
    .select("*", { count: "estimated", head: true });
  return count;
}

export default async function Home() {
  const count = await getCount();

  return <HomePage count={count} />;
}
