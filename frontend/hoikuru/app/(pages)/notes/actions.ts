"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const insertNoteAction = async (
    {content, title}:{content:string | undefined | null, title:string}
) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('notes').insert({
        title:title,
        content:content
    })

    if (error) {
        console.error('Error updating exam collection:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: 'Noteが追加されました。' };
}