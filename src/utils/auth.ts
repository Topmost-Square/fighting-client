import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import {useMeLazyQuery, useRefreshMutation} from "../generated/graphql";
import {setUserId} from "../redux/userSlice";
import {useDispatch} from "react-redux";

export const saveToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const isAuth = () => {
    const token = getToken();
    if (!token)
        return false;

    const decodedToken: { exp: number } = jwtDecode(token);

    return decodedToken.exp > (new Date().getTime()) / 1000;
}

export const useAuth = () => {
    const dispatch = useDispatch();
    const [refresh, { error, loading }] = useRefreshMutation();

    const [getMe, { data }] = useMeLazyQuery();

    if (data && data.me) {
        dispatch(setUserId(data.me.id))
    }

    const checkAndRefreshToken = (method: any = null) => {
        if (!isAuth()) {
            const token = getToken();
            if (token) {
                refresh({
                    context: {
                        clientName: 'auth'
                    }
                })
                    .then(res => {
                        if (res.data?.refresh?.token) {
                            saveToken(res.data?.refresh?.token)
                            method && method()
                        } else {
                            removeToken();
                            method && method()
                        }
                    })
                    .catch(err => console.log(err, 'err'))
            }
        } else if (method) {
            method()
        }
    }

    useEffect(() => {
        checkAndRefreshToken();
        getMe({ context: { clientName: 'auth' }})
    }, []);

    return { checkAndRefreshToken };
}