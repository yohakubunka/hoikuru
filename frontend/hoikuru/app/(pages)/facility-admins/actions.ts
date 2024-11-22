"use server";

import { createClient } from "@/utils/supabase/server";

export const insertFacilityAdminAction = async (
    { first_name,last_name,first_name_kana,last_name_kana, tell, post_code, address,email,password }: { first_name: string,last_name: string,first_name_kana: string,last_name_kana: string, tell: string, post_code: string, address: string,email:string,password:string, }
) => {
    const supabase = await createClient();

    const { data: user_data, error :user_error} = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    // エラーチェック
    if (user_error) {
        console.error('Sign-up error:', user_error.message);
        throw new Error(user_error.message); 
    }

    // user_data.user を確認
    if (!user_data?.user) {
        console.error('Sign-up failed: No user data returned.');
        throw new Error('Failed to create user. Please try again.');
    }

    // ユーザーIDを取得
    const userId = user_data.user.id;
    console.log(userId);

    const { data:profile_data, error:profile_error } = await supabase.from('profiles').insert({
        user_id: userId,
        role: 2,
        name: email,
    })

    if (profile_error) {
        console.error('Error updating exam collection:', profile_error);
        return { status: false, message: profile_error.message };
    }

    const { data:admin_data, error:admin_error } = await supabase.from('facility_admins').insert({
        first_name: first_name,
        last_name: last_name,
        first_name_kana: first_name_kana,
        last_name_kana: last_name_kana,
        tell: tell,
        post_code: post_code,
        address: address,
        user_id: userId,
    })
    


    if (admin_error) {
        console.error('Error updating exam collection:', admin_error);
        return { status: false, message: admin_error.message };
    }

    return { status: true, message: '施設管理者が追加されました。' };
}

// 施設編集処理を追加
export const updateFacilityAdminAction = async ({id,first_name,last_name,first_name_kana,last_name_kana,post_code,address,tell}:{id:number,first_name:string,last_name:string,first_name_kana:string,last_name_kana:string,post_code:string,address:string,tell:string}
) => {
    const supabase = await createClient();


    const { data, error } = await supabase
        .from('facility_admins')
        .update({
            first_name:first_name,
            last_name:last_name,
            first_name_kana:first_name_kana,
            last_name_kana:last_name_kana,
            post_code:post_code,
            address:address,
            tell:tell,
        })
        .eq('id', id.facility_member_id); // 指定したIDの施設を更新
        console.log("data:",data);
        console.log("error:",error);

    return { data, error };
};

// 施設情報の取得
export const selectFacilityAdminsAction = async () => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facility_admins').select('*').order('id', { ascending: true });

    if (error){
        return false;
    }

    return data;
}

// 施設情報の取得
export const selectFacilityAdminAction = async ({facility_member_id}: {facility_member_id:number}) => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facility_admins').select().eq('id',facility_member_id).single();

    if (error){
        return false;
    }

    return data;
}

// 施設削除
export const deleteFacilityAdminAction = async (facility_member_id: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', facility_member_id); // IDに一致する施設を削除

    if (error) {
      console.error('施設管理者削除時のエラー:', error);
      return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が削除されました。' };
  };