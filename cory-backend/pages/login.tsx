import type { NextPage } from 'next';
import React, { SyntheticEvent, useContext, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { axiosInstance } from '../utils/api';
import { setUserId } from '../redux/user/actions';
import { useAppDispatch } from '../redux/hooks';
import { NotificationContext } from '../components/Notification/Notification';
import { Loading } from '../components/Loading';
import { ERROR_MSG_SERVER_CONNECT_FAIL } from '../utils/commonErrorMessage';

const Login: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { addMessage, removeMessage } = useContext(NotificationContext);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        removeMessage();
        await axiosInstance.post('/admin/login', {
            username,
            password
        }).catch((e) => {
            addMessage(ERROR_MSG_SERVER_CONNECT_FAIL, false);
            setIsLoading(false);
            return;
        });

        await axiosInstance.get('/admin/user')
            .then(({ data }) => {
                dispatch(setUserId(data.id));
                router.push("/");
            })
            .catch((e) => {
                addMessage(ERROR_MSG_SERVER_CONNECT_FAIL, false);
                console.log(e);
            })

        setIsLoading(false);
    }

    const LoginBtn = () => {
        return (
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </span>
                ログイン
            </button>
        )
    }

    return (
        <div className="bg-gray-500 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 w-full max-w-lg">
                <Image src="/himitukichi/images/logo.png" alt="Workflow" height={350} width={1000} layout='responsive' priority />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">こりーのホームページ</h2>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">アカウント</label>
                            <input id="username" name="username" type="text" autoComplete="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="アカウント" onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">パスワード</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="パスワード" onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="h-6">
                        {isLoading ? <Loading text="Loading..." /> : <LoginBtn />}
                    </div>
                </form>
            </div>
        </div >
    )
}

export default Login;