import type { NextPage } from 'next';
import { LanguageEditor } from '../components/Editor/LanguageEditor';
import { UserInfoEditor } from '../components/Editor/UserInfoEditor';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <LanguageEditor />
        <div className="p-2"></div>
        <UserInfoEditor />
      </Layout>
    </>
  )
}

export default Home;