import Game from "./Game";
import Button from "@mui/material/Button";
import "../index.css";

function App() {
    return (
        <>
            <div className="header">
                <h1 className="header-title">Conway</h1>
                <div className="header-buttons">
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "white", color: "black" }}
                        href="https://maceock.me"
                        target="_blank"
                    >
                        Checkout the developer
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "white", color: "black" }}
                        href="https://github.com/maceoCK/conway"
                        target="_blank"
                    >
                        Checkout the repo
                    </Button>
                </div>
            </div>
            <Game id="canvas" style={{ border: "1px solid white" }} />
        </>
    );
}

export default App;
