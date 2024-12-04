"use server";
import { createClient } from "@/utils/supabase/server";

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
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }
    const userId = userMeta.user.id; // ユーザーの facility_id を取得
    const { data: facilityAdminData, error: facilityAdminError } = await supabase
        .from("facility_admins")
        .select("*")
        .eq("user_id", userId)
        .single()

    if (facilityAdminData && facilityAdminData.length !== 0) {
        const facilityId = facilityAdminData.facility_id; // ユーザーの facility_id を取得
        const { data: facilityIdData, error: facilityIdError } = await supabase
            .from('facilities')
            .update({
                facility_name,
                post_code,
                address,
                tell
            })
            .eq("id", facilityId)
       
        if (facilityIdError) {
            console.error('Error updating facilities:', facilityIdError);
            return { status: false, message: facilityIdError.message };
        }
        return { status: true, message: '施設情報を更新しました' };
    }
};


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

