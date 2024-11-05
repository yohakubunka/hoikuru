"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as serviceCreateClient } from '@supabase/supabase-js';
import { stat } from "fs";

export const insertFacilityAction = async (
    { facility_name, tel, post_code, address }: { facility_name: string, tel: string, post_code: string, address: string, }
) => {
    const supabase = await createClient();

    
    const { data, error } = await supabase.from('facilities').insert({
        facility_name: facility_name,
        tel: tel,
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
export const updateFacilityAction = async (id: number, facilityData: {
    facility_name: string;
    post_code: string;
    address: string;
    tel: string;
}) => {
    const supabase = await createClient();
    

    const { data, error } = await supabase
        .from('facilities')
        .update(facilityData)
        .eq('id', id); // 指定したIDの施設を更新
        console.log(data);
        console.log(error);

    return { data, error };
};