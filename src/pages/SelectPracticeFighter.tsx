import React, {useEffect, useRef} from "react";
import {SelectScreen} from "../gameEngine/selectScreen/SelectScreen";
import { characters } from "../gameEngine/selectScreen/charactersList";
import { backgrounds } from "../gameEngine/selectScreen/backgroundList";
import {navigateToPage} from "../utils/navigation";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../utils/auth";
import {calculateCoefficients} from "../gameEngine/gameUtils/screen";

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
        const { x, y } = calculateCoefficients(window.innerWidth)

        selectScreen.setCoefficient(x, y);

        const enemyIndex = Math.floor(Math.random() * characters.length);
        const backgroundIndex = Math.floor(Math.random() * backgrounds.length);

        const fightObject = {
            fighter: '',
            enemy: characters[enemyIndex],
            background: backgrounds[backgroundIndex]
        }

        const animate = () => {
            requestAnimationFrame(animate);
            c!.clearRect(0, 0, canvas!.width, canvas!.height);

            //todo: use coeff here as well

            const xCoeff = calculateCoefficients(window.innerWidth).x;
            const yCoeff = calculateCoefficients(window.innerWidth).y;

            const textSize = 30 * xCoeff;

            c!.font = `${textSize}px Arial`;
            c!.fillStyle = 'white';

            c!.fillText('Select Your Fighter', (canvas?.width! / 2 - 100) * xCoeff, 100 * yCoeff)

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

        window.addEventListener('resize', () => {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;

            const { x, y } = calculateCoefficients(window.innerWidth);

            selectScreen.setCoefficient(x, y);
        })

    }, []);

    return (
        <div>
            <canvas className='bg-slate-500' ref={canvasRef}></canvas>
        </div>
    );
}