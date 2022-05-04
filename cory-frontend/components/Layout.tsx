import { Nav } from "./Nav";
import Image from 'next/image'

export const Layout = (props: any) => {
    return (
        <div className="relative bg-gradient-to-b from-blue-50 to-cyan-400">
            <div className="absolute -top-24 opacity-25 pointer-events-none">
                <Image src="/images/bg_up.png" alt="logo" width={2048} height={382} layout="intrinsic" />
            </div>
            <div className="absolute bottom-0 opacity-25 pointer-events-none">
                <Image src="/images/bg_down.png" alt="logo" width={2048} height={584} layout="intrinsic" />
            </div>
            <Nav>{props.children}</Nav>
        </div>
    );
}