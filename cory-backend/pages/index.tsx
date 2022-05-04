import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { LanguageEditor } from "../components/Editor/LanguageEditor";
import { UserInfoEditor } from "../components/Editor/UserInfoEditor";
import { useState } from 'react';
import ImagerViewer from '../components/ImageManager/ImagerViewer';

const Index: NextPage = () => {
  const [view, setView] = useState(0);
  const ControlView = () => {
    switch (view) {
      case 0:
        return (<LanguageEditor />);
      case 1:
        return (<UserInfoEditor />);
      case 2:
        return (<ImagerViewer />);
      default:
        return  null;
    }
  }

  return (
    <Layout>
      <h1 className="text-6xl py-4 text-center">グローバル設定</h1>
      <div className="flex flex-wrap justify-center gap-4 my-4">
        <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(0)}>言語設定</button>
        <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(1)}>パスワード設定</button>
        <button className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={(e) => setView(2)}>イメージ管理</button>
      </div>
      <div className="flex justify-center items-center">
        <ControlView />
      </div>
    </Layout>
  )
}

export default Index;