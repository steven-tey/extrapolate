import Navbar from "./navbar";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { User } from "@/lib/types";

export default async function Nav() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .returns<User[]>()
    .single();

  return <Navbar user={user} />;
}
