import Gtk from 'gi://Gtk?version=4.0';
import GdkPixbuf from 'gi://GdkPixbuf';
import Tile from './Tile.js';
import GameBoard from './GameBoard.js';
import PieceFactory from './PieceFactory.js';

type Position = { x: number, y: number };
type Color = 'white' | 'black';

abstract class Piece extends Gtk.Image {
    private _color: Color | undefined;
    private _perspective: 'player' | 'enemy' | undefined;
    public size: number;

    public constructor() {
        super();
        PieceFactory.pieces.push(this);
        this.size = 200;
        this.set_vexpand(true);
        this.set_hexpand(true);
    }

    public get parent(): Tile {
        if (this.get_parent() === null) throw new Error('Parent is null');
        return this.get_parent() as Tile;
    }

    public get color(): Color {
        if (this._color === undefined) throw new Error('Color is undefined');
        return this._color;
    }

    public set color(color: Color) {
        this.perspective = (color === 'white') ? 'player' : 'enemy';
        this._color = color;
    }

    public get perspective(): 'player' | 'enemy' {
        if (this._perspective === undefined) throw new Error('Perspective is undefined');
        return this._perspective;
    }

    public set perspective(perspective: 'player' | 'enemy') {
        this._perspective = perspective;
    }

    public static get type(): string {
        return this.name.toLowerCase();
    }

    public renderPiece(): Piece {
        const imgPath = `/io/github/gtkChess/img/${this.color}_${this.constructor.name.toLowerCase()}.svg`;
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            this.size,
            this.size,
            true
        );
        this.set_from_pixbuf(pixbuf);
        return this;
    }
    
    public selectPossibleMoves(): void {
        (console as any).log(this.possibleMoves);
    }

    public moveToPosition(position: Position): Piece {
        this.parent.piece = null;
        const newPiece = GameBoard.get_child_at(position).piece = new (this.constructor as { new(): Piece})();
        newPiece.color = this.color;
        newPiece.renderPiece();
        return GameBoard.get_child_at(position).piece as Piece;
    }

    public get playerKing(): PieceFactory.King {
        for (const piece of PieceFactory.pieces) {
            if (piece.color === this.color && piece instanceof PieceFactory.King) return piece;
        }

        throw new Error('Player king not found');
    }

    public get enemyKing(): PieceFactory.King {
        for (const piece of PieceFactory.pieces) {
            if (piece.color !== this.color && piece instanceof PieceFactory.King) return piece;
        }

        throw new Error('Enemy king not found');
    }

    abstract get possibleMoves(): Position[];
}

export default Piece;