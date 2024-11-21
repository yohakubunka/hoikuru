"use server";

import { createClient } from "@/utils/supabase/server";

export const insertFacilityAction = async (
    { first_name,last_name,first_name_kana,last_name_kana, tel, post_code, address }: { first_name: string,last_name: string,first_name_kana: string,last_name_kana: string, tel: string, post_code: string, address: string, }
) => {
    const supabase = await createClient();


    const { data, error } = await supabase.from('facility_admins').insert({
        first_name: first_name,
        last_name: last_name,
        first_name_kana: first_name_kana,
        last_name_kana: last_name_kana,
        tel: tel,
        post_code: post_code,
        address: address,
    })

    if (error) {
        console.error('Error updating exam collection:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設管理者が追加されました。' };
}

// 施設編集処理を追加
export const updateFacilityAction = async ({id,first_name,last_name,first_name_kana,last_name_kana,post_code,address,tel}:{id:number,first_name:string,last_name:string,first_name_kana:string,last_name_kana:string,post_code:string,address:string,tel:string}
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
            tel:tel,
        })
        .eq('id', id.facility_member_id); // 指定したIDの施設を更新
        console.log("data:",data);
        console.log("error:",error);

    return { data, error };
};

// 施設情報の取得
export const selectFacilitiesAction = async () => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facility_admins').select('*').order('id', { ascending: true });

    if (error){
        return false;
    }

    return data;
}

// 施設情報の取得
export const selectFacilityAction = async ({facility_member_id}: {facility_member_id:number}) => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facility_admins').select().eq('id',facility_member_id).single();

    if (error){
        return false;
    }

    return data;
}

// 施設削除
export const deleteFacilityAction = async (facility_member_id: number) => {
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