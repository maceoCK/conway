import { useEffect, useRef, useState } from "react";

const canvasSize = {
    width: 500,
    height: 500,
    resolution: 10,
};

const Canvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null); // Ref to store animation frame ID
    const [_, setGrid] = useState(buildGrid());
    const [paused, setPaused] = useState(false);

    function buildGrid() {
        const grid = new Array(canvasSize.width / canvasSize.resolution)
            .fill(null)
            .map(() =>
                new Array(canvasSize.height / canvasSize.resolution)
                    .fill(null)
                    .map(() => Math.floor(Math.random() * 2))
            );
        return grid;
    }

    function calculateNeighbors(grid: Array<Array<any>>, x: number, y: number) {
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (
                    x + i >= 0 &&
                    x + i < grid.length &&
                    y + j >= 0 &&
                    y + j < grid[x + i].length &&
                    !(i === 0 && j === 0)
                ) {
                    neighbors += grid[x + i][y + j];
                }
            }
        }
        return neighbors;
    }

    function updateGrid(grid: Array<Array<any>>) {
        const newGrid = grid.map((row) => row.map((cell) => cell));
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const neighbors = calculateNeighbors(grid, x, y);
                if (grid[x][y] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[x][y] = 0;
                } else if (grid[x][y] === 0 && neighbors === 3) {
                    newGrid[x][y] = 1;
                }
            }
        }
        return newGrid;
    }

    function render(
        grid: Array<Array<any>>,
        context: CanvasRenderingContext2D
    ) {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const cell = grid[x][y];
                context.beginPath();
                context.rect(
                    x * canvasSize.resolution,
                    y * canvasSize.resolution,
                    canvasSize.resolution,
                    canvasSize.resolution
                );
                context.fillStyle = cell === 1 ? "black" : "white";
                context.fill();
            }
        }
    }

    function handleClick(event: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(
            (event.clientX - rect.left) / canvasSize.resolution
        );
        const y = Math.floor(
            (event.clientY - rect.top) / canvasSize.resolution
        );
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    rowIndex === x && colIndex === y ? 1 : cell
                )
            );
            const context = canvas.getContext("2d");
            if (context) {
                render(newGrid, context);
            }
            return newGrid;
        });
    }

    useEffect(() => {
        if (paused) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }
    }, [paused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            const context = canvas.getContext("2d");
            if (context) {
                const grid = buildGrid();
                console.log(grid);
                render(grid, context);
                const animate = () => {
                    setGrid((prevGrid) => {
                        const newGrid = updateGrid(prevGrid);
                        render(newGrid, context);
                        return newGrid;
                    });
                    if (!paused) {
                        animationRef.current = setTimeout(
                            () => requestAnimationFrame(animate),
                            100
                        );
                    }
                };
                if (!paused) {
                    animate();
                }
            }
            canvas.addEventListener("click", (event) =>
                handleClick(event, canvas)
            );
            return () => {
                canvas.removeEventListener("click", (event) =>
                    handleClick(event, canvas)
                );
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    }, [paused]);

    return (
        <>
            <canvas
                ref={canvasRef}
                {...props}
                style={{ border: "1px solid black" }}
            />
            <div>
                <button onClick={() => setGrid(buildGrid())}>Reset</button>
                <button onClick={() => setPaused(!paused)}>
                    {paused ? "Play" : "Pause"}
                </button>
            </div>
        </>
    );
};

export default Canvas;
