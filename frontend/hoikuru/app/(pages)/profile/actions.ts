"use server";
import { createClient } from "@/utils/supabase/server";

// ユーザー認証情報を取得する共通関数
const getAuthenticatedUser = async (supabase: ReturnType<typeof createClient>) => {
    const { data: userMeta, error } = await supabase.auth.getUser();
    if (error || !userMeta.user) {
        return { user: null, error: 'ユーザー情報の取得に失敗しました' };
    }
    return { user: userMeta.user, error: null };
};


// ユーザーのプロフィール情報（メールアドレスと電話番号）を更新するための非同期関数。
export const updateProfileAction = async (
    { email}: { email: string| null; }
) => {
    const supabase = await createClient();

    // 認証情報が取得できなかった場合
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) {
        return { status: false, message: error };
    }
   
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            email,
        })
        .eq('user_id', user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError);
        return { status: false, message: profileError.message };
    }

    return { status: true, message: 'プロフィールを更新しました' };
};
// ユーザーの施設管理者情報を更新するための非同期関数。
export const updateFacilityAdmins = async (
    { first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell }: { first_name?: string| null; last_name?: string| null;  first_name_kana?: string| null; last_name_kana?: string| null; post_code?:number| null; address?:string| null; tell?:number| null}
) => {
    const supabase = await createClient();

    // 認証情報が取得できなかった場合
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) {
        return { status: false, message: error };
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
        .eq('user_id', user.id);

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
        console.error('Error fetching profile', profileError);
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
        console.error('Error fetching profile:aaaaaa', facilityAdminsError);
        return false;
    }

    let updated = false;

    if (facilityAdminsData && !facilityAdminsData.first_name) {
        await supabase.from('facility_admins').update({
            first_name: userMeta.user.first_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    if (facilityAdminsData && !facilityAdminsData.last_name && userMeta.user.last_name) {
        await supabase.from('facility_admins').update({
            last_name: userMeta.user.last_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.first_name_kana) {
        await supabase.from('facility_admins').update({
            first_name: userMeta.user.first_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }

    if (facilityAdminsData && !facilityAdminsData.last_name_kana && userMeta.user.last_name_kana) {
        await supabase.from('facility_admins').update({
            last_name_kana: userMeta.user.last_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.post_code && userMeta.user.post_code) {
        await supabase.from('facility_admins').update({
            post_code: userMeta.user.post_code
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.address && userMeta.user.address) {
        await supabase.from('facility_admins').update({
            post_code: userMeta.user.post_code
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.tell && userMeta.user.tell) {
        await supabase.from('facility_admins').update({
            tel: userMeta.user.tel
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