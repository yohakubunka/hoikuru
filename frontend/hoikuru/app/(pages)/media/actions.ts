"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function fetchMediaList() {
    // ルートディレクトリ ("") のファイルを取得。
    // created_at の降順 (desc) でソート。
    const { data, error } = await supabase.storage.from("media").list("", {
        sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
        throw new Error("メディアリストの取得に失敗しました。")
    }
    // data から不要な項目を除外
    // フォルダと .emptyFolderPlaceholder を除外
    // || [] で data が undefined の場合は 空配列 を返す。
    const filteredData =
        data?.filter((item) => item.name !== ".emptyFolderPlaceholder" && item.metadata?.mimetype !== null) || []

    return filteredData
}
//  upload action
// クライアントから File オブジェクトを受け取る。
// 引数 file は File 型（ブラウザの File API）。
export async function createMedia(file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    // なぜランダムな名前にするのか？
    // ファイルの重複を防ぐ（同じ名前のファイルを上書きしないため）。
    // セキュリティ上の理由（元のファイル名を隠す）。 

    // supabase.storage.from("media").upload(fileName, file) でfileName の名前で file をアップロードする。
    const { error: uploadError, data } = await supabase.storage.from("media").upload(fileName, file)

    if (uploadError) {
        throw new Error("ファイルのアップロードに失敗しました。")
    }

    revalidatePath("/")
    return data
}
// delete action
// 削除するファイルの path を受け取る。
export async function deleteMedia(path: string) {
    // supabase.storage.from("media").remove([path]) で指定された path のファイルを削除。
    const { error } = await supabase.storage.from("media").remove([path])

    if (error) {
        throw new Error("メディアの削除に失敗しました。")
    }

    revalidatePath("/")
}

