import React, {useEffect, useRef} from "react";
import {Player} from "../gameEngine/fighters/Player";
import {AIFighter} from "../gameEngine/fighters/AIFighter";
import {PracticeGame} from "../gameEngine/game/PracticeGame";
import {PlayerControls} from "../gameEngine/controls/PlayerControls";
import {AIControls} from "../gameEngine/controls/AIControls";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../utils/auth";
import {navigateToPage} from "../utils/navigation";

export const Practice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();
    const { checkAndRefreshToken } = useAuth();

    useEffect(() => {
        const canvas = canvasRef?.current;
        const c = canvas?.getContext('2d');

        let player: Player|null = null;
        let aiFighter: AIFighter|null = null;
        let game: PracticeGame|null = null;
        let gameState: boolean = true;

        player =  new Player();
        const playerControls = new PlayerControls();
        playerControls.setFighter(player);

        const fight = JSON.parse(localStorage.getItem('fight')!);

        if (!fight) {
            navigateToPage('/', navigate, checkAndRefreshToken)
        }

        player.setInitialX(canvas!.width - 200);
        player.setInitialY(canvas!.height - 500);
        player.setCanvas(canvas);
        player.setContext(c!);
        player.setSpriteSheet(fight.fighter);
        player.setControls(playerControls);

        aiFighter = new AIFighter();
        const aiControls = new AIControls();
        aiControls.setFighter(aiFighter);

        aiFighter.setInitialX(100);
        aiFighter.setInitialY(canvas!.height - 500);
        aiFighter.setCanvas(canvas);
        aiFighter.setContext(c!);
        aiFighter.setSpriteSheet(fight.enemy);
        aiFighter.setControls(aiControls);

        game = new PracticeGame(player, aiFighter);

        const animate = () => {
            requestAnimationFrame(animate);
            c!.clearRect(0, 0, canvas!.width, canvas!.height);
            if (player?.health! <= 0 || aiFighter?.health! <= 0) {
                // game over
                gameState = false;
            }

            c!.font = '30px Arial';
            c!.fillStyle = 'white';

            if (gameState) {
                c!.fillText(`AI Fighter ${aiFighter!.health}`, canvas?.width! - 300, 100)
                c!.fillText(`Player ${player!.health}`, 100, 100)
            } else {
                const winner = player?.health! > aiFighter?.health! ? 'Player' : 'AI Fighter';
                c!.fillText(`${winner} wins`, 400, 100)
            }

            aiFighter!.draw();
            player!.draw();

            if (gameState) {
                player!.update();
                aiFighter!.update();
            }

            game!.update();
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
