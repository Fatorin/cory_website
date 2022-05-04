import Link from "next/link";

export const Nav = (props: any) => {
    return (
        <>
            <nav id="bottom-navigation" className="md:w-4/5 block fixed rounded-t-2xl z-10 inset-x-0 bottom-0 bg-white bg-opacity-75 md:bg-opacity-40 shadow mx-auto">
                <div id="tabs" className="flex justify-between">
                    <Link href="/" passHref>
                        <div className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="tab tab-home block text-xs">ホーム</span>
                        </div>
                    </Link>
                    <Link href="/profile" passHref>
                        <div className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="tab tab-home block text-xs">プロフィール</span>
                        </div>
                    </Link>
                    <Link href="/rule" passHref>
                        <div className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="tab tab-home block text-xs">配信のお約束</span>
                        </div>
                    </Link>
                    <Link href="/joinway" passHref>
                        <div className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="tab tab-home block text-xs">参加型の説明</span>
                        </div>
                    </Link>
                </div>
            </nav >
            <div className="min-h-screen relative">
                {props.children}
            </div>
        </ >
    );
}