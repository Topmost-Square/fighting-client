import {MenuItem} from "../components/MenuItem";
import {removeToken, useAuth} from "../utils/auth";
import {useNavigate} from "react-router-dom";
import React from "react";
import {navigateToPage} from "../utils/navigation";
import { useSelector } from "react-redux";

export const Menu = () => {
    const navigate = useNavigate();

    console.log(
        useSelector(store => console.log(store))
    )

    const { checkAndRefreshToken } = useAuth();

    const exit = () => {
        removeToken();
        document.location.reload();
    }

    return (
        <div className='flex flex-col items-center h-screen'>
            <MenuItem name='Practice' top click={() =>  navigateToPage('/select/practice', navigate, checkAndRefreshToken)} />
            <MenuItem name='Online' />
            <MenuItem name='Inventory' />
            <MenuItem name='Settings' />
            <MenuItem name='Exit' click={exit}/>
        </div>
    );
}
