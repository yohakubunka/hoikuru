"use server";

import { createClient } from "@/utils/supabase/server";

export const insertNoticeAction = async (
    { title, content, thumbnail_url, publish }: { title: string, content: string, thumbnail_url: string, publish: boolean, }
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
        create_user_id: user?.id,
        update_user_id: user?.id,
    }).select();



    if (notice_error) {
        console.error("Error inserting notice:", notice_error);
        return { status: false, message: notice_error.message };
    }

    if (notice_data && notice_data.length > 0) {
        const newNoticeId = notice_data[0].id;
        return { status: true, id: newNoticeId, message: "投稿が追加されました。" };
    }

    return { status: false, message: "投稿の挿入に失敗しました。" };

}

// 施設編集処理を追加
export const updateNoticeAction = async ({ id, title, content, thumbnail_url, publish }: { id: any, title: string, content: string, thumbnail_url: string, publish: boolean, }
) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notices')
        .update({
            title: title,
            publish: publish,
            content: content,
        })
        .eq('id', id);

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
export const selectNoticeAction = async ({ notice_id }: { notice_id: string }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('notices').select().eq('id', notice_id).single();

    if (error) {
        return false;
    }

    return data;
}

// 施設削除
export const deleteNoticeAction = async (notice_id: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', notice_id

        ); // IDに一致する施設を削除

    if (error) {
        console.error('施設管理者削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が削除されました。' };
};