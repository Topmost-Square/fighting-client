import React from "react";
import {navigateToPage} from "../utils/navigation";
import { useSelector } from "react-redux";

export const FightResult = () => {
    console.log(
        useSelector(store => console.log(store))
    )

    return (
        <div className='flex flex-col items-center h-screen'>
            Result
        </div>
    );
}
