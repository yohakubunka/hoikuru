import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import supabase from '@/lib/supabase'

const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
        // 画像が選択されていないのでreturn
        return
    }
    const file = event.target.files[0] // 選択された画像を取得
    const filePath = `media/${file.name}` // 画像の保存先のpathを指定
    const { error } = await supabase.storage
        .from('media')
        .upload(filePath, file)
    if (error) {
        // ここでエラーハンドリング
    }

    // publicなバケットに画像が保存されている場合
    const { data } = supabase.storage.from('media').getPublicUrl(filePath)
    const imageUrl = data.publicUrl

    // 画像のURLをDBに保存
    const { error: databaseError } = await supabase
        .from('media')
        .insert({ imageUrl: imageUrl })
}

export default function MediaUpload() {
    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" onChange={handleImageChange} />
            </div>
        </>
    );
}