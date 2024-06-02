import Gtk from "gi://Gtk?version=4.0";
import GdkPixbuf from "gi://GdkPixbuf";
import Tile from "./Tile.js";

type Color = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

class Piece extends Gtk.Image {
    public color?: Color;
    public pieceType?: PieceType;
    public tileReference: Tile;
    public isAttackable?: boolean;
    constructor(tile: Tile) {
        super();
        this.tileReference = tile;
    }
    public renderPiece(
        color: Color,
        pieceType: PieceType,
        size: number
    ): Piece {
        this.color = color;
        this.pieceType = pieceType;

        const imgPath = `/io/github/gtkChess/img/${color}_${pieceType}.svg`;
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            size,
            size,
            true
        );
        this.set_from_pixbuf(pixbuf);
        return this;
    }
    public set_position(position: {
        x: number | undefined;
        y: number | undefined;
    }): typeof this | null {
        if (
            position.x === undefined ||
            position.y === undefined ||
            this.tileReference.grid === undefined ||
            this.color === undefined ||
            this.pieceType === undefined
        )
            return null;
        const targetTile = this.tileReference.grid.get_child_at(
            position.x,
            position.y
        );
        if (!(targetTile instanceof Tile)) return null;

        const newPiece = new (this.constructor as new (tile: Tile) => this)(
            targetTile
        );
        newPiece.renderPiece(this.color, this.pieceType, 200);

        this.tileReference.set_child(null);
        targetTile.set_child(newPiece);

        return newPiece;
    }
}

export default Piece;
