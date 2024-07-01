import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import GameAction from './GameAction.js';
import Tile from './Tile.js';
import Gdk from 'gi://Gdk?version=4.0';

class DropTarget extends Gtk.DropTarget {
    private _handlerID: number;
    constructor(parent: Tile) {
        super();
        
        this.set_actions(Gdk.DragAction.MOVE);
        this.set_gtypes([Gtk.Button.$gtype]);        
        parent.add_controller(this);
        parent.add_controller(Gtk.DropControllerMotion.new());
        
        this._handlerID = this.connect('drop', () => this.executeDrop());
    }

    private executeDrop(): void {
        const widget = this.get_widget() as Tile;
        GameAction.targetedPosition = widget.position;
        GameAction.update(GameAction.GameState.VALIDATE);
    } 

    static {
        GObject.registerClass(DropTarget);
    }
}

export default DropTarget;