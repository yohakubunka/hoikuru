"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const insertFacilityAction = async (
    { facility_name, tell, post_code, address }: { facility_name: string, tell: string, post_code: string, address: string, }
) => {
    const supabase = await createClient();


    const { data, error } = await supabase.from('facilities').insert({
        facility_name: facility_name,
        tell: tell,
        post_code: post_code,
        address: address,
    })

    if (error) {
        console.error('Error updating exam collection:', error);
        return { status: false, message: error.message };
    }

    return { status: true, message: '施設が追加されました。' };
}

// 施設編集処理を追加
export const updateFacilityAction = async ({id,facility_name,post_code,address,tell}:{id:any,facility_name:string,post_code:string,address:string,tell:string}
) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('facilities')
        .update({
            facility_name:facility_name,
            post_code:post_code,
            address:address,
            tell:tell,
        })
        .eq('id', id.facility_id); // 指定したIDの施設を更新
        console.log("data:",data);
        console.log("error:",error);

    return { data, error };
};

// 施設情報の取得
export const selectFacilitiesAction = async () => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facilities').select('*').order('id', { ascending: true });

    if (error){
        return false;
    }

    return data;
}

// 施設情報の取得
export const selectFacilityAction = async ({facility_id}: {facility_id:number}) => {
    const supabase = await createClient();

    const {data,error} = await supabase.from('facilities').select().eq('id',facility_id).single();

    if (error){
        return false;
    }

    return data;
}

// 施設削除
export const deleteFacilityAction = async (facility_id: number) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', facility_id); // IDに一致する施設を削除

    if (error) {
      console.error('施設削除時のエラー:', error);
      return { status: false, message: error.message };
    }

    return { status: true, message: '施設が削除されました。' };
  };