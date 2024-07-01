import PieceFactory from './PieceFactory.js';
import Gtk from 'gi://Gtk?version=4.0';
import Position from './Position.js';
import GdkPixbuf from 'gi://GdkPixbuf';
import GObject from 'gi://GObject';
import GameBoard from './GameBoard.js';
import { pieceTile } from './Tile.js';
abstract class Piece extends Gtk.Image {
    public size: number = 200;
    public color: PieceFactory.Color;
    public position: Position;
    constructor(props: PieceFactory.pieceProps) {
        super();
        this.color = props.color;
        this.position = props.position;
    }
    public renderPiece(): Piece {
        this.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            `/io/github/gtkChess/img/${this.color}_${this.constructor.name.toLowerCase()}.svg`,
            this.size,
            this.size,
            true
        ));
        return this;
    }

    public getNewImage(newSize: number): Gtk.Image {
        const img = new Gtk.Image();
        img.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            `/io/github/gtkChess/img/${this.color}_${this.constructor.name.toLowerCase()}.svg`,
            newSize,
            newSize,
            true
        ));
        return img;
    }

    abstract regularMoves(): Position[]
    public validMoves(): Position[] {
        let possibleMoves: Position[] = this.regularMoves();
        const thisTile = GameBoard.getChild(this.position);
        if (!this.playerKing) throw new Error('Player has no king');
        const kingPosition = this.playerKing.position;

        GameBoard.pieceTiles.forEach(tile => {
            tile.protection = !tile.protection;
        });

        thisTile.ignorePiece = true;

        for (const move of possibleMoves) {

            const enemyPieceTiles = GameBoard.pieceTiles
                .filter(tile => tile.piece?.color !== this.color)
                .filter(tile => tile.piece.position.equals(move));
                
                const enemyAttackPositions = enemyPieceTiles
                    .map(enemyPieceTile => enemyPieceTile.piece?.regularMoves())
                    .flat();
                
                if (kingPosition.isMember(enemyAttackPositions)) {
                    possibleMoves = possibleMoves.filter(m => m.equals(move));
                }
            
        }

        GameBoard.pieceTiles.forEach(tile => {
            tile.protection = !tile.protection;
        });
        
        thisTile.ignorePiece = true;
        (console as any).log(possibleMoves);
        return possibleMoves;
    }

    public get playerKing(): Piece | null {
        const king = GameBoard.pieceTiles
            .find(tile => tile.piece?.color === this.color && 
                          tile.piece instanceof PieceFactory.King);
        return king ? king.piece : null;
    }

    static {
        GObject.registerClass(Piece as any);
    }
}

export default Piece;