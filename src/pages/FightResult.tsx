import React, {useEffect, useState} from "react";
import {useSetFightingDataMutation} from "../generated/graphql";

export const FightResult = () => {
    const [setFightingData, { error, loading }] = useSetFightingDataMutation();

    const [fightData, setFightData] = useState<string|null>(null);

    useEffect(() => {
        if (localStorage.getItem('fight')) {
            const fightData = localStorage.getItem('fight');

            setFightData(fightData)
        }
    }, []);

    useEffect(() => {
        let isDone = false;

        if (!isDone) {
            const storeFightingData = async () => {
                if (fightData) {
                    localStorage.removeItem('fight');

                    const setFighting = await setFightingData({
                        variables: {
                            data: fightData
                        },
                    });

                    if (setFighting!.data!.setFightingData!.data!) {
                        console.log('OK')
                        //todo: add message / error
                    }
                }
            };

            storeFightingData();
        }

        return () => {
            isDone = true;
        };
    },[setFightingData, fightData]);

    return (
        <div className='flex flex-col items-center h-screen'>
            {loading ? 'Loading...' : 'Result'}
        </div>
    );
}
