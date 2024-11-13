"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

// ユーザーのプロフィール情報（メールアドレスと電話番号）を更新するための非同期関数。
export const updateProfileAction = async (
    { email, tellNum }: { email: string; tellNum: string; }
) => {
    const supabase = await createClient();

    // 認証情報が取得できなかった場合
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            email,
            tellNum,
        })
        .eq('user_id', userMeta.user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError);
        return { status: false, message: profileError.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
};


// ユーザープロフィールを取得する関数で、データが不足している場合には、自動的にメールアドレスや電話番号を更新します。
export const selectProfileAction = async () => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    
    // userError が true である、または userMeta.user が存在しない場合
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', userMeta.user.id)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError);
        return false;
    }

    let updated = false;

    // メールが空の場合、ユーザーの認証情報からメールアドレスを取得してデータベースを更新。
    if (profileData && !profileData.email) {
        await supabase.from('profiles').update({
            email: userMeta.user.email
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    // 電話番号が空の場合、ユーザーの認証情報から電話番号を取得してデータベースを更新。
    if (profileData && !profileData.tellNum && userMeta.user.tellNum) {
        await supabase.from('profiles').update({
            tellNum: userMeta.user.tellNum
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    // 更新した場合は最新のデータを取得
    if (updated) {
        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('user_id', userMeta.user.id)
            .single();
        return data;
    }

    return profileData;
};