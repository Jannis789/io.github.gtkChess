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
        if (tile.piece instanceof Pawn) {
            const newPiece = tile.piece.set_position({ x: 0, y: 0 });
        }
    }

    get gameState(): GameState {
        return this._gameState;
    }

    private readonly pieceTypeToClassMap: { [key: string]: typeof Piece } = {
        pawn: Pawn,
        king: King,
        queen: Queen,
        rook: Rook,
        knight: Knight,
        bishop: Bishop
    };

    public createPiece(tile: Tile, color: Color, pieceType: PieceType): void {
        const pieceClass = this.pieceTypeToClassMap[pieceType];
        if (pieceClass) {
            const piece = new pieceClass(tile);
            piece.renderPiece(color, pieceType, 200);
            tile.set_child(piece);
        }
    }
}

export class Pawn extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

class King extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

class Queen extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

class Rook extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

class Knight extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

class Bishop extends Piece {
    constructor(tile: Tile) {
        super(tile);
        this.tileReference = tile;
    }
}

export default PieceControl;
