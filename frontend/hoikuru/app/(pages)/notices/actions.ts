"use server";

import { createClient  } from "@/utils/supabase/server";

export const insertNoticeAction = async (
    { first_name, last_name, first_name_kana, last_name_kana, tell, post_code, address, email, password,facility_id }: { first_name: string, last_name: string, first_name_kana: string, last_name_kana: string, tell: string, post_code: string, address: string, email: string, password: string,facility_id:string }
) => {

    const supabase = await createClient();



    const { data: admin_data, error: admin_error } = await supabase.from('notice').insert({
        title: first_name,
        contnt: last_name,
        thumbnail_url: first_name_kana,
        publish: publish,
    })


    if (admin_error) {
        console.error('Error updating exam collection:', admin_error);
        return { status: false, message: admin_error.message };
    }

    return { status: true, message: '施設管理者が追加されました。' };
}

// 施設編集処理を追加
export const updateNoticeAction = async ({ id, first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell,facility_id }: { id: any, first_name: string, last_name: string, first_name_kana: string, last_name_kana: string, post_code: string, address: string, tell: string ,facility_id:string}
) => {
    const supabase = await createClient();

const { data, error } = await supabase
    .from('notice')
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
    .eq('id', id.facility_admin_id);


    return { data, error };
};

// 施設情報の取得
export const selectNoticesAction = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notice')
        .select(`
            *,
            facilities (facility_name)
        `)
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching facility admins:", error);
        return false;
    }

    return data.map((item) => ({
        ...item,
        facility_name: item.facilities?.facility_name || "未設定",
    }));
}

// 施設情報の取得
export const selectNoticeAction = async ({ facility_admin_id }: { facility_admin_id: number }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('notice').select().eq('id', facility_admin_id).single();

    if (error) {
        return false;
    }

    return data;
}

// 施設削除
export const deleteNoticeAction = async (facility_admin_id: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notice')
        .delete()
        .eq('id', facility_admin_id

        ); // IDに一致する施設を削除

    if (error) {
        console.error('施設管理者削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が削除されました。' };
};