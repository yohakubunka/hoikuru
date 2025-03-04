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
    // テーブル構造の確認
    const { data: tableInfo, error: tableError } = await supabase.from("media").select("*").limit(1)

    if (tableError) {
      console.error("Table check error:", tableError)
      throw new Error(`テーブル構造の確認に失敗しました: ${tableError.message}`)
    }

    // ストレージにファイルをアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage.from("media").upload(fileName, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`)
    }

    // データベースにレコードを作成
    const { data: insertData, error: dbError } = await supabase
      .from("media")
      .insert([
        {
          file_path: fileName,
        },
      ])
      .select()

    if (dbError) {
      // ロールバック：ストレージからファイルを削除
      await supabase.storage.from("media").remove([fileName])
      console.error("Database error:", dbError)
      throw new Error(`データベースへの保存に失敗しました: ${dbError.message}`)
    }

    revalidatePath("/")
    return insertData
  } catch (error) {
    // 予期せぬエラーの処理
    console.error("Unexpected error:", error)
    throw error
  }
}

export async function deleteMedia(id: number, filePath: string) {
  try {
    // データベースからレコードを削除
    const { error: dbError } = await supabase.from("media").delete().eq("id", id)

    if (dbError) {
      console.error("Database delete error:", dbError)
      throw new Error(`データベースからの削除に失敗しました: ${dbError.message}`)
    }

    // ストレージからファイルを削除
    const { error: storageError } = await supabase.storage.from("media").remove([filePath])

    if (storageError) {
      console.error("Storage delete error:", storageError)
      // Note: データベースからの削除は既に完了しているため、ここでは警告のみ
      console.warn("ストレージからのファイル削除に失敗しました（データベースからは削除済み）")
    }

    revalidatePath("/")
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

