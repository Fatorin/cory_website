import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { StepViewer } from "../components/StepViewer";
import { AppTextSetting, APP_TEXT_RULE } from "../utils/commonTextSetting";

const Rule: NextPage = () => {
    return (
        <Layout>
            <StepViewer title="配信のお約束" editorType={AppTextSetting[APP_TEXT_RULE]} />
        </Layout>
    )
}

export default Rule;
