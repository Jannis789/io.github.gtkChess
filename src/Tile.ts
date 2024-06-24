import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Piece from './Piece.js';
import DragControl from './DragControl.js';
import GameBoard from './GameBoard.js';
type Position = { x: number, y: number };

class Tile extends Gtk.Button {
    private _piece: null | Piece = null;
    private _protection: boolean = false;
    public eventControl: DragControl = new DragControl();
    public ignorePiece: boolean = false;


    public constructor() {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
    }

    public set protection (protection: boolean) {
        this._protection = protection;
        if (protection && this.hasPiece()) {
            this.eventControl.setDragWidget(this);
        } else {
            this.eventControl.setDropWidget(this);
        }
    }

    public get protection(): boolean {
        return this._protection;
    }

    public get position(): Position {
        const grid: Gtk.Grid = this.get_parent() as Gtk.Grid;
        return { x: grid.query_child(this)[0], y: grid.query_child(this)[1] };
    }

    public set piece(piece: Piece | null) {
        this._piece = piece;
        if (piece === null) {
            this.set_child(null);
        } else {
            this.set_child(piece as unknown as Gtk.Widget);
        }
    }

    public get piece(): Piece | null{
        return this._piece;
    }

    public hasPiece(): this is { piece: Piece } {
        return this.piece !== null;
    }


    public getTileOnNewPosition( perspective: 'player' | 'enemy', dir: string, steps: number): Tile | null {
        const position = this.getNewPosition(this.position, perspective, dir, steps);
        if (!position) return null;
        return GameBoard.get_child_at(position); 
    }

    public getNewPosition(position: Position, perspective: 'player' | 'enemy', dir: string, steps: number): Position | null {
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
        
        const [x, y] = [position.x + dx, position.y + dy];
        return x >= 0 && x <= 7 && y >= 0 && y <= 7 ? { x, y } : null;
    }

    public set selected(selected: boolean) {
        if (selected) {
            this.add_css_class('possible_move_tile');
        } else {
            this.remove_css_class('possible_move_tile');
        }
    }

    

    static {
        GObject.registerClass(Tile);
    }
}

export default Tile;