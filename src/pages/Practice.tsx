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
import {MAX_HEALTH} from "../utils/constants";
import {BackgroundPainter} from "../gameEngine/sprite/BackgroundPainter";
import {calculateCoefficients} from "../gameEngine/gameUtils/screen";

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

        const background = new BackgroundPainter();
        background.setCanvas(newCanvas!)
        background.setContext(newContext!);
        background.setImage(fight.background);

        const dataCollector = new DataCollector();

        dataCollector.setDispatch(dispatch);
        dataCollector.setActions(actions);
        // clear fighting state in the beginning of every fight
        dataCollector.clearState();

        dataCollector.setCharacter({ type: 'player', character: fight.fighter });
        dataCollector.setCharacter({ type: 'enemy', character: fight.enemy });

        const { x, y } = calculateCoefficients(window.innerWidth);

        const newPlayer = new Player();

        const playerControls = new PlayerControls();

        playerControls.setFighter(newPlayer!);

        newPlayer.setName(fight.fighter);


        console.log(x,y)

        console.log(window.innerWidth, window.innerHeight)

        newPlayer!.setInitialX(100 * x);
        newPlayer!.setInitialY(newCanvas!.height * y);


        newPlayer!.setCanvas(newCanvas);
        newPlayer!.setContext(newContext!);
        newPlayer.setPainter();
        newPlayer!.setSpriteSheet(fight.fighter);
        newPlayer!.setControls(playerControls);
        newPlayer!.setDataCollector(dataCollector);
        newPlayer!.setGameState(true);

        newPlayer.setCoefficient(x,y);

        const newAIFighter = new AIFighter();

        const aiControls = new AIControls();

        aiControls.setFighter(newAIFighter!);

        newAIFighter.setName(fight.enemy);


        newAIFighter!.setInitialX((newCanvas!.width - 100) * x);
        newAIFighter!.setInitialY(newCanvas!.height * y);


        newAIFighter!.setCanvas(newCanvas);
        newAIFighter!.setContext(newContext!);
        newAIFighter.setPainter();
        newAIFighter!.setSpriteSheet(fight.enemy);
        newAIFighter!.setControls(aiControls);
        newAIFighter!.setGameState(true);

        newAIFighter.setCoefficient(x,y);

        const game = new PracticeGame(newPlayer!, newAIFighter!);

        const animate = () => {
            requestAnimationFrame(animate);

            newContext!.clearRect(0, 0, newCanvas!.width, newCanvas!.height);

            background.draw();

            newContext!.font = '30px Arial';

            newContext!.fillStyle = newPlayer.health > MAX_HEALTH / 2 ?
                'white' :
                newPlayer.health <= 10 ?
                    'red' :
                    'yellow';

            newContext!.fillRect(100, 100, newPlayer!.health * 10, 50);

            newContext!.fillStyle = 'black';

            newContext!.fillText(
                fight.fighter,
                100,
                130
            );

            const shifter = 100 - newAIFighter!.health;

            newContext!.fillStyle = newAIFighter.health > MAX_HEALTH / 2 ?
                'white' :
                newAIFighter.health <= 10 ?
                    'red' :
                    'yellow';

            newContext!.fillRect(
                newCanvas?.width! / 3 + (shifter * 10),
                100,
                newAIFighter!.health * 10,
                50
            );

            newContext!.fillStyle = 'black';

            newContext!.fillText(
                fight.enemy,
                newCanvas?.width! / 2 + 13 * MAX_HEALTH,
                130
            );

            newAIFighter!.draw();
            newPlayer!.draw();

            game!.update();

            if (newPlayer.health > 0 && newAIFighter.health > 0) {
                newPlayer!.update();
                newAIFighter!.update();
            } else {
                const winner = newPlayer.health! > newAIFighter.health! ? 'player' : 'ai';

                newContext!.font = '30px Arial';
                newContext!.fillStyle = 'white';

                newContext!.fillText(
                    `${winner === 'ai' ? fight.enemy : fight.fighter} wins`,
                    newCanvas?.width! / 2,
                    300
                );

                dataCollector.setWinner(winner)

                setTimeout(() => {
                    window.location.href = '/result';
                }, 1000);
            }
        }

        newCanvas!.width = window.innerWidth;
        newCanvas!.height = window.innerHeight;
        animate();

        window.addEventListener('resize', () => {
            newCanvas!.width = window.innerWidth;
            newCanvas!.height = window.innerHeight;

            const { x, y } = calculateCoefficients(window.innerWidth);

            newPlayer.setCoefficient(x,y);
            newAIFighter.setCoefficient(x,y);
        })
    }, []);

    return (
        <div>
            <canvas className='bg-slate-500' ref={canvasRef}></canvas>
        </div>
    );
}
