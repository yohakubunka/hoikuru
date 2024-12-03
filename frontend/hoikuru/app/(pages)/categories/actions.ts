"use server";

import { createClient  } from "@/utils/supabase/server";

export const insertCategorieAction = async (
    { name }: { name: string }
) => {
    const supabase = await createClient();

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

    if (login_data?.role !== 2) {
        console.error('User does not have the required role.');
        return { status: false, message: "このアカウントには追加権限がありません。" };
    }
        // ログイン中のユーザーの profiles テーブルの role を確認
        const { data:facility_admin_data, error: facility_admin_error } = await supabase
        .from('facility_admins')
        .select('facility_id')
        .eq('user_id', user.id)
        .single(); // 一つだけ取得する

    const { data: category_data, error: category_error } = await supabase.from('categories').insert({
        name:name,
        facility_id : facility_admin_data?.facility_id
    })


    if (category_error) {
        console.error('Error updating exam collection:', category_error);
        return { status: false, message: category_error.message };
    }

    return { status: true, message: 'カテゴリーが追加されました。' };
}

// 施設編集処理を追加
export const updateCategorieAction = async ({id,name}:{id:any,name:string}
) => {
const supabase = await createClient();
const { data, error } = await supabase
    .from('categories')
    .update({
        name:name,
    })
    .eq('id', id.category_id);
    console.log("data:",data);
    console.log("error:",error);

    return { data, error };
};

// 施設情報の取得
export const selectCategoriesAction = async () => {
    const supabase = await createClient();

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
    
        if (login_data?.role !== 2) {
            console.error('User does not have the required role.');
            return { status: false, message: "このアカウントには追加権限がありません。" };
        }
            // ログイン中のユーザーの profiles テーブルの role を確認
            const { data:facility_admin_data, error: facility_admin_error } = await supabase
            .from('facility_admins')
            .select('facility_id')
            .eq('user_id', user.id)
            .single(); // 一つだけ取得する

            const { data: categories_data, error: categories_error } = await supabase
            .from('categories')
            .select('*')
            .eq('facility_id', facility_admin_data?.facility_id)
            .order('id', { ascending: true });
          
          if (categories_error) {
            console.error('Error fetching categories:', categories_error);
          } else {
            console.log('Fetched categories:', categories_data);
          }

    return categories_data;
}

// 施設情報の取得
export const selectCategoryAction = async ({ category_id }: { category_id: string }) => {
    const supabase = await createClient();
    
    const { data, error } = await supabase.from('categories').select().eq('id', category_id).single();
    
    if (error) {
        return false;
    }
    

    return data;
}

// 施設削除
export const deleteCategorieAction = async (category_id: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category_id

        ); // IDに一致する施設を削除


    if (error) {
        console.error('カテゴリー削除時のエラー:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: 'カテゴリーが削除されました。' };
};