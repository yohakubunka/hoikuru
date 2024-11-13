"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const updateProfileAction = async (
    // 型定義
    { email, tellNum }: { email: string; tellNum: string; },
   
) => {
    const supabase = await createClient();
    // ログイン中のユーザー情報を取得
    const { data: userMeta } = await supabase.auth.getUser();
    // 
    const { data: profileData, error: profileError } = await supabase.from('profiles').update({
        email: email,
        tellNum: tellNum,
    }).eq('user_id', userMeta.user.id)//user_id が userMeta.user.id と等しいデータのみを取得する

    if (profileError) {
        console.error('Error updating exam collection:', profileError);
        return { status: false, message: profileError.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
}

export const selectProfileAction = async (

) => {
    const supabase = await createClient();
    const { data: userMeta } = await supabase.auth.getUser();// ログイン中のユーザー情報を取得

    // .single　配列から外に出して取得　1件だけ
    const { data: profileData, error: profileError } = await supabase.from('profiles').select().eq('user_id', userMeta.user.id).single()

    if (profileData && !profileData.email) {
        const { data, error } = await supabase.from('profiles').update({
            email: userMeta.user.email,
        }).eq('user_id', userMeta.user.id).select().single()
        return data
    }
      // `tellnum` が空の場合は、`tellNum` を更新
      if (profileData && !profileData.tellNum && userMeta.user.tellNum) {
        const { data, error } = await supabase.from('profiles').update({
                tellNum: userMeta.user.tellNum,
            }).eq('user_id', userMeta.user.id).select().single();
        return data;
    }

    if (profileError) {
        return false
    }

    return profileData
}