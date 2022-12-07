import React, {useEffect, useRef} from "react";
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

        player =  new Player(
            100,
            canvas!.height - 500,
            canvas,
            c!
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
            player!.update();
            player!.draw();

            aiFighter!.update();
            aiFighter!.draw();

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
