import { SyntheticEvent, useContext, useState } from "react"
import { axiosInstance } from "../../utils/api";
import { ERROR_MSG_SERVER_CONNECT_FAIL } from "../../utils/commonErrorMessage";
import { NotificationContext } from "../Notification/Notification";

export const UserInfoEditor = () => {
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");
    const [btnHandle, setBtnHandle] = useState(false);
    const [hint, setHint] = useState("");
    const { addMessage } = useContext(NotificationContext);

    const checkPwd = () => {
        setBtnHandle(false);
        if (password == "" && password_confirm == "") {
            setHint("");
            return;
        }

        if (password.length < 6) {
            setHint("パスワードが6桁以上が必要です");
            return;
        }

        setHint("");

        if (password !== password_confirm && password_confirm !== "") {
            setHint("パスワードが一致しません");
            return;
        }

        if (password == password_confirm && password !== "" && password_confirm !== "") {
            setBtnHandle(true);
        }
    }

    const updatePassword = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (btnHandle != true) {
            return;
        }

        await axiosInstance.put("/admin/users/password", {
            password,
            password_confirm
        }).then(() => {
            addMessage("パスワードが更新されました", true);
        }).catch(e => {
            addMessage(ERROR_MSG_SERVER_CONNECT_FAIL, false);
        })

        setBtnHandle(false);
        setHint("");
        setPassword("");
        setPasswordConfirm("");
    }

    return (
        <div className="p-4 w-full md:w-fit rounded-xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-500">
            <form className="w-full md:w-fit">
                <div className="md:items-center">
                    <h2 className="block text-center mb-1 md:mb-0 text-xl font-bold">パスワード設定</h2>
                </div>
                <div className="md:flex md:items-center mt-2">
                    <div className="md:w-1/3">
                        <label className="block md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                            新パスワード
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" placeholder="******************" onChange={(e) => setPassword(e.target.value)} onKeyUp={checkPwd} />
                    </div>
                </div>
                <div className="md:flex md:items-center mt-2">
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
                    <div className="md:w-1/3">
                    </div>
                    <div className="md:w-2/3">
                        {hint !== "" ? <span className="text-red-600 font-bold text-sm">{hint}</span> : null}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-2">
                    <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={updatePassword}>
                        アップデート
                    </button>
                </div>
            </form >
        </div >
    )
}