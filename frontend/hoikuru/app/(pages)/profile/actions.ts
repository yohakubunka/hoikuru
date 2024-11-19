"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";


// 認証ユーザー情報を取得する共通関数
// const getAuthenticatedUser = async (supabase: any) => {
//     const { data: userMeta, error } = await supabase.auth.getUser();
//     if (error || !userMeta.user) {
//         return { user: null, error: 'ユーザー情報の取得に失敗しました' };
//     }
//     return { user: userMeta.user, error: null };
// };


// ユーザーのプロフィール情報（メールアドレスと電話番号）を更新するための非同期関数。
export const updateProfileAction = async (
    { email, tellNum}: { email: string; tellNum?: string; }
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
// ユーザーの施設管理者情報を更新するための非同期関数。
export const updateFacilityAdmins = async (
    { first_name, last_name, first_name_kana, last_name_kana, post_code, address, tel }: { first_name?: string; last_name?: string;  first_name_kana?: string; last_name_kana?: string; post_code?:string; address?:string; tel?:number}
) => {
    const supabase = await createClient();

    // 認証情報が取得できなかった場合
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { error: facilityAdminsError } = await supabase
        .from('facility_admins')
        .update({
           first_name,
            last_name,
            first_name_kana,
            last_name_kana,
            post_code,
            address,
            tel
        })
        .eq('user_id', userMeta.user.id);

    if (facilityAdminsError) {
        console.error('Error updating profile:', facilityAdminsError);
        return { status: false, message: facilityAdminsError.message };
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

// ユーザープロフィールを取得する関数で、データが不足している場合には、自動的にメールアドレスや電話番号を更新します。
export const selectFacilityAdmins = async () => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();

    // userError が true である、または userMeta.user が存在しない場合
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { data: facilityAdminsData, error: facilityAdminsError } = await supabase
        .from('facility_admins')
        .select()
        .eq('user_id', userMeta.user.id)
        .single();

    if (facilityAdminsError) {
        console.error('Error fetching profile:', facilityAdminsError);
        return false;
    }

    let updated = false;

    // メールが空の場合、ユーザーの認証情報からメールアドレスを取得してデータベースを更新。
    if (facilityAdminsData && !facilityAdminsData.first_name) {
        await supabase.from('facility_admins').update({
            first_name: userMeta.user.first_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    // 電話番号が空の場合、ユーザーの認証情報から電話番号を取得してデータベースを更新。
    if (facilityAdminsData && !facilityAdminsData.last_name && userMeta.user.last_name) {
        await supabase.from('facility_admins').update({
            last_name: userMeta.user.last_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    // 更新した場合は最新のデータを取得
    if (updated) {
        const { data } = await supabase
            .from('facility_admins')
            .select()
            .eq('user_id', userMeta.user.id)
            .single();
        return data;
    }

    return facilityAdminsData;
};