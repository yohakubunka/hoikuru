"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function fetchMediaList() {
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Fetch error:", error)
    throw new Error(`メディアリストの取得に失敗しました: ${error.message}`)
  }

  return data
}

export async function createMedia(file: File) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    // ストレージにファイルをアップロード
    const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`)
    }

    // データベースにレコードを作成
    const { error: dbError } = await supabase.from("media").insert([{ file_path: fileName }])

    if (dbError) {
      // ロールバック：ストレージからファイルを削除
      await supabase.storage.from("media").remove([fileName])
      console.error("Database error:", dbError)
      throw new Error(`データベースへの保存に失敗しました: ${dbError.message}`)
    }

    revalidatePath("/")
  } catch (error) {
    // 予期せぬエラーの処理
    console.error("Unexpected error:", error)
    throw error
  }
}

export async function deleteMedia(id: number, filePath: string) {
  try {
    // ストレージからファイルを削除
    const { error: storageError } = await supabase.storage.from("media").remove([filePath])

    if (storageError) {
      console.error("Storage delete error:", storageError)
      throw new Error(`ファイルの削除に失敗しました: ${storageError.message}`)
    }

    // データベースからレコードを削除
    const { error: dbError } = await supabase.from("media").delete().eq("id", id)

    if (dbError) {
      console.error("Database delete error:", dbError)
      throw new Error(`データベースからの削除に失敗しました: ${dbError.message}`)
    }

    revalidatePath("/")
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

