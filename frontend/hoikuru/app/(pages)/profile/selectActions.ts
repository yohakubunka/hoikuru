"use server";
import { createClient } from "@/utils/supabase/server";

// プロフィール情報を取得する関数
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

// 施設管理者情報を取得する関数
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
        console.error('Error fetching facility_admins:', facilityAdminsError);
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
    if (facilityAdminsData && !facilityAdminsData.last_name) {
        await supabase.from('facility_admins').update({
            last_name: userMeta.user.last_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.first_name_kana) {
        await supabase.from('facility_admins').update({
            first_name_kana: userMeta.user.first_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.last_name_kana) {
        await supabase.from('facility_admins').update({
            last_name_kana: userMeta.user.last_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.post_code) {
        await supabase.from('facility_admins').update({
            post_code: userMeta.user.post_code
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.address) {
        await supabase.from('facility_admins').update({
            address: userMeta.user.address
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityAdminsData && !facilityAdminsData.tell) {
        await supabase.from('facility_admins').update({
            tell: userMeta.user.tell
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

// 施設管理者情報を取得する関数
export const selectFacilityMember = async () => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();

    // userError が true である、または userMeta.user が存在しない場合
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { data: facilityMembersData, error: facilityMembersError } = await supabase
        .from('facility_members')
        .select()
        .eq('user_id', userMeta.user.id)
        .single();

    if (facilityMembersError) {
        console.error('Error fetching facility_members:', facilityMembersError);
        return false;
    }
    let updated = false;

    // メールが空の場合、ユーザーの認証情報からメールアドレスを取得してデータベースを更新。
    if (facilityMembersData && !facilityMembersData.first_name) {
        await supabase.from('facilityfacility_members_admins').update({
            first_name: userMeta.user.first_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.last_name) {
        await supabase.from('facility_members').update({
            last_name: userMeta.user.last_name
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.first_name_kana) {
        await supabase.from('facility_members').update({
            first_name_kana: userMeta.user.first_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.last_name_kana) {
        await supabase.from('facility_members').update({
            last_name_kana: userMeta.user.last_name_kana
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.post_code) {
        await supabase.from('facility_members').update({
            post_code: userMeta.user.post_code
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.address) {
        await supabase.from('facility_members').update({
            address: userMeta.user.address
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    if (facilityMembersData && !facilityMembersData.tell) {
        await supabase.from('facility_members').update({
            tell: userMeta.user.tell
        }).eq('user_id', userMeta.user.id);
        updated = true;
    }
    // 更新した場合は最新のデータを取得
    if (updated) {
        const { data } = await supabase
            .from('facility_members')
            .select()
            .eq('user_id', userMeta.user.id)
            .single();
        return data;
    }

    return facilityMembersData;
};

// 施設情報を取得する関数
export const selectFacilities = async () => {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();

    // userError が true である、または userMeta.user が存在しない場合
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }
    const userId = userMeta.user.id; // ユーザーの facility_id を取得
    const { data: facilityAdminData, error: facilityAdminError } = await supabase
    .from("facility_admins")
    .select("*")
    .eq("user_id", userId)
    .single();

    if ( facilityAdminData && facilityAdminData.length !== 0 ) {
        const facilityId = facilityAdminData.facility_id; // ユーザーの facility_id を取得
        const { data: facilityIdData, error: facilityIdError } = await supabase
            .from("facilities")
            .select("*")
            .eq("id", facilityId)
            .single();
            if (facilityIdError) {
                console.error('Error fetching facilities:', facilityIdError);
                return false;
            }
            let updated = false;
        
            if (facilityIdData && !facilityIdData.facility_name) {
                await supabase.from('facilities').update({
                    facility_name: userMeta.user.facility_name
                }).eq("id", facilityIdData);
                updated = true;
            }
            if (facilityIdData && !facilityIdData.post_code) {
                await supabase.from('facilities').update({
                    post_code: userMeta.user.post_code
                }).eq("id", facilityIdData);
                updated = true;
            }
            if (facilityIdData && !facilityIdData.address) {
                await supabase.from('facilities').update({
                    address: userMeta.user.address
                }).eq("id", facilityIdData);
                updated = true;
            }
            if (facilityIdData && !facilityIdData.tell) {
                await supabase.from('facilities').update({
                    tell: userMeta.user.tell
                }).eq("id", facilityIdData);
                updated = true;
            }
            // 更新した場合は最新のデータを取得
            if (updated) {
                const { data } = await supabase
                    .from("facilities")
                    .select("*")
                    .eq("id", facilityIdData)
                    .single();
                return data;
            }
        
            return facilityIdData;
    }
    


};

