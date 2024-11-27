
import { createClient } from "@/utils/supabase/server";
import AdminForms from "./adminForms";
import FacilityAdminsForm from "./facilityAdminsForm";
import MembersForm from "./membersForm";
import FacilityForm from "./facilityForm";

export default async function profile() {
    const supabase = await createClient();
    const { data: userMeta, error: userError } = await supabase.auth.getUser();

    // userError が true である、または userMeta.user が存在しない場合
    if (userError || !userMeta.user) {
        return { status: false, message: 'ユーザー情報の取得に失敗しました' };
    }

    const { data: profileData, error: profileError } = await supabase.from('profiles').select().eq('user_id', userMeta.user.id).single();

    // const {data: profile} = supabase.from('profiles').select().eq('user_id', user.data.user?.id).single()
    // ロール:1 サービス管理者（余白）
    if (profileData.role == 1) {
        return (
            <>
                <div>
                    <AdminForms />
                </div>
            </>
        )
    }
    // ロール:2 施設管理者
    if (profileData.role == 2) {
        return (
            <>
                <div>
                    <FacilityAdminsForm />
                </div>
                <div>
                    <FacilityForm />
                </div>
            </>
        )
    }
    // ロール:3　保護者
    if (profileData.role == 3) {
        return (
            <>
                <div>
                    <MembersForm />
                </div>
            </>
        )
    }
  
    return (
        <>
            <div>
                <p>アカウント情報が正しくありません</p>
            </div>
        </>
    );
}
