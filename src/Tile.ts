import Gtk from 'gi://Gtk?version=4.0';
import GameBoard from './GameBoard.js';
import Piece from './Piece.js';
import TileSet, { pieceTile } from './TileSet.js';


class Tile extends Gtk.Button {
    private _piece: Piece | null = null;
    private _cssProvider?: Gtk.CssProvider;
    public constructor() {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
    }

    public get gameBoard(): GameBoard {
        const parent = this.get_parent();
        if (parent instanceof GameBoard) return parent;
        throw Error (`parent of ${this.constructor.name} is not an Instance of GameBoard`);
    }

    public get position(): { x: number, y: number } {
        return { x: this.column, y: this.row };
    }

    public get column(): number {
        return this.gameBoard.query_child(this)[0];
    }

    public get row(): number {
        return this.gameBoard.query_child(this)[1];
    }

    public colorize(class_name: string, cssProvider: Gtk.CssProvider): void {
        this._cssProvider = cssProvider;
        this.add_css_class(class_name);
        this.get_style_context().add_provider(cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);
    }

    getNewPosition(perspective: 'player' | 'enemy', dir: string, steps: number): { x: number, y: number } | null {
        if (steps < 0) throw Error(`Only positive steps allowed, got ${steps} steps`);
        
        const [preDx, preDy] = {
            "down": [0, steps],
            "up": [0, -steps],
            "left": [-steps, 0],
            "right": [steps, 0],
            "up-left": [-steps, -steps],
            "up-right": [steps, -steps],
            "down-left": [-steps, steps],
            "down-right": [steps, steps],
        }[dir] as [number, number];
        
        const dx = perspective === 'enemy' ? -preDx : preDx;
        const dy = perspective === 'enemy' ? -preDy : preDy;
        
        const [x, y] = [this.column + dx, this.row + dy];
        
        return x >= 0 && x <= 7 && y >= 0 && y <= 7 ? { x, y } : null;
    }

    public set piece(piece: Piece | null) {
        this._piece = piece;
        if (piece === null) {
            this.set_child(null);
            return;
        }
        
        TileSet.instance.pieceTileMap.set(piece, this);
        TileSet.pieceTiles.push(this as pieceTile);
        this.set_child(piece);
    }

    public get piece(): Piece | null {
        return this._piece;
    }

    public hasPiece(): this is pieceTile {
        return this.piece !== null;
    }

    public isOccupiedBy(color: 'black' | 'white' | null, pieceType: typeof Piece): boolean {
        if (!this.hasPiece()) return false;
        if (this.piece.color === color || color === null) {
            if (this.piece instanceof pieceType) return true;
        }
        return false;
    }
    public set highlight(state: boolean) {
        if (!this._cssProvider) throw Error("cssProvider not defined");
        if (state) {
            this.colorize('highlighted_tile', this._cssProvider);
            TileSet.selectedTiles.push(this);
        } else {
            this.remove_css_class('highlighted_tile');
        }
    }
}

export default Tile;