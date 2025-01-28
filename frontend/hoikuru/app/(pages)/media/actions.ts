"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function fetchMediaList() {
    const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

    if (error) {
        throw new Error("メディアリストの取得に失敗しました。")
    }

    return data
}

export async function createMedia(title: string, file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file)

    if (uploadError) {
        throw new Error("ファイルのアップロードに失敗しました。")
    }

    const { error } = await supabase.from("media").insert({ title: title, file_path: fileName })

    if (error) {
        throw new Error("メディアの保存に失敗しました。")
    }

    revalidatePath("/")
}

export async function updateMedia(id: number, title: string, file?: File) {
    let filePath = ""

    if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file)

        if (uploadError) {
            throw new Error("ファイルのアップロードに失敗しました。")
        }

        filePath = fileName
    }

    const { error } = await supabase
        .from("media")
        .update({ title: title, ...(filePath && { file_path: filePath }) })
        .eq("id", id)

    if (error) {
        throw new Error("メディアの更新に失敗しました。")
    }

    revalidatePath("/")
}

export async function deleteMedia(id: number) {
    const { error } = await supabase.from("media").delete().eq("id", id)

    if (error) {
        throw new Error("メディアの削除に失敗しました。")
    }

    revalidatePath("/")
}

