"use server";
import { createClient } from "@/utils/supabase/server";

// users情報を更新する関数
export const updateUserAction = async ({ email }: { email: string }) => {
    const supabase = await createClient();

    // 認証情報を取得
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました', error: userError };
    }

    const userId = userMeta.user.id; // ユーザーIDを取得

    // users テーブルの情報を更新
    const { error: userUpdateError } = await supabase
        .from('users')
        .update({ email })
        .eq('id', userId);

    if (userUpdateError) {
        console.error('Error updating user:', userUpdateError);
        return { status: false, message: 'ユーザー情報の更新に失敗しました', error: userUpdateError };
    }

    return { status: true, message: 'ユーザー情報を更新しました' };
};

// プロフィール情報を更新する関数
export const updateProfileAction = async (
    { email, }: { email: string; }
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
        })
        .eq('user_id', userMeta.user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError);
        return { status: false, message: profileError.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
};


// 施設管理者情報を更新する関数
export const updateFacilityAdmins = async (
    { first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell }: {
        first_name?: string | null;
        last_name?: string | null;
        first_name_kana?: string | null;
        last_name_kana?: string | null;
        post_code?: number | null;
        address?: string | null;
        tell?: number | null;
    }
) => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: '施設管理者情報の取得に失敗しました' };
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
            tell
        })
        .eq('user_id', userMeta.user.id);

    if (facilityAdminsError) {
        console.error('Error updating facility_admins:', facilityAdminsError);
        return { status: false, message: facilityAdminsError.message };
    }
    return { status: true, message: '施設管理者を更新しました' };
};

// 保護者情報を更新する関数
export const updateFacilityMember = async (
    { first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell }: {
        first_name?: string | null;
        last_name?: string | null;
        first_name_kana?: string | null;
        last_name_kana?: string | null;
        post_code?: number | null;
        address?: string | null;
        tell?: number | null;
    }
) => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: '保護者情報の取得に失敗しました' };
    }
    const { error: facilityMemberError } = await supabase
        .from('facility_members')
        .update({
            first_name,
            last_name,
            first_name_kana,
            last_name_kana,
            post_code,
            address,
            tell
        })
        .eq('user_id', userMeta.user.id);

    if (facilityMemberError) {
        console.error('Error updating facility_admins:', facilityMemberError);
        return { status: false, message: facilityMemberError.message };
    }
    return { status: true, message: '保護者情報を更新しました' };
};


// 施設情報を更新する関数
export const updateFacilities = async (
    { facility_name, post_code, address, tell }: {
        facility_name?: string | null;
        post_code?: string | null;
        address?: string | null;
        tell?: string | null;
    }
) => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();
    if (userError || !userMeta.user) {
        return { status: false, message: '施設情報の取得に失敗しました' };
    }
    const userFacilityId = userMeta.user.facility_id; // ユーザーの facility_id を取得
    const { error: facilitiesError } = await supabase
        .from('facilities')
        .update({
            facility_name,
            post_code,
            address,
            tell
        })
        .eq("id", userFacilityId)
        .single();
    console.log(userFacilityId)
    if (facilitiesError) {
        console.error('Error updating facilities:', facilitiesError);
        return { status: false, message: facilitiesError.message };
    }
    return { status: true, message: '施設情報を更新しました' };
};