"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type FormState = {
  message: string;
  status: number;
};

export async function deleteAccount(prevState: FormState, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const supabaseAdmin = createAdminClient();

  const confirmation = formData.get("deleteConfirmation") as string;
  if (confirmation !== "delete my account")
    return {
      message: `Confirmation failed`,
      status: 400,
    };

  // get user object
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError)
    return {
      message: `Unable to get user object: ${userError.message}`,
      status: 400,
    };
  if (!user) return { message: `Unable to get user object`, status: 400 };

  // delete user input storage items
  const { error: storageInputError } = await supabaseAdmin.storage
    .from("input")
    .remove([`${user.id}`]);
  if (storageInputError)
    return {
      message: `Unable to delete user input images: ${storageInputError.message}`,
      status: 400,
    };

  // delete user output storage items
  const { error: storageOutputError } = await supabaseAdmin.storage
    .from("output")
    .remove([`${user.id}`]);
  if (storageOutputError)
    return {
      message: `Unable to delete user output images: ${storageOutputError.message}`,
      status: 400,
    };

  // delete user data
  const { error } = await supabase.from("data").delete().eq("user_id", user.id);

  // delete user
  const { data: deleteData, error: deleteError } =
    await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error)
    return {
      message: `Unable to delete user: ${deleteError?.message}`,
      status: 400,
    };

  return {
    message: `Successfully deleted account for ${deleteData.user?.email}. Sign out or refresh the page`,
    status: 200,
  };
}
