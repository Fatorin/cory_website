import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { StepViewer } from "../components/StepViewer";
import { AppTextSetting, APP_TEXT_JOINWAY } from "../utils/commonTextSetting";

const JoinWay: NextPage = () => {
    return (
        <Layout>
            <StepViewer title="参加型の説明" editorType={AppTextSetting[APP_TEXT_JOINWAY]} />
        </Layout>
    )
}

export default JoinWay;