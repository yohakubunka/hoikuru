"use server";
import { createClient } from "@/utils/supabase/server";

// 共通のユーザー認証情報取得関数
const getAuthenticatedUser = async (supabase: ReturnType<typeof createClient>) => {
    const { data: userMeta, error } = await supabase.auth.getUser();
    if (error || !userMeta.user) {
        return { user: null, error: 'ユーザー情報の取得に失敗しました' };
    }
    return { user: userMeta.user, error: null };
};


// updateTable関数|共通の更新関数
// データベーステーブルを更新するための汎用関数。
const updateTable = async (
    // ReturnType は TypeScript のユーティリティ型で、ある関数型の「戻り値の型」を取得します。
    // typeof は JavaScript および TypeScript の演算子で、変数や値の型を取得します。ただし、TypeScript では関数そのものの型を取得するためにも使用されます。
    supabase: ReturnType<typeof createClient>,
    tableName: string,
    // Record<string, any> は TypeScript のユーティリティ型で、特定の形式のオブジェクト型を定義するために使われます。 
    //Record<string, any> の場合：キーの型は string（文字列）。値の型は any（どんな型でもOK）。
    updates: Record<string, any>,
    userId: string
) => {
    const { error } = await supabase.from(tableName).update(updates).eq("user_id", userId);
    if (error) {
        console.error(`Error updating ${tableName}:`, error);
        return { status: false, message: error.message };
    }
    return { status: true, message: `${tableName}を更新しました` };
};

// プロフィール情報を更新する関数
export const updateProfileAction = async ({ email }: { email: string | null }) => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    return await updateTable(supabase, "profiles", { email }, user.id);
};

// プロフィール情報を取得する関数
export const selectProfileAction = async () => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };
    // Supabase の profiles テーブルから現在のユーザーのプロフィールを取得。
    //eq("user_id", user.id) で、user_id が現在のユーザーの ID と一致するデータを検索。
    //.single() を使うことで、1件のみ取得することを明示。
    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", user.id)
        .single();
    // データ取得に失敗した場合、エラーメッセージをログに記録し、エラーを返します。
    if (profileError) {
        console.error("Error fetching profile:", profileError);
        return { status: false, message: profileError.message };
    }

    // 必要ならプロフィールデータを更新
    const updates: Partial<typeof profileData> = {};
    //profileData.email が空の場合、user.email を使用して補完データ (updates) に追加。
    if (!profileData.email && user.email) updates.email = user.email;
    // 更新するフィールドがあるかどうか
    if (Object.keys(updates).length > 0) {
        // updateTable は汎用の更新関数で、指定したテーブル（profiles）のデータを更新します。
        //更新に失敗した場合は、エラーステータスを返して処理を終了。
        const updateResult = await updateTable(supabase, "profiles", updates, user.id);
        if (!updateResult.status) return updateResult;
        return await supabase.from("profiles").select().eq("user_id", user.id).single();
    }

    return profileData;
};

// 施設管理者情報を取得する関数
export const selectFacilityAdmins = async () => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    const { data: facilityAdminsData, error: facilityAdminsError } = await supabase
        .from("facility_admins")
        .select()
        .eq("user_id", user.id)
        .single();

    if (facilityAdminsError) {
        console.error("Error fetching facility admins:", facilityAdminsError);
        return { status: false, message: facilityAdminsError.message };
    }

    // 必要なら施設管理者データを更新
    const updates: Record<string, any> = {};
    const fields = ["first_name", "last_name", "first_name_kana", "last_name_kana", "post_code", "address", "tell"];
    fields.forEach((field) => {
        if (!facilityAdminsData[field] && user[field]) {
            updates[field] = user[field];
        }
    });

    if (Object.keys(updates).length > 0) {
        const updateResult = await updateTable(supabase, "facility_admins", updates, user.id);
        if (!updateResult.status) return updateResult;

        return await supabase.from("facility_admins").select().eq("user_id", user.id).single();
    }

    return facilityAdminsData;
};

// 施設管理者情報を更新する関数
export const updateFacilityAdmins = async (updates: {
    first_name?: string | null;
    last_name?: string | null;
    first_name_kana?: string | null;
    last_name_kana?: string | null;
    post_code?: number | null;
    address?: string | null;
    tell?: number | null;
}) => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    return await updateTable(supabase, "facility_admins", updates, user.id);
};

// 保護者情報を更新する関数
export const updateFacilityMember = async (updates: {
    first_name?: string | null;
    last_name?: string | null;
    first_name_kana?: string | null;
    last_name_kana?: string | null;
    post_code?: number | null;
    address?: string | null;
    tell?: number | null;
}) => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    return await updateTable(supabase, "facility_members", updates, user.id);
};

// 保護者アカウント情報を取得する関数
export const selectFacilityMember = async () => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    const { data: facilityMembersData, error: facilityMembersError } = await supabase
        .from("facility_members")
        .select()
        .eq("user_id", user.id)
        .single();

    if (facilityMembersError) {
        console.error("Error fetching facility_members:", facilityMembersError);
        return { status: false, message: facilityMembersError.message };
    }

    // 保護者アカウントデータを更新
    const updates: Record<string, any> = {};
    const fields = ["first_name", "last_name", "first_name_kana", "last_name_kana", "post_code", "address", "tell"];
    fields.forEach((field) => {
        if (!facilityMembersData[field] && user[field]) {
            updates[field] = user[field];
        }
    });

    if (Object.keys(updates).length > 0) {
        const updateResult = await updateTable(supabase, "facility_members", updates, user.id);
        if (!updateResult.status) return updateResult;

        return await supabase.from("facility_members").select().eq("user_id", user.id).single();
    }

    return facilityMembersData;
};

// 施設情報を更新する関数
export const updateFacilities = async (updates: {
    facility_name?: number | null;
    post_code?: number | null;
    address?: string | null;
    tell?: number | null;
}) => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    return await updateTable(supabase, "facilities", updates, user.id);
};

// 施設情報を取得する関数
export const selectFacilities = async () => {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    if (error || !user) return { status: false, message: error };

    const { data: FacilitiesData, error: FacilitiesError } = await supabase
        .from("facilities")
        .select()
        .eq("id", user.id)
        .single();

    if (FacilitiesError) {
        console.error("Error fetching facilities:", FacilitiesError);
        return { status: false, message: FacilitiesError.message };
    }

    // 保護者アカウントデータを更新
    const updates: Record<string, any> = {};
    const fields = ["facility_name", "post_code", "address", "tell"];
    fields.forEach((field) => {
        if (!FacilitiesData[field] && user[field]) {
            updates[field] = user[field];
        }
    });

    if (Object.keys(updates).length > 0) {
        const updateResult = await updateTable(supabase, "facilities", updates, user.id);
        if (!updateResult.status) return updateResult;

        return await supabase.from("facilities").select().eq("user_id", user.id).single();
    }

    return FacilitiesData;
};
