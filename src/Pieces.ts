import Gtk from "gi://Gtk?version=4.0";
import GdkPixbuf from "gi://GdkPixbuf";
import DragControl from "./DragControl.js";
import GameBoard from "./GameBoard.js";
const pieceNames: readonly PieceType[] = [
    "king",
    "queen",
    "rook",
    "knight",
    "bishop",
    "pawn"
];
const outerPieceOrder: readonly PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook"
] as const;

// Definieren von PieceType als Union-Typ der Zeichenfolgen
type PieceType = "king" | "queen" | "rook" | "knight" | "bishop" | "pawn";

// Definieren des Color-Typs als Union-Typ
type Color = "black" | "white";

type Piece = {
    color: Color;
    type: PieceType;
    icon: Gtk.Image;
};

type Position = {
    x: number;
    y: number;
};

type Tile = {
    position: Position;
    object: Gtk.Button;
    piece?: Piece;
};

export default class TileSet {
    private pieceIconMap: WeakMap<Piece, Gtk.Image>;
    private tileMap: WeakMap<Position, Tile>;
    private pieces: Piece[] = [];
    private dragControl: DragControl;

    constructor() {
        this.pieceIconMap = new WeakMap<Piece, Gtk.Image>();
        this.tileMap = new WeakMap<Position, Tile>();
        this.dragControl = new DragControl(this);
        this.initializePieceIcons();
    }

    private initializePieceIcons() {
        for (const pieceType of pieceNames) {
            const blackPiece: Piece = {
                color: "black",
                type: pieceType,
                icon: this.getImage("black", pieceType)
            };
            const whitePiece: Piece = {
                color: "white",
                type: pieceType,
                icon: this.getImage("white", pieceType)
            };
            this.pieceIconMap.set(blackPiece, blackPiece.icon!);
            this.pieceIconMap.set(whitePiece, whitePiece.icon!);
        }
    }

    private getImage(color: string, pieceType: string): Gtk.Image {
        const imgPath = `/io/github/gtkChess/img/${color}_${pieceType}.svg`;
        const image: Gtk.Image = new Gtk.Image();
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            200,
            200,
            true
        );
        image.set_from_pixbuf(pixbuf);
        return image;
    }

    createPiece({ x, y }: Position): Piece | null {
        const color: Color | null = y < 2 ? "black" : y > 5 ? "white" : null;

        if (color === null) return null;

        const pieceType: PieceType | null =
            y === 0 || y === 7
                ? outerPieceOrder[x]
                : y === 1 || y === 6
                ? "pawn"
                : null;

        if (pieceType === null) return null;

        const icon = this.getImage(color, pieceType);

        return { type: pieceType, color: color, icon: icon };
    }

    setObject(button: Gtk.Button, col: number, row: number): void {
        const position: Position = { x: col, y: row };
        const piece = this.createPiece(position);
        const tile: Tile = { position: position, object: button };

        if (piece) {
            tile.piece = piece;
            this.pieces.push(tile.piece);
            button.set_child(tile.piece.icon);

            this.dragControl.setDragSource(tile.object, tile.piece.icon);
        }
        this.dragControl.setDropSource(tile.object);

        this.tileMap.set(position, tile);
    }

    handleCurrentDropAction(
        sourceWidget: Gtk.Button,
        targetWidget: Gtk.Button
    ) {}
}

