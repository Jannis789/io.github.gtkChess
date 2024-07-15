import Gtk from 'gi://Gtk?version=4.0';
import UI from './UI.js';
import Position from './Position.js';
import GObject from 'gi://GObject';
import Gdk from 'gi://Gdk?version=4.0';

class DropTarget extends Gtk.DropTarget {
    private handler: number;
    private ui_tile: UI.Tile;
    constructor(private position: Position) {
        super();

        this.set_actions(Gdk.DragAction.MOVE);
        this.set_gtypes([Gtk.Button.$gtype]);

        this.ui_tile = position.uiTile;
        this.ui_tile.add_controller(this);
        this.ui_tile.add_controller(Gtk.DropControllerMotion.new());

        this.handler = this.connect('drop', () => this.executeDrop());
    }

    private executeDrop() {

    }

    static {
        GObject.registerClass(DropTarget);
    }
}

export default DropTarget;
