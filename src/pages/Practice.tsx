import React, {useEffect, useRef} from "react";
import {Player} from "../gameEngine/fighters/Player";
import {AIFighter} from "../gameEngine/fighters/AIFighter";
import {PracticeGame} from "../gameEngine/game/PracticeGame";
import {PlayerControls} from "../gameEngine/controls/PlayerControls";
import {AIControls} from "../gameEngine/controls/AIControls";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../utils/auth";
import {navigateToPage} from "../utils/navigation";
import {useDispatch} from "react-redux";
import {DataCollector} from "../gameEngine/DataCollector/DataCollector";
import {clearState, setCharacter, setWinner, updateKick} from "../redux/fightSlice";

export const Practice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const navigate = useNavigate();
    const { checkAndRefreshToken } = useAuth();
    const dispatch = useDispatch();

    const actions = {
        clearState: clearState,
        setCharacter: setCharacter,
        updateKick: updateKick,
        setWinner: setWinner
    };

    useEffect(() => {
        let newCanvas = canvasRef?.current;
        let newContext = newCanvas?.getContext('2d');

        const fight = JSON.parse(localStorage.getItem('fight')!);

        if (!fight) {
            navigateToPage('/', navigate, checkAndRefreshToken)
        }

        const dataCollector = new DataCollector();

        dataCollector.setDispatch(dispatch);
        dataCollector.setActions(actions);
        // clear fighting state in the beginning of every fight
        dataCollector.clearState();

        dataCollector.setCharacter({ type: 'player', character: fight.fighter });
        dataCollector.setCharacter({ type: 'enemy', character: fight.enemy });

        const newPlayer = new Player();

        const playerControls = new PlayerControls();

        playerControls.setFighter(newPlayer!);

        newPlayer!.setInitialX(100);
        newPlayer!.setInitialY(newCanvas!.height - 500);
        newPlayer!.setCanvas(newCanvas);
        newPlayer!.setContext(newContext!);
        newPlayer!.setSpriteSheet(fight.fighter);
        newPlayer!.setControls(playerControls);
        newPlayer!.setDataCollector(dataCollector);
        newPlayer!.setGameState(true);

        const newAIFighter = new AIFighter();

        const aiControls = new AIControls();

        aiControls.setFighter(newAIFighter!);

        newAIFighter!.setInitialX(newCanvas!.width - 400);
        newAIFighter!.setInitialY(newCanvas!.height - 500);
        newAIFighter!.setCanvas(newCanvas);
        newAIFighter!.setContext(newContext!);
        newAIFighter!.setSpriteSheet(fight.enemy);
        newAIFighter!.setControls(aiControls);
        newAIFighter!.setGameState(true);

        const game = new PracticeGame(newPlayer!, newAIFighter!);

        const animate = () => {
            requestAnimationFrame(animate);

            newContext!.clearRect(0, 0, newCanvas!.width, newCanvas!.height);

            newContext!.font = '30px Arial';
            newContext!.fillStyle = 'white';

            newContext!.fillText(`AI Fighter ${newAIFighter!.health}`, newCanvas?.width! - 300, 100)
            newContext!.fillText(`Player ${newPlayer!.health}`, 100, 100)

            newAIFighter!.draw();
            newPlayer!.draw();

            game!.update();

            if (newPlayer.health > 0 && newAIFighter.health > 0) {
                newPlayer!.update();
                newAIFighter!.update();
            } else {
                const winner = newPlayer.health! > newAIFighter.health! ? 'player' : 'ai';
                newContext!.fillText(`${winner === 'ai' ? fight.enemy : fight.fighter} wins`, 400, 100)
                dataCollector.setWinner(winner)

                setTimeout(() => {
                    window.location.href = '/result';
                }, 3000);
            }
        }

        newCanvas!.width = window.innerWidth;
        newCanvas!.height = window.innerHeight;
        animate();
    }, []);

    return (
        <div>
            <canvas className='bg-slate-500' ref={canvasRef}></canvas>
        </div>
    );
}
