import { NextPage } from "next";
import { useState } from "react";
import BaseComponent from "../components/Editor/BaseComponent";
import Layout from "../components/Layout";
import Introduction from "../components/Profile/Introduction";
import { PROFILE_COMPONENT_ICON } from "../utils/commonSetting";

const Profile: NextPage = () => {
    const [view, setView] = useState(0);
    const ControlView = () => {
        switch (view) {
            case 0:
                return (<Introduction />);
            case 1:
                return (<BaseComponent type={PROFILE_COMPONENT_ICON} name={"自己紹介イメージ"} height={256} width={256} limit={3} />);
            default:
                return null;
        }
    }

    return (
        <Layout>
            <h1 className="text-6xl py-4 text-center">プロフィール設定</h1>
            <div className="flex flex-wrap justify-center gap-4 my-4">
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(0)}>自己紹介設定</button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(1)}>アイコン設定</button>
            </div>
            <div className="flex justify-center items-center">
                <ControlView />
            </div>
        </Layout>
    )
}

export default Profile;