import {MenuItem} from "../components/MenuItem";
import {getToken, isAuth, removeToken, saveToken} from "../utils/auth";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useRefreshMutation} from "../generated/graphql";

export const Menu = () => {
    const navigate = useNavigate();
    const [refresh, { error, loading }] = useRefreshMutation();

    const exit = () => {
        removeToken();
        document.location.reload();
    }

    const navigateToPage = (page: string) => {
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
                            navigate(page);
                        } else {
                            removeToken();
                            navigate(page);
                        }
                    })
                    .catch(err => console.log(err, 'err'))
            }
        } else {
            navigate(page);
        }
    }

    return (
        <div className='flex flex-col items-center h-screen'>
            <MenuItem name='Practice' top click={() => navigateToPage('practice')} />
            <MenuItem name='Online' />
            <MenuItem name='Inventory' />
            <MenuItem name='Settings' />
            <MenuItem name='Exit' click={exit}/>
        </div>
    );
}
