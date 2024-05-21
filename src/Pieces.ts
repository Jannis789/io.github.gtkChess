import Gtk from "gi://Gtk?version=4.0";
import Gio from 'gi://Gio';
import GdkPixbuf from 'gi://GdkPixbuf';

enum PieceType {
    king,
    queen,
    rook,
    knight,
    bishop,
    pawn
}
enum Color {
    black,
    white
}

interface Piece {
    type: PieceType;
    color: Color;
    imgPath: string;
}

interface Position {
    x: number;
    y: number;
}

class Tile {
    position: Position;
    piece: Piece | null;
    object: Gtk.Button;

    constructor(position: Position, piece: Piece | null, object: Gtk.Button) {
        this.position = position;
        this.piece = piece;
        this.object = object;
    }
}

class TileSet {
    private readonly tileSet = new Map<Position, Tile>();

    addTile(tile: Tile): void {
        this.tileSet.set(tile.position, tile);
    }

    getTile(position: Position): Tile {
        const tile = this.tileSet.get(position);
        return tile!;
    }

    getTiles(): ReadonlyMap<Position, Tile> {
        return this.tileSet;
    }
}

export default class Pieces {
    private tileSet = new TileSet();
    private readonly outerPieceOrder = [
        PieceType.rook, PieceType.knight, PieceType.bishop, PieceType.queen,
        PieceType.king, PieceType.bishop, PieceType.knight, PieceType.rook
    ] as const;

    constructor() {}

    setObject(button: Gtk.Button, col: number, row: number): void {
        const position = { x: col, y: row };
        const piece = this.createPiece(position);
        const tile = new Tile(position, piece, button);
        this.tileSet.addTile(tile);
        this.setPieceAt(tile);
    }

    private createPiece({ x, y }: Position): Piece | null {
        const color =
            y < 2 ? Color.black :
            y > 5 ? Color.white :
            null;

        if (color === null) return null;

        const type =
            (y === 0 || y === 7) ? this.outerPieceOrder[x] :
            (y === 1 || y === 6) ? PieceType.pawn :
            null;

        if (type === null) return null;

        return {
            type,
            color,
            imgPath: `/io/github/gtkChess/img/${Color[color]}_${PieceType[type]}.svg`
        };
    }

    setPieceAt(tile: Tile): void {
        if (tile.piece === null) return;
        const button: Gtk.Button = tile.object;
        const file: Gio.File = Gio.File.new_for_uri('resource://' + tile.piece.imgPath);
        const inputStream: Gio.InputStream = file.read(null);
        const image: Gtk.Image = new Gtk.Image();
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_stream_at_scale(inputStream, 400, 400, true, null);
        image.set_from_pixbuf(pixbuf);
        button.set_child(image);
    }

}

