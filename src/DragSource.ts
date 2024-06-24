import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GObject from 'gi://GObject';
import Tile from './Tile.js';
import GameAction from './GameAction.js';
import GameBoard from './GameBoard.js';

class DragSource extends Gtk.DragSource {
    private _handlerIDs: number[];
    private _currentTile: Tile | null;

    public constructor() {
        super({
            actions: Gdk.DragAction.MOVE
        });
        this._handlerIDs = [];
        this._currentTile = null;
    }

    public setSource(tile: Tile): void {
        tile.add_controller(this);
        this._handlerIDs = [
            this.connect('prepare', () => this.prepare()),
            this.connect('drag-begin', (_, drag: Gdk.Drag) => this.startDrag(drag)),
            this.connect('drag-end', () => this.endDrag())
        ]
        this._currentTile = tile; 
    }

    private prepare(): Gdk.ContentProvider {
        if (!this._currentTile) throw new Error('No tile associated with drag source');

        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(this._currentTile);

        return Gdk.ContentProvider.new_for_value(value);
    }
    
    private startDrag(drag: Gdk.Drag): void {
        if (!this._currentTile || !this._currentTile.hasPiece()) return;

        const piece = this._currentTile.piece;
        const size = Math.floor(piece.get_width() * 1.15); // +15%
        const imgCenter = size / 2;
        piece.size = size;
        const icon = piece.renderPiece();
        drag.set_hotspot(-imgCenter + 8, -imgCenter + 2);
        this.set_icon(icon.get_paintable(), 0, 0);

        GameAction.selectedTile = this._currentTile;
        GameAction.update("SELECT");
    }

    private endDrag(): void {
        if (GameAction.possibleMoves) 
            GameBoard.selectPossibleMoves(GameAction.possibleMoves, false);
    }
}

export default DragSource;
