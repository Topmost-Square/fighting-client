import React, {useRef} from "react";

export const Practice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas = canvasRef?.current;
    const c = canvas?.getContext('2d');

    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    return (
        <div>
            <canvas className='bg-violet-800' ref={canvasRef}></canvas>
        </div>
    );
}
