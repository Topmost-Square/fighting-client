import React, {useEffect, useRef, useState} from "react";
import {Player} from "../gameEngine/fighters/Player";
import {AIFighter} from "../gameEngine/fighters/AIFighter";
import {PracticeGame} from "../gameEngine/game/PracticeGame";

export const Practice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef?.current;
        const c = canvas?.getContext('2d');

        let player: Player|null = null;
        let aiFighter: AIFighter|null = null;
        let game: PracticeGame|null = null;
        let gameState: boolean = true;

        player =  new Player(
            100,
            canvas!.height - 500,
            canvas,
            c!,
            'basic'
        );

        aiFighter = new AIFighter(
            canvas!.width - 200,
            canvas!.height - 500,
            canvas,
            c!
        );

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
            <canvas className='bg-violet-800' ref={canvasRef}></canvas>
        </div>
    );
}
