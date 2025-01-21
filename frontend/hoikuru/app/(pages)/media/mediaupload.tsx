'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
    // useFormを使用して、フォームの状態管理を行います。
    const { toast } = useToast()

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const handleUpload = async () => {
        if (!imageFile) {
            toast({
                title: '画像を選択してください',
                variant: "destructive",
            });
            return;
        }
        // ファイル名の生成:
        const fileName = `test/${Date.now()}-${imageFile.name}`;

        const { data, error } = await supabase.storage
            // 第1引数で保存先のパス（フォルダーを含むパス）を指定。
            // 第2引数でアップロードするFileオブジェクトを指定。
            .from('media') // バケット名を指定
            .upload(fileName, imageFile);
        // エラーハンドリング
        if (error) {
            console.error('Error uploading file:', error.message);
            // alert('アップロードに失敗しました');
            toast({

                title: 'アップロード失敗',
                description: error.message,
                variant: "destructive",
            });
        } else {
            // alert('アップロード成功！');
            console.log('Uploaded file data:', data);
            toast({
                title: 'アップロード成功',
                description: '画像が正常にアップロードされました。',

            });
        }
    };

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">画像アップロード</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={handleUpload}>アップロード</Button>

            </div>
        </>
    );
};

