"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const updateProfileAction = async (
    {email}:{email:string}
) => {
    const supabase = await createClient();
    const {data: userMeta} = await supabase.auth.getUser();


    const { data: profileData, error: profileError } = await supabase.from('profiles').update({
        email:email,
    }).eq('user_id', userMeta.user.id)


    if (profileError) {
        console.error('Error updating exam collection:', profileError);
        return { status: false, message: profileError.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
}

export const selectProfileAction = async (

) => {
    const supabase = await createClient();
    const {data: userMeta} = await supabase.auth.getUser();
// .single　配列から外に出して取得　1件だけ
    const { data: profileData, error: profileError } = await supabase.from('profiles').select().eq('user_id', userMeta.user.id).single()

    if(profileData && !profileData.email) {
        const {data, error} = await supabase.from('profiles').update({
            email: userMeta.user.email
        }).eq('user_id', userMeta.user.id).select().single()

        return data
    }

    console.log(profileData)

    if(profileError) {
        return false
    }

    return profileData
}