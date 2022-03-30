import axios, { AxiosError } from "axios";
import { SyntheticEvent, useState } from "react"
import { axiosInstance } from "../../utils/api";

export const UserInfoEditor = () => {
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");
    const [btnHandle, setBtnHandle] = useState(false);

    const checkPwd = () => {
        if (password.length <= 6) {
            //console.log("密碼長度過短");
        }

        if (password != password_confirm) {
            setBtnHandle(false);
            //console.log("密碼不一致");
            return;
        }
        setBtnHandle(true);
    }

    const updatePassword = async (e: SyntheticEvent) => {
        e.preventDefault();
        setBtnHandle(false);

        await axiosInstance.put("/admin/users/password", {
            password,
            password_confirm
        }).then(() => {
            console.log("update success");
        }).catch((e: Error | AxiosError) => {
            if (axios.isAxiosError(e)) {
                //handle.
                console.log(e);
            }
        })

        setBtnHandle(true);
    }

    return (
        <div className="p-4 w-fit rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-500">
            <form className="w-full max-w-sm">
                <div className="md:items-center mb-6">
                    <h2 className="block text-center mb-1 md:mb-0 text-xl font-bold">パスワード設定</h2>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                            新パスワード
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" placeholder="******************" onChange={(e) => setPassword(e.target.value)} onKeyUp={checkPwd} />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-confirm-password">
                            新パスワード（確認）
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-confirm-password" type="password" placeholder="******************" onChange={(e) => setPasswordConfirm(e.target.value)} onKeyUp={checkPwd} />
                    </div>
                </div>
                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={updatePassword} disabled={!btnHandle}>
                            アップデート
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}