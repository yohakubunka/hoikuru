import AddForm from "./add-form"
import { Note, columns } from "./columns"
import { DataTable } from "./data-table"
import { createClient } from "@/utils/supabase/server";



export default async function page() {

    const supabase = await createClient();

    const {data} = await supabase.from('notes').select()

    return (
        <>
        <div className="w-screen">
        <div className="m-8 w-full">
            <AddForm />
        </div>

        <div className="m-8 w-full">
        <DataTable columns={columns} data={data} />
        </div>
        </div>
        </>
    )
}