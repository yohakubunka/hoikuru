
import { createClient } from "@/utils/supabase/server";
import Forms from "./forms";
export default async function profile() {
    const supabase = await createClient();

    return (
        <>
            <div>
                <Forms />
            </div>
        </>
    );
}
