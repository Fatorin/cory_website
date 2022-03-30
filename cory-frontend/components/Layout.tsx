import { Nav } from "./Nav";

export const Layout = (props: any) => {
    return (
        <>
            <div className="bg-gradient-to-b from-blue-200 to-cyan-400">
                <div className="absolute w-full h-full pointer-events-none">
                    <div className="absolute left-0 -top-12 h-3/5 min-w-full opacity-25 bg-repeat-x" style={{ backgroundImage: `url("/images/bg_up.png")` }} />
                    <div className="absolute right-0 bottom-0 h-2/5 min-w-full opacity-25 bg-repeat-x" style={{ backgroundImage: `url("/images/bg_down.png")` }} />
                </div>
                <Nav>{props.children}</Nav>
            </div>
        </>
    );
}