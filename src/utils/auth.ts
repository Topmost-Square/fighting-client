import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useRefreshMutation } from "../generated/graphql";
import { useLocation } from "react-router-dom";

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
    const [refresh, { error, loading }] = useRefreshMutation();
    const location = useLocation();

    const checkAndRefreshToken = () => {
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
                        } else {
                            removeToken();
                        }
                    })
                    .catch(err => console.log(err, 'err'))
            }
        }
    }

    useEffect(() => checkAndRefreshToken(), []);
    useEffect(() => checkAndRefreshToken(), [location]);
}