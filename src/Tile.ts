import Position from "./Position.js";
import Piece from "./Piece.js";
import ActionChain from "./ActionChain.js";
class Tile {
    private _piece: Piece | null = null;
    public protection: boolean = false;
    constructor(public position: Position) { }

    public set piece(piece: Piece | null) {
        if (piece) piece.position = this.position;
        this._piece = piece;
        ActionChain.push({
            position: this.position,
            piece: this.piece ? this.piece.type : null,
            color: piece?.color ? piece.color : undefined,
        });
    }

    public get piece(): Piece | null {
        return this._piece;
    }
}

export default Tile;
