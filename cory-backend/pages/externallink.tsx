import { NextPage } from "next"
import StepEditor from "../components/Editor/StepEditor";
import Layout from "../components/Layout"
import { AppTextSetting, APP_TEXT_JOINWAY } from "../utils/commonSetting";

const ExternalLink: NextPage = () => {
    return (
        <Layout>
            <StepEditor turnOnImageSelector={true} title="外部リンク" editorType={AppTextSetting[APP_TEXT_JOINWAY]} />
        </Layout>
    )
}

export default ExternalLink;