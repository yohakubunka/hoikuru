import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();

    // FormDataでファイルを取得
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = `${uuidv4()}_${file.name}`;

    try {
        // ファイルのストリームを送信
        const { data, error } = await supabase.storage
            .from("notice_thumbnails")
            .upload(fileName, file.stream(), {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type, // ファイルの MIME タイプを設定
                duplex: "half",
            });

        if (error) {
            console.error('Supabase upload error:', error); // エラー内容をコンソールに出力
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const publicUrl = supabase.storage
            .from("notice_thumbnails")
            .getPublicUrl(fileName);


        return NextResponse.json({ url: publicUrl.data.publicUrl }, { status: 200 });

    } catch (err) {
        console.error('Error during upload:', err); // 一般的なエラー内容をコンソールに出力
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
}
