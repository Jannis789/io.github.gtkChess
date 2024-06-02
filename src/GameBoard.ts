import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Tile from './Tile.js';
import Piece from './Piece.js';
import PieceControl from './PieceControl.js';

type Color = 'black' | 'white';
type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';

class GameBoard extends Gtk.Grid {
    private cssProvider!: Gtk.CssProvider;
    private pieceControl!: PieceControl;
    private tiles!: Tile[];
    private pieceTiles!: Tile[];

    _init(): void {
        super._init({
            margin_end: 10,
            margin_top: 10,
            margin_bottom: 10,
            margin_start: 10,
        });
        this.tiles = [];
        this.pieceTiles = [];
        GObject.registerClass({ GTypeName: `TileButton`, }, Tile);
        GObject.registerClass({ GTypeName: `PieceIcon`, }, Piece);
        this.pieceControl = new PieceControl();
        this.initializeBoard();
        this.pieceControl.tiles = this.tiles;
        this.pieceControl.pieceTiles = this.pieceTiles;
        this.pieceControl.updateGameState = 'INIT';
    }

    private initializeBoard(): void {
        this.cssProvider = new Gtk.CssProvider();
        this.cssProvider.load_from_resource("/io/github/gtkChess/styles.css");

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                const tile = new Tile();

                tile.add_css_class((col % 2 === row % 2) ? 'dark_tile' : 'light_tile');
                tile.add_css_class(this.getClassName(col, row));
                tile.add_css_provider(this.cssProvider);

                this.attach(tile, col, row, 1, 1);

                this.setPiece(tile);
                this.tiles.push(tile);
            }
        }
    }

    private getClassName(col: number, row: number): string {
        if (col === 0 && row === 0) return 'corner_tl';
        if (col === 7 && row === 0) return 'corner_tr';
        if (col === 0 && row === 7) return 'corner_bl';
        if (col === 7 && row === 7) return 'corner_br';
        return 'no_corner';
    }

    private setPiece(tile: Tile): void {
        if (tile === undefined) return;
        const x = tile.column;
        const y = tile.row;
        if (x === undefined || y === undefined) return;

        const color: Color | null = y < 2 ? "black" : y > 5 ? "white" : null;
        if (!color) return;

        const outerPieceOrder: readonly PieceType[] = ["rook","knight","bishop","queen","king","bishop","knight","rook"];

        const pieceType: PieceType | null =
            y === 0 || y === 7
                ? outerPieceOrder[x]
                : y === 1 || y === 6
                ? "pawn"
                : null;
        if (!pieceType) return;
        this.pieceControl.createPiece(tile, color, pieceType);

        this.pieceTiles.push(tile);
    }
}

export default GameBoard;
