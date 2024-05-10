import { createAdminClient } from "@/lib/supabase/admin";
import { subDays } from "date-fns";

export async function POST(req: Request) {
  // Authorize request
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = createAdminClient();

  // get ids to delete from storage
  const { data: ids, error: idsError } = await supabase
    .from("data")
    .select("id")
    .lte("created_at", subDays(new Date(), 1).toISOString());
  if (idsError)
    return new Response("Unable to get ids from data table", { status: 500 });

  // delete from storage
  const toDelete = ids.map((obj) => obj.id);
  const { error: storageError } = await supabase.storage
    .from("data")
    .remove(toDelete);
  if (storageError)
    return new Response("Unable to remove data images from storage", {
      status: 500,
    });

  // delete from table
  const { count, error } = await supabase
    .from("data")
    .delete()
    .lte("created_at", subDays(new Date(), 1).toISOString());
  if (error)
    return new Response(`An error occured: ${error.message}`, { status: 500 });

  return new Response(`${count} rows and images cleaned up`, { status: 200 });
}
