import React, {useEffect, useRef} from "react";
import {SelectScreen} from "../gameEngine/selectScreen/SelectScreen";
import { characters } from "../gameEngine/selectScreen/charactersList";
import {navigateToPage} from "../utils/navigation";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../utils/auth";

export const SelectPracticeFighter = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();
    const { checkAndRefreshToken } = useAuth();

    useEffect(() => {
        const canvas = canvasRef?.current;
        const c = canvas?.getContext('2d');

        const selectScreen = new SelectScreen();
        selectScreen.setContext(c!);
        selectScreen.loadImages();
        selectScreen.setCanvas(canvas);
        selectScreen.setDefaultAnimation();

        const enemyIndex = Math.floor(Math.random() * characters.length);

        const fightObject = {
            fighter: '',
            enemy: characters[enemyIndex]
        }

        const animate = () => {
            requestAnimationFrame(animate);
            c!.clearRect(0, 0, canvas!.width, canvas!.height);

            c!.font = '30px Arial';
            c!.fillStyle = 'white';

            c!.fillText('Select Your Fighter', canvas?.width! / 2 - 100, 100)

            if (selectScreen.selected) {
                fightObject.fighter = characters[selectScreen.pointer];

                localStorage.setItem('fight', JSON.stringify(fightObject));

                selectScreen.idleAnimation?.stopAnimating();

                navigateToPage('/practice', navigate, checkAndRefreshToken);
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