import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setUserEmail, setUserId, setUserName } from "../redux/user/actions";
import { axiosInstance } from "../utils/api";
import Image from 'next/image';

const links = [
    { key: 0, href: "/", label: "グローバル設定" },
    { key: 1, href: "/home", label: "ホーム" },
    { key: 2, href: "/profile", label: "プローフィール" },
    { key: 3, href: "/rule", label: "ルール" },
    { key: 4, href: "/joinway", label: "参加方法" },
]

const Nav = (props: any) => {
    const dispatch = useAppDispatch();
    const [style, SetStyle] = useState("-translate-x-full");
    const toggle = () => {
        if (style !== "") {
            SetStyle("");
        } else {
            SetStyle("-translate-x-full");
        }
    }

    const clearUser = () => {
        dispatch(setUserId(0));
        dispatch(setUserName(""));
        dispatch(setUserEmail(""));
    }

    const logout = async () => {
        await axiosInstance.get("admin/logout")
            .then(() => {
                clearUser();
                router.push("/login");

            }).catch(() => {
                clearUser();
                router.push("/login");
            });
    }

    return (
        <div className="relative min-h-screen md:flex">
            {/*mobile-sidebar*/}
            <div className={"bg-cyan-100 text-blue-500 flex justify-between md:hidden"}>
                <Link href="#" passHref>
                    <span className="block p-4 font-bold">こりーのホームページ</span>
                </Link>
                <button className="p-4 focus:outlink-none focus:bg-cyan-200" onClick={toggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/*sidebar*/}
            <div className={"divide-gray-400 bg-cyan-100 text-blue-500 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out " + style}>
                {/*logo*/}
                <Link href="/" passHref>
                    <div className="flex space-x-2 justify-center">
                        <Image className="flex" src="/himitukichi/images/favicon.ico" alt="Workflow" height={24} width={24} />
                        <span className="text-2x1 font-extrabold">こりーのホームページ</span>
                    </div>
                </Link>
                <nav>
                    {links.map(({ key, href, label }) => (
                        <Link href={href} passHref key={key}>
                            <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sky-500 hover:text-sky-800">
                                {label}
                            </div>
                        </Link>
                    ))}
                </nav>
                <button className="flex px-4 justify-between rounded transition duration-200 hover:text-sky-800" onClick={logout}>
                    <span className="pr-4">ログアウト</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
            {/*content*/}
            <div className="p-4 w-screen">
                {props.children}
            </div>
        </div>
    );
}

export default Nav;

