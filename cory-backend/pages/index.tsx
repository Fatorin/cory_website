import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { LanguageEditor } from "../components/Editor/LanguageEditor";
import { UserInfoEditor } from "../components/Editor/UserInfoEditor";

const Index: NextPage = () => {
  return (
      <Layout>
          <LanguageEditor />
          <div className="p-2"></div>
          <UserInfoEditor />
      </Layout>
  )
}

export default Index;