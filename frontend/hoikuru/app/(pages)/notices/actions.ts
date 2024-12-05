"use server";

import { createClient  } from "@/utils/supabase/server";

export const insertNoticeAction = async (
    { title, content, thumbnail_url, publish }: { title: string, content: string, thumbnail_url: string, publish: boolean,  }
) => {

    const supabase = await createClient();
   const { data, error: userError } = await supabase.auth.getUser();

   if (userError) {
       console.error("ユーザー情報の取得に失敗。:", userError?.message);
       return { status: false, message: userError.message };
   }
   const user = data.user;

   if (!user || !user.id) {
       console.error("User ID is undefined");
       return { status: false, message: "ユーザーIDが不明です。" };
   }
    
    
    const { data: notice_data, error: notice_error } = await supabase.from('notices').insert({
        title: title,
        content: content,
        thumbnail_url: thumbnail_url,
        publish: publish,
        create_user_id: user?.id, // ログインユーザーのIDを設定
        update_user_id: user?.id, // ログインユーザーのIDを設定
    }).select();



    if (notice_error) {
        console.error("Error inserting notice:", notice_error);
        return { status: false, message: notice_error.message };
      }
    
      if (notice_data && notice_data.length > 0) {
        const newNoticeId = notice_data[0].id; // 挿入されたレコードのIDを取得
        return { status: true, id: newNoticeId, message: "投稿が追加されました。" };
      }
    
      return { status: false, message: "投稿の挿入に失敗しました。" };

}

// 施設編集処理を追加
export const updateNoticeAction = async ({ id, first_name, last_name, first_name_kana, last_name_kana, post_code, address, tell,facility_id }: { id: any, first_name: string, last_name: string, first_name_kana: string, last_name_kana: string, post_code: string, address: string, tell: string ,facility_id:string}
) => {
    const supabase = await createClient();

const { data, error } = await supabase
    .from('notices')
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
        .from('notices')
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

    const { data, error } = await supabase.from('notices').select().eq('id', facility_admin_id).single();

    if (error) {
        return false;
    }

    return data;
}

// 施設削除
export const deleteNoticeAction = async (facility_admin_id: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', facility_admin_id

        ); // IDに一致する施設を削除

    if (error) {
        console.error('施設管理者削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が削除されました。' };
};