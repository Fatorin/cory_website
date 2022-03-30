import { Loading } from "./Loading";

export default function FullPageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loading text={"Loading..."} />
        </div>
    );
}