"use server";
import { createClient } from "@/utils/supabase/server";

export const updatePassword = async (
  { currentPassword, newPassword, newPasswordConfirm }: { currentPassword: string; newPassword: string, newPasswordConfirm: string }
) => {
  const supabase = await createClient();

  // ログインしているユーザーを取得
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user || !user.email) { // user.email が undefined でないことを確認
    console.error("ユーザー情報の取得に失敗:", userError);
    return { status: false, message: "ユーザー情報の取得に失敗しました" };
  }

  // 現在のパスワードでサインインして確認
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) {
    // サインイン失敗時の処理
    console.log("現在のパスワードの確認に失敗:", signInError);
    return { status: false, message: "現在のパスワードが正しくありません" };
  } else {
    // サインイン成功時の処理
    console.log("現在のパスワードの確認に成功");
  }

  if (newPasswordConfirm === newPassword) {
    // 新しいパスワードの設定
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      console.error("パスワード更新エラー:", updateError);
      return { status: false, message: updateError.message };
    }
  } else {
    console.log("確認用パスワードが一致しません。");
    return { status: false, message: "確認用パスワードが一致しません。" };
  }



  return { status: true, message: "パスワードが正常に更新されました" };
};
