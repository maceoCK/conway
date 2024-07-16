import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";

const canvasSize = {
    width: 500,
    height: 500,
    resolution: 10,
};

const Game = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null); // Ref to store animation frame ID
    const [_, setGrid] = useState(buildGrid());
    const [numberOfClicks, setNumberOfClicks] = useState(0); // State to track number of clicks
    const [startTime, setStartTime] = useState(Date.now()); // State to track start time
    const [clicksMode, setClicksMode] = useState(false);

    function buildGrid() {
        const grid = new Array(canvasSize.width / canvasSize.resolution)
            .fill(null)
            .map(() =>
                new Array(canvasSize.height / canvasSize.resolution)
                    .fill(null)
                    .map(() => (Math.floor(Math.random() * 2) === 0 ? 1 : 0))
            );
        return grid;
    }

    const setUp = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            const context = canvas.getContext("2d");
            if (context) {
                const grid = buildGrid();
                render(grid, context);
                const animate = () => {
                    setGrid((prevGrid) => {
                        const { newGrid, totalNeighbors } =
                            updateGrid(prevGrid);
                        render(newGrid, context);
                        if (totalNeighbors === 0) {
                            win();
                        }
                        return newGrid;
                    });
                    
                    animationRef.current = requestAnimationFrame(animate);
                };
                animate();
            }
        }
    };

    const reset = () => {
        setStartTime(Date.now());
        setNumberOfClicks(0);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            const context = canvas.getContext("2d");
            if (context) {
                const grid = buildGrid();
                setGrid(grid);
                render(grid, context);
                const animate = () => {
                    setGrid((prevGrid) => {
                        const { newGrid } = updateGrid(prevGrid);
                        render(newGrid, context);
                        return newGrid;
                    });
                    animationRef.current = requestAnimationFrame(animate);
                };
                animate();
            }
        }
    };

    const win = () => {
        console.log("You won!");
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };

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
        let totalNeighbors = 0;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const neighbors = calculateNeighbors(grid, x, y);
                if (grid[x][y] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[x][y] = 0;
                } else if (grid[x][y] === 0 && neighbors === 3) {
                    newGrid[x][y] = 1;
                }
                totalNeighbors += neighbors;
            }
        }
        return { newGrid, totalNeighbors };
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
                context.fillStyle =
                    cell === 1 ? "white" : "rgba(255, 255, 255, 0)";
                context.fill();
            }
        }
    }

    function handleClick(event: MouseEvent) {
        const canvas = event.target as HTMLCanvasElement;
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
        setNumberOfClicks((prevCount) => prevCount + 1); // Increment click count
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener("click", handleClick);
        }
        setUp();
        return () => {
            if (canvas) {
                canvas.removeEventListener("click", handleClick);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div
            className="game"
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <div
                className="game-controls"
                style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => setClicksMode(!clicksMode)}
                    fullWidth
                    style={{
                        backgroundColor: "blue",
                        color: "black",
                        padding: "20px",
                        fontSize: "50px",
                        fontWeight: "bold",
                        borderRadius: "10px",
                    }}
                >
                    {clicksMode ? "Clicks" : "Time"}
                </Button>
                <Button
                    variant="contained"
                    onClick={reset}
                    fullWidth
                    style={{
                        backgroundColor: "red",
                        color: "black",
                        padding: "20px",
                        fontSize: "50px",
                        fontWeight: "bold",
                        borderRadius: "10px",
                    }}
                >
                    Reset
                </Button>
            </div>
            <div
                className="game-container"
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <canvas
                    ref={canvasRef}
                    {...props}
                    style={{ border: "2px solid white" }}
                />
                {clicksMode ? (
                    <h3>Number Of Clicks: {numberOfClicks}</h3>
                ) : (
                    <h3>
                        Time: {((Date.now() - startTime) / 1000).toFixed(2)}{" "}
                        seconds
                    </h3>
                )}
            </div>
        </div>
    );
};

export default Game;
