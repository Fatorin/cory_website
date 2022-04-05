import { NextPage } from "next";
import StepEditor from "../components/Editor/StepEditor";
import Layout from "../components/Layout";
import { AppTextSetting, APP_TEXT_JOINWAY, APP_TEXT_RULE } from "../utils/appTextSetting";

const JoinWay: NextPage = () => {
    return (
        <Layout>
            <StepEditor title="参加型の説明" editorType={AppTextSetting[APP_TEXT_JOINWAY]} />
        </Layout>
    )
}

export default JoinWay;