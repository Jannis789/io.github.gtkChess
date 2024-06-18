import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GameAction from './GameAction.js';
import Tile from './Tile.js';
import TileSet from './TileSet.js';

export default class DropTarget extends Gtk.DropTarget {
    private _handlerID: number;
    constructor(dropDestination: Tile) {
        super();
        this.set_actions(Gdk.DragAction.MOVE);
        this.set_gtypes([Gtk.Button.$gtype]);

        const dropController = Gtk.DropControllerMotion.new();

        dropDestination.add_controller(this);
        dropDestination.add_controller(dropController);

        this._handlerID = this.connect('drop', () => this.handleDrop(dropDestination));
    }

    private handleDrop(dropDestination: Tile) {
        GameAction.DropTile = dropDestination;
        GameAction.updateGameState('VALIDATE');
    }

    static createDropTargets(dropDestinationTiles: Tile[]) {
        for (const dropDestination of dropDestinationTiles) {
            new DropTarget(dropDestination);
        }
    }

    static createDropTarget(dropDestination: Tile) {
        const newDropTarget = new DropTarget(dropDestination);
        TileSet.instance.tileDropTargetMap.set(dropDestination, newDropTarget);
    }

    public disconnectAll(): void {
        this.disconnect(this._handlerID);
    }
}
