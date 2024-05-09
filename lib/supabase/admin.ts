import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types_db";

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
