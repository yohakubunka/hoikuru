"use server";

import { createClient } from "@/utils/supabase/server";

export const insertNoticeAction = async (
    { title, content, thumbnail_url, publish }:
        { title: string; content: string; thumbnail_url: string; publish: boolean; }
) => {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("ユーザー情報の取得に失敗。:", userError.message);
        return { status: false, message: userError.message };
    }

    const user = userData.user;
    if (!user || !user.id) {
        console.error("User ID is undefined");
        return { status: false, message: "ユーザーIDが不明です。" };
    }

    // facility_admins から facility_id を取得
    const { data: adminData, error: adminError } = await supabase
        .from("facility_admins")
        .select("facility_id")
        .eq("user_id", user.id);

    if (adminError) {
        console.error("facility_admins のクエリエラー:", adminError);
    }

    // facility_members から facility_id を取得
    const { data: memberData, error: memberError } = await supabase
        .from("facility_members")
        .select("facility_id")
        .eq("user_id", user.id);

    if (memberError) {
        console.error("facility_members のクエリエラー:", memberError);
    }

    // adminData と memberData を統合して facility_id を取得
    const facilityIds = [
        ...(adminData?.map((row) => row.facility_id) || []),
        ...(memberData?.map((row) => row.facility_id) || []),
    ];

    // 複数の facility_id が取得される場合に備えた処理
    if (facilityIds.length === 0) {
        console.error("facility_id が見つかりませんでした");
    } else {
        console.log("取得した facility_id:", facilityIds);
    }

    const facilityId = facilityIds[0];

    // `notices` テーブルにデータを挿入
    const { data: noticeData, error: noticeError } = await supabase
        .from("notices")
        .insert({
            title,
            content,
            thumbnail_url,
            publish,
            facility_id: facilityId, // 取得した facility_id を追加
            create_user_id: user.id,
            update_user_id: user.id,
        })
        .select();


    if (noticeError) {
        console.error("Error inserting notice:", noticeError);
        return { status: false, message: noticeError.message };
    }

    if (noticeData && noticeData.length > 0) {
        const newNoticeId = noticeData[0].id;
        return { status: true, id: newNoticeId, message: "投稿が追加されました。" };
    }

    return { status: false, message: "投稿の挿入に失敗しました。" };
};


// 施設編集処理を追加
export const updateNoticeAction = async ({ id, title, content, thumbnail_url, publish, category_id, tag_id }: { id: any, title: string, content: string, thumbnail_url: string, publish: boolean, category_id: string[], tag_id: string[] }
) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notices')
        .update({
            title: title,
            publish: publish,
            content: content,
            thumbnail_url: thumbnail_url,
        })
        .eq('id', id);

    // 現在のカテゴリ情報を削除
    const { error: deleteError } = await supabase
        .from('notice_categories')
        .delete()
        .eq('notice_id', id);


    // 新しいカテゴリ情報を挿入
    const insertData = category_id.map((category) => ({
        notice_id: id,
        category_id: category,
    }));

    const { data: categoryData, error: categoryError } = await supabase
        .from('notice_categories')
        .insert(insertData);


    // 現在のカテゴリ情報を削除
    const { error: tagsDeleteError } = await supabase
        .from('notice_tags')
        .delete()
        .eq('notice_id', id);


    // 新しいカテゴリ情報を挿入
    const insertTagData = tag_id.map((tag) => ({
        notice_id: id,
        tag_id: tag,
    }));

    const { data: tagData, error: tagError } = await supabase
        .from('notice_tags')
        .insert(insertTagData);



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

    const { error: categoriesError } = await supabase
        .from("notice_categories")
        .delete()
        .eq("notice_id", notice_id);

    if (categoriesError) {
        return {
            status: false,
            message: `カテゴリー削除エラー: ${categoriesError.message}`,
        };
    }

    const { error: tagsError } = await supabase
        .from("notice_tags")
        .delete()
        .eq("notice_id", notice_id);

    if (tagsError) {
        return {
            status: false,
            message: `タグ削除エラー: ${tagsError.message}`,
        };
    }


    const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', notice_id

        ); // IDに一致する施設を削除

    if (error) {
        console.error('投稿削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '投稿が削除されました。' };
};

export const fetchCategoriesByNoticeId = async (noticeId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("notice_categories")
        .select("category_id")
        .eq("notice_id", noticeId);

    if (error) throw new Error(error.message);

    // 配列に変換
    return data.map((record) => record.category_id);
};

export const fetchTagsByNoticeId = async (noticeId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("notice_tags")
        .select("tag_id")
        .eq("notice_id", noticeId);

    if (error) throw new Error(error.message);

    // 配列に変換
    return data.map((record) => record.tag_id);
};

export const uploadImageToSupabase = async (file:any) => {

const supabase = await createClient();

// multiバイトでエラーが出るのでミリ秒まで名前にする uuidの使用
const fileName = `${Date.now()}-${file.name}`;

// Promiseを返却
return supabase.storage
  .from("notice_thumbnails") // ストレージバケット名
  .upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })
  .then(({ data, error }) => {
    if (error) {
      throw new Error(error.message); // エラーの場合は例外をスロー
    }

    // URLを生成して返却
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/notice_thumbnails/${fileName}`;
  });
  }
