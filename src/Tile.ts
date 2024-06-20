import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Piece from './Piece.js';

type Position = { x: number, y: number };

class Tile extends Gtk.Button {
    private static _piece: null | typeof Piece = null;
    public static protected: boolean;
    public constructor(protection: boolean) {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
        Tile.protected = protection;
    }

    public get position(): Position {
        const parent: Gtk.Grid = this.get_parent() as Gtk.Grid;
        return { x: parent.query_child(this)[0], y: parent.query_child(this)[1] };
    }

    public set piece (piece: typeof Piece) {
        Tile._piece = piece;
        this.set_child(piece as unknown as Gtk.Widget);
    }

    public get piece(): typeof Piece | null{
        return Tile._piece || null;
    }

    static {
        GObject.registerClass(Tile);
    }
}

export default Tile;