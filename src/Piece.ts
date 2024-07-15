import GameBoard from "./GameBoard.js";
import Position from "./Position.js";
abstract class Piece {
    public type: string = this.constructor.name.toLowerCase();
    constructor(public position: Position, public color: string) {
    }

    public moveTo(position: Position) {
        this.position.tile.piece = null; // lösche die alte Figur
        this.position = position; // gib die neue Position durch
        position.tile.piece = this; // gib den neuen Tile die Figur
    }

    abstract get possibleMoves(): Position[]
}


export default Piece;
