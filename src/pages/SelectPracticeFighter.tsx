import React, {useEffect, useRef} from "react";
import {SelectScreen} from "../gameEngine/selectScreen/SelectScreen";

export const SelectPracticeFighter = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef?.current;
        const c = canvas?.getContext('2d');

        const selectScreen = new SelectScreen();
        selectScreen.setContext(c!);
        selectScreen.loadImages();

        const animate = () => {
            requestAnimationFrame(animate);
            c!.clearRect(0, 0, canvas!.width, canvas!.height);

            c!.font = '30px Arial';
            c!.fillStyle = 'white';

            c!.fillText('Select You Fighter', canvas?.width! / 2 - 100, 100)

            if (selectScreen.selected) {
                // go to fighting
            }

            selectScreen.draw()

        }

        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
        animate();
    }, []);

    return (
        <div>
            <canvas className='bg-slate-500' ref={canvasRef}></canvas>
        </div>
    );
}