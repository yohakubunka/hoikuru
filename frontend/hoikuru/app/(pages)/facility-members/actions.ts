"use server";

import { createClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from "@/utils/supabase/server";

export const insertFacilityMemberAction = async (
    { first_name, last_name, first_name_kana, last_name_kana, tell, post_code, address, email, password,facility_id }: { first_name: string, last_name: string, first_name_kana: string, last_name_kana: string, tell: string, post_code: string, address: string, email: string, password: string,facility_id:string }
) => {
    const supabaseMember = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const supabase = await createSupabaseClient();


    // ログイン中のユーザー情報を取得
    const { data, error: userError } = await supabase.auth.getUser();

    // ユーザー情報が取得できない場合
    if (userError) {
        console.error("ユーザー情報の取得に失敗。:", userError?.message);
        return { status: false, message: userError.message };
    }
    const user = data.user;

    if (!user || !user.id) {
        console.error("User ID is undefined");
        return { status: false, message: "ユーザーIDが不明です。" };
    }

    // ログイン中のユーザーの profiles テーブルの role を確認
    const { data: login_data, error: login_error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single(); // 一つだけ取得する


    if (login_error) {
        console.error('Error fetching login data:', login_error.message);

        return { status: false, message: "ログインに失敗しました。" };
    }

    if (login_data?.role !== 1) {
        console.error('User does not have the required role.');
        return { status: false, message: "このアカウントには追加権限がありません。" };
    }

    const { data: user_data, error: user_error } = await supabaseMember.auth.admin.createUser({
        password: password,
        email: email,
        email_confirm: true, // メール認証をスキップ
    });

    // エラーチェック
    if (user_error) {
        console.error('Sign-up error:', user_error.message);
        return { status: false, message: "既に同じメールアドレスのユーザーが登録されています" };
    }

    // user_data.user を確認
    if (!user_data?.user) {
        console.error('Sign-up failed: No user data returned.');
        return { status: false, message: "登録に失敗しました" };
    }

    // ユーザーIDを取得
    const userId = user_data.user.id;
    console.log(userId);

    const { data: profile_data, error: profile_error } = await supabase.from('profiles').insert({
        user_id: userId,
        role: 2,
        name: email,
    })

    if (profile_error) {
        console.error('Error updating exam collection:', profile_error);
        return { status: false, message: profile_error.message };
    }

    const { data: member_data, error: member_error } = await supabase.from('facility_members').insert({
        first_name: first_name,
        last_name: last_name,
        first_name_kana: first_name_kana,
        last_name_kana: last_name_kana,
        tell: tell,
        post_code: post_code,
        address: address,
        user_id: userId,
        facility_id:facility_id,
    })


    if (member_error) {
        console.error('Error updating exam collection:', member_error);
        return { status: false, message: member_error.message };
    }

    return { status: true, message: '施設管理者が追加されました。' };
}

// 施設編集処理を追加
export const updateFacilityMemberAction = async ({ id, first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell,facility_id }: { id: any, first_name: string, last_name: string, first_name_kana: string, last_name_kana: string, post_code: string, address: string, tell: string ,facility_id:string}
) => {
const supabase = await createSupabaseClient();
const { data, error } = await supabase
    .from('facility_members')
    .update({
        first_name: first_name,
        last_name: last_name,
        first_name_kana: first_name_kana,
        last_name_kana: last_name_kana,
        post_code: post_code,
        address: address,
        tell: tell,
        facility_id:facility_id,
    })
    .eq('id', id.facility_member_id);
    console.log("data:",data);
    console.log("error:",error);

    return { data, error };
};

// 施設情報の取得
export const selectFacilityMembersAction = async () => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from('facility_members')
        .select(`
            *,
            facilities (facility_name)
        `)
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching facility members:", error);
        return false;
    }

    return data.map((item) => ({
        ...item,
        facility_name: item.facilities?.facility_name || "未設定",
    }));
}

// 施設情報の取得
export const selectFacilityMemberAction = async ({ facility_member_id }: { facility_member_id: number }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase.from('facility_members').select().eq('id', facility_member_id).single();

    if (error) {
        return false;
    }

    return data;
}

// 施設削除
export const deleteFacilityMemberAction = async (facility_member_id: number) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from('facility_members')
        .delete()
        .eq('id', facility_member_id

        ); // IDに一致する施設を削除

    if (error) {
        console.error('施設管理者削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が削除されました。' };
};