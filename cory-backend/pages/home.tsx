import { NextPage } from "next"
import { useState } from "react";
import BaseComponent from "../components/Editor/BaseComponent";
import Layout from "../components/Layout"
import { HOME_COMPONENT_AD, HOME_COMPONENT_AVATAR, HOME_COMPONENT_LOGO } from "../utils/commonSetting";

const Home: NextPage = () => {
    const [view, setView] = useState(0);
    const ControlView = () => {
        switch (view) {
            case 0:
                return (<BaseComponent type={HOME_COMPONENT_LOGO} name={"ロゴ"} height={350} width={1000} limit={1} />);
            case 1:
                return (<BaseComponent type={HOME_COMPONENT_AVATAR} name={"キャラ"} height={900} width={720} limit={3} />);
            case 2:
                return (<BaseComponent type={HOME_COMPONENT_AD} name={"広告"} height={240} width={320} limit={3} urlOption={true} />);
            default:
                return null;
        }
    }

    return (
        <Layout>
            <h1 className="text-6xl py-4 text-center">ホーム設定</h1>
            <div className="flex flex-wrap justify-center gap-4">
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(0)}>ロゴ設定</button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(1)}>キャラ設定</button>
                <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(2)}>広告設定</button>
            </div>
            <div className="flex justify-center items-center">
                <ControlView />
            </div>
        </Layout>
    )
}

export default Home;