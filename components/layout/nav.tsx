import Navbar from "./navbar";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Nav() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Navbar user={user} />;
}
