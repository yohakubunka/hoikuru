import ChangeForm from "./change-form";
export default function changePassword() {
    return (
        <>
                    <div className="w-screen">
                <div className="m-8 w-full">
                    <h2>パスワード変更</h2>
                    <ChangeForm/>
                </div>

                <div className="m-8 w-full">
                </div>
            </div>
        </>
    );
}