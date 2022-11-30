import React, {useEffect, useRef} from "react";
import {Player} from "../gameEngine/Player";

export const Practice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef?.current;
        const c = canvas?.getContext('2d');

        const player = canvas && c ?
            new Player(
                100,
                canvas.height - 500,
                canvas,
                c
            ) :
            null;

        const animate = () => {
            requestAnimationFrame(animate);
            if (c && canvas && player) {
                c.clearRect(0, 0, canvas.width, canvas.height);
                player.update();
                player.draw();
            }
        }

        if (canvas && c && player) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            animate();
        }
    }, []);

    return (
        <div>
            <canvas className='bg-violet-800' ref={canvasRef}></canvas>
        </div>
    );
}
