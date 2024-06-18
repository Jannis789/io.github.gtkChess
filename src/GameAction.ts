import DragControl from "./DragControl.js";
import Tile from "./Tile.js";
import TileSet, { pieceTile } from "./TileSet.js";
type GameStates = "SELECT" |  "INIT" | "VALIDATE" | "MOVE" | "NEW_TURN";

class GameAction {
    private static _instance: GameAction;
    public static gameState: GameStates = "INIT";
    public static sourceTile?: Tile;
    public static DropTile?: Tile;
    public static playerColor: 'white' | 'black' = "white";

    public static get instance(): GameAction {
        if (!GameAction._instance) {
            GameAction._instance = new GameAction();
        }
        return GameAction._instance;
    }

    public static updateGameState(state: GameStates): void {
        const sourceTile = GameAction.sourceTile;
        const sourcePiece = sourceTile?.piece;
        const dropedTile = GameAction.DropTile;
        switch (state) {
            case "NEW_TURN":
                GameAction.playerColor = GameAction.playerColor === "white" ? "black" : "white";
                break;
            case "INIT":
                
                break;
            case "SELECT":
                if (!sourcePiece) throw Error("piece is null, while in SELECT state");
                sourcePiece.selectMoves(true);
                break;
            case "VALIDATE":
                if (!sourcePiece) throw Error("piece is null, while in SELECT state");
                if (!dropedTile) throw Error("dropedTile is null, while in VALIDATE state");
                if (TileSet.isTileSelected(dropedTile)) {
                    GameAction.updateGameState('MOVE');
                }
                break;
            case "MOVE":
                const finalPosition = dropedTile?.position;
                if (!finalPosition) throw Error("moveablePosition is undefined, while in MOVE state");
                if (!sourcePiece) throw Error("piece is null, while in MOVE state");
                if (!dropedTile) throw Error("dropedTile is null, while in MOVE state");
                if (!sourceTile) throw Error("sourceTile is null, while in MOVE state");
                if (!sourceTile.hasPiece()) throw Error("sourceTile.piece is null, while in MOVE state");

                const movedTile = TileSet.getTile(finalPosition);

                sourcePiece.selectMoves(false);
                sourcePiece.position = finalPosition;

                if (!movedTile.hasPiece()) throw Error("movedTile.piece is null, while in MOVE state");

                DragControl.removeDragSource(sourceTile);
                DragControl.removeDropTarget(dropedTile);
                DragControl.newDragSource = movedTile;
                DragControl.newDropTarget = dropedTile;

                GameAction.updateGameState('NEW_TURN');
                break;
        }
        GameAction.gameState = state;
    }
}

export default GameAction;