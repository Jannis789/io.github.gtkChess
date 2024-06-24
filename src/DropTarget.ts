import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import Tile from './Tile.js';
import GameAction from './GameAction.js';
class DropTarget extends Gtk.DropTarget {
    private _handlerIDs: number | null;
    private _currentTile: Tile | null;

    public constructor() {
        super();
        this._handlerIDs = null;
        this._currentTile = null;
        this.set_actions(Gdk.DragAction.MOVE);
        this.set_gtypes([Gtk.Button.$gtype]);
    }

    public setSource(tile: Tile): void {
        this._currentTile = tile;
        tile.add_controller(this);
        tile.add_controller(Gtk.DropControllerMotion.new());
        this._handlerIDs = this.connect('drop', () => this.executeDrop());
    }

    private executeDrop(): void {
        GameAction.targetedTile = this._currentTile;
        GameAction.update("VALIDATE");
    } 
}

export default DropTarget;