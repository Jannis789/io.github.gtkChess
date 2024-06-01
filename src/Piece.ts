import Gtk from 'gi://Gtk?version=4.0';
import GdkPixbuf from 'gi://GdkPixbuf';

type Color = 'black' | 'white';
type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';

class Piece extends Gtk.Image {
    public color!: Color;
    public pieceType!: PieceType;
    public isAttackable!: boolean;



    public renderPiece(color: Color, pieceType: PieceType, size: number): Piece {
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
}

export default Piece;
