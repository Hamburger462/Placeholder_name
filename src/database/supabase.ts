import { createClient } from "@supabase/supabase-js";
import { project_url, api_key } from "./supabase_secret";
// Create Supabase client
const supabase = createClient(project_url, api_key);
// Upload file using standard upload
export async function uploadFile(file: File, filePath: string) {
    const { error } = await supabase.storage
        .from("Media")
        .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from("Media")
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}
