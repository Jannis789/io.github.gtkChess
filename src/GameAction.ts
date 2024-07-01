import GameBoard from "./GameBoard.js";
import EventControl from "./EventControl.js";
import Tile, { pieceTile } from "./Tile.js";
import Position from "./Position.js";
import PieceFactory from "./PieceFactory.js";

enum GameState {
    INITIALIZE = "INITIALIZE",
    SELECT = "SELECT",
    VALIDATE = "VALIDATE",
    NONE = "NONE",
    CANCEL = "CANCEL",
}

class GameAction {
    public static selectedPosition: Position | null;
    public static targetedPosition: Position | null;
    private static _instance: GameAction;
    public static currentState: GameState;

    constructor() {
        GameAction.currentState = GameState.NONE;
    }

    public static get instance(): GameAction {
        if (!GameAction._instance) {
            GameAction._instance = new GameAction();
        }
        return GameAction._instance;
    }

    public static get GameState(): typeof GameState {
        return GameState;
    }

    public static update(state: GameState): void {
        if (GameAction.currentState === state) return;
        GameAction.currentState = state;
        switch (state) {
            case GameState.INITIALIZE:
                GameBoard.createTiles();
                PieceFactory.createPieces();
                EventControl.createEventHandling();
                GameBoard.setProtection('white');
                break;
            case GameState.SELECT:
                if (!GameAction.selectedPosition) throw new Error('Selected position is null, while in SELECT state');
                const tile = GameBoard.getChild(GameAction.selectedPosition) as pieceTile;
                tile.piece.validMoves()
                .forEach(tilePosition => {
                    GameBoard.selectTile(tilePosition, true);
                });
                break;
            case GameState.VALIDATE:
                if (!GameAction.selectedPosition) throw new Error('Selected position is null, while in VALIDATE state');
                if (!GameAction.targetedPosition) throw new Error('Targeted position is null, while in VALIDATE state');
                if (GameAction.targetedPosition.isMember(GameBoard.selectedTilePositions)) {
                    GameBoard.movePieceTo(GameAction.selectedPosition, GameAction.targetedPosition);
                }
                break;
            case GameState.CANCEL:
                break;
            default:
                console.error("Unknown game state:", state);
        }
    }
}

export default GameAction;
