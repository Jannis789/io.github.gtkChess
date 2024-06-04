import Tile from "./Tile.js";
import DragControl from "./DragControl.js";
import Piece from "./Piece.js";
import GObject from "gi://GObject";

type GameState = "INIT" | "SELECT" | "VALIDATE" | "MOVE" | "NONE";
type Color = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

class PieceControl {
    private dragControl!: DragControl;
    public tiles: Tile[] = [];
    public pieceTiles: Tile[] = [];
    public dragSource!: Tile;
    public dropDestination!: Tile;
    private _gameState: GameState = "NONE";

    constructor() {
        GObject.registerClass({ GTypeName: `PawnPiece` }, Pawn);
        GObject.registerClass({ GTypeName: `KingPiece` }, King);
        GObject.registerClass({ GTypeName: `QueenPiece` }, Queen);
        GObject.registerClass({ GTypeName: `RookPiece` }, Rook);
        GObject.registerClass({ GTypeName: `KnightPiece` }, Knight);
        GObject.registerClass({ GTypeName: `BishopPiece` }, Bishop);
    }

    public set updateGameState(state: GameState) {
        this._gameState = state;
        switch (state) {
            case "INIT":
                this.dragControl = new DragControl(this.pieceTiles, this.tiles);
                this.dragControl.pieceControl = this;
                break;
            case "SELECT":
                this.validateInput(this.dragSource);
                break;
            case "MOVE":
                break;
        }
    }

    public validateInput(tile: Tile) {
        if (tile.piece === null) return;
        (console as any).log(tile.getNewPosition("white", "top-right"));
    }

    get gameState(): GameState {
        return this._gameState;
    }

    private pieceTypeToClassMap: { [key: string]: typeof Piece } = {
        pawn: Pawn,
        king: King,
        queen: Queen,
        rook: Rook,
        knight: Knight,
        bishop: Bishop
    } as const;

    public createPiece(tile: Tile, color: Color, pieceType: PieceType): void {
        tile.piece = new this.pieceTypeToClassMap[pieceType]().renderPiece(color, pieceType, 200);
    }
}

class Pawn extends Piece {
    constructor() {
        super();

    }
}

class King extends Piece {
    constructor() {
        super();
    }
}

class Queen extends Piece {
    constructor() {
        super();
    }
}

class Rook extends Piece {
    constructor() {
        super();
    }
}

class Knight extends Piece {
    constructor() {
        super();
    }
}

class Bishop extends Piece {
    constructor() {
        super();
    }
}

export default PieceControl;
