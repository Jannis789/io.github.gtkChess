import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GObject from 'gi://GObject';
import GameAction from './GameAction.js';
import TileSet, { pieceTile } from './TileSet.js';
import Tile from './Tile.js';

class DragSource extends Gtk.DragSource {
    private _handlerIDs: number[] = [];
    constructor(dragSourceTile: pieceTile) {
        super({
            actions: Gdk.DragAction.MOVE
        });


        dragSourceTile.add_controller(this);
        this._handlerIDs.push(
            this.connect("prepare", () => this.prepareDrag(dragSourceTile))
        );
        this._handlerIDs.push(
            this.connect("drag-begin", (source: Gtk.DragSource, drag: Gdk.Drag) => this.beginDrag(source, dragSourceTile, drag))
        );
        this._handlerIDs.push(
            this.connect("drag-cancel", () => this.cancleDrag())
        );
    }

    private prepareDrag(dragSourceTile: Tile) {
        if (GameAction.playerColor !== dragSourceTile.piece?.color) return;
        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(dragSourceTile);

        return Gdk.ContentProvider.new_for_value(value);
    }

    private beginDrag(source: Gtk.DragSource, dragSourceTile: Tile, drag: Gdk.Drag) {
        if (GameAction.playerColor !== dragSourceTile.piece?.color) return;
        const piece = dragSourceTile.piece;
        if (!piece) return;
        const size = Math.floor(piece.get_width() * 1.15); // +15%
        const imgCenter = size / 2;
        const icon = piece.renderPiece(piece.color, size);
        drag.set_hotspot(-imgCenter + 8, -imgCenter + 2);
        source.set_icon(icon.get_paintable(), 0, 0);
        GameAction.sourceTile = dragSourceTile;
        GameAction.updateGameState('SELECT');
    }

    static createDragSources(dragSourceTiles: pieceTile[]) {
        for (const dragSourceTile of dragSourceTiles) {
            DragSource.createDragSource(dragSourceTile);
        }
    }

    static createDragSource(tile: pieceTile) {
        const newDragSource = new DragSource(tile);
        TileSet.instance.tileDragSourceMap.set(tile, newDragSource);
    }

    private cancleDrag() {
        TileSet.selectedTiles.forEach(tile => tile.highlight = false);
        TileSet.selectedTiles = [];
    }

    public disconnectAll(): void {
        this._handlerIDs.forEach(id => this.disconnect(id));
    }
}
export default DragSource;