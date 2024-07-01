import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Piece from './Piece.js';
import EventControl from './EventControl.js';
import GameBoard from './GameBoard.js';
import Position from './Position.js';

export type pieceTile = Tile & { piece: Piece };

class Tile extends Gtk.Button {
    private _piece: null | Piece;
    public eventControl: EventControl;
    public protection: boolean;
    public ignorePiece: boolean = false;
    constructor() {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
        this.set_focus_on_click(false);
        this._piece = null;
        this.eventControl = new EventControl();
        this.protection = false;
    }

    public set piece(piece: Piece | null) {
        if (this.hasPiece()) {
            GameBoard.pieceTiles.splice(GameBoard.pieceTiles.indexOf(this), 1);
        }
        this._piece = piece;
        if (piece && this.hasPiece()) {
            this.set_child(piece);
            GameBoard.pieceTiles.push(this);
        } else {
            this.set_child(null);
        }
    }

    public get piece(): Piece | null {
        return this._piece;
    }

    public get position(): Position {
        const x = (this.get_parent() as Gtk.Grid).query_child(this)[0];
        const y = (this.get_parent() as Gtk.Grid).query_child(this)[1];
        return new Position(x, y);

    }

    hasPiece(): this is pieceTile {
        if (this.ignorePiece) return false;
        return this.piece !== null;
    }


    public getNewPosition(position: Position, perspective: 'player' | 'enemy', dir: string, steps: number): Position | null {
        const [preDx, preDy] = {
            "down": [0, -steps],
            "up": [0, steps],
            "left": [steps, 0],
            "right": [-steps, 0],
            "up-left": [steps, -steps],
            "up-right": [-steps, -steps],
            "down-left": [steps, steps],
            "down-right": [-steps, steps],
        }[dir] as [number, number];
        
        const dx = perspective === 'player' ? preDx : -preDx;
        const dy = perspective === 'player' ? preDy : -preDy;
        
        const pos = new Position(position.x + dx, position.y + dy);
        
        return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8 ? pos : null;
    }


    static {
        GObject.registerClass(Tile);
    }
}

export default Tile;