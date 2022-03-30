import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FullPageLoader from './FullPageLoader';
import { useAppSelector } from '../redux/hooks';

const RouteGuard: React.FC = (props: any) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useAppSelector(state => state.users);

    useEffect(() => {
        if (user.id !== 0) {
            if (router.asPath.includes("login")) {
                router.push("/");
            } else {
                setAuthorized(true);
                setLoading(false);
            }
            return;
        }

        if (router.asPath.includes("login")) {
            setAuthorized(false);
            setLoading(true);
        } else {
            router.push("/login");
        }
    }, [router, user.id]);

    if (!loading && !authorized) {
        return <FullPageLoader />
    }

    return (props.children);
};

export default RouteGuard;