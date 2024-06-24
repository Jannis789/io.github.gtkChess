import GameBoard from './GameBoard.js';
import Piece from './Piece.js';
import Tile from './Tile.js';

type GameState = "SELECT" | "INIT" | "VALIDATE" | "MOVE" | "WIN" | "LOSE";
type Position = {x: number, y: number};

class GameAction {
    private static _instance: GameAction;
    private _selectedTile: Tile | null;
    private _targetedTile: Tile | null;
    public static possibleMoves: Position[];
    private _state: GameState = "INIT";

    private constructor() {
        this._selectedTile = null;
        this._targetedTile = null;
        GameAction.possibleMoves = [];
    }

    public static get instance(): GameAction {
        if (!GameAction._instance) {
            GameAction._instance = new GameAction();
        }
        return GameAction._instance;
    }

    public static get selectedTile(): Tile | null {
        return this.instance._selectedTile;
    }

    public static set selectedTile(tile: Tile | null) {
        this.instance._selectedTile = tile;
    }

    public static get targetedTile(): Tile | null {
        return this.instance._targetedTile;
    }

    public static set targetedTile(tile: Tile | null) {
        this.instance._targetedTile = tile;
    }

    public static get state(): GameState {
        return this.instance._state;
    }

    public static update(state: GameState): void {
        this.instance._state = state;
        switch (state) {
            case "SELECT":
                if (!this.selectedTile?.hasPiece()) throw new Error('No tile selected while SELECT state is active');
                
                const piece: Piece = this.selectedTile.piece;
                GameAction.possibleMoves = piece.possibleMoves;
                GameBoard.selectPossibleMoves(GameAction.possibleMoves, true);
                
                break;
            case "VALIDATE":
                if (!this.targetedTile) throw new Error('No tile selected while VALIDATE state is active');

                const tile = this.targetedTile;
                GameAction.possibleMoves.some(position => {
                    return position.x === tile.position.x && position.y === tile.position.y
                }) ? this.update("MOVE") : this.update("INIT");

                break;
            case "MOVE":
                if (!this.selectedTile?.hasPiece()) throw new Error('selectedTile has no piece while MOVE state is active');
                if (!this.targetedTile) throw new Error('No tile targeted while MOVE state is active');
                
                const sourcePiece = this.selectedTile.piece;
                const targetPosition = this.targetedTile.position;
                sourcePiece.moveToPosition(targetPosition);
                
                break;
            case "INIT":

                break;
            default:
                throw new Error(`Unknown state: ${state}`);
        }
    }
}

export default GameAction;
