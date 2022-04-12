import { NextPage } from "next";
import StepEditor from "../components/Editor/StepEditor";
import Layout from "../components/Layout";
import { AppTextSetting, APP_TEXT_RULE } from "../utils/commonSetting";

const Rule: NextPage = () => {
    return (
        <Layout>
            <StepEditor title="配信のお約束" editorType={AppTextSetting[APP_TEXT_RULE]} />
        </Layout>
    )
}

export default Rule;