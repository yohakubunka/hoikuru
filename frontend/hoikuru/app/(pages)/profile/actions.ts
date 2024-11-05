"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const updateProfileAction = async (
    {userName}:{userName:string}
) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('profiles').insert({
        userName:userName,
    })

    if (error) {
        console.error('Error updating exam collection:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
}