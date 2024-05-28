import Gtk from "gi://Gtk?version=4.0";
import GdkPixbuf from "gi://GdkPixbuf";
import DragControl from "./DragControl.js";

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

type PieceType = "king" | "queen" | "rook" | "knight" | "bishop" | "pawn";

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
    private grid!: Gtk.Grid;

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
                icon: this.renderImage("black", pieceType, 200)
            };
            const whitePiece: Piece = {
                color: "white",
                type: pieceType,
                icon: this.renderImage("white", pieceType, 200)
            };
            this.pieceIconMap.set(blackPiece, blackPiece.icon!);
            this.pieceIconMap.set(whitePiece, whitePiece.icon!);
        }
    }

    public renderImage(color: string, pieceType: string, size: number): Gtk.Image {
        const imgPath = `/io/github/gtkChess/img/${color}_${pieceType}.svg`;
        const image: Gtk.Image = new Gtk.Image();
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            size,
            size,
            true
        );
        image.set_from_pixbuf(pixbuf);
        return image;
    }

    private createPiece({ x, y }: Position): Piece | null {
        const color: Color | null = y < 2 ? "black" : y > 5 ? "white" : null;

        if (color === null) return null;

        const pieceType: PieceType | null =
            y === 0 || y === 7
                ? outerPieceOrder[x]
                : y === 1 || y === 6
                ? "pawn"
                : null;

        if (pieceType === null) return null;

        const icon = this.renderImage(color, pieceType, 200);

        return { type: pieceType, color: color, icon: icon };
    }

    public setObject(button: Gtk.Button, col: number, row: number): void {
        const position: Position = { x: col, y: row };
        const piece = this.createPiece(position);
        const tile: Tile = { position: position, object: button };

        if (piece) {
            tile.piece = piece;
            this.pieces.push(tile.piece);
            button.set_child(tile.piece.icon);

            this.dragControl.setDragSource(tile.object, tile.piece.icon, tile.piece.color, tile.piece.type);
        }
        this.dragControl.setDropSource(tile.object);

        this.tileMap.set(position, tile);
    }

    public setGrid(grid: Gtk.Grid) {
        this.grid = grid;
    }

    public handleCurrentDropAction(
        sourceWidget: Gtk.Button,
        targetWidget: Gtk.Button
    ) {
        const sourceWidgetQuery = this.grid.query_child(sourceWidget);
        const sourceWidgetPosition: Position = {x: sourceWidgetQuery[0], y: sourceWidgetQuery[1]};

        const targetWidgetQuery = this.grid.query_child(targetWidget);
        const targetWidgetPosition: Position = {x: targetWidgetQuery[0], y: targetWidgetQuery[1]};

    }
}

