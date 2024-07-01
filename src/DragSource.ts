import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Tile from './Tile.js';
import Gdk from 'gi://Gdk?version=4.0';
import GameAction from './GameAction.js';

class DragSource extends Gtk.DragSource {
    private _handlerIds: number[];
    public constructor(parent: Tile) {
        super({
            actions: Gdk.DragAction.MOVE,
        });
        parent.add_controller(this);
        
        this._handlerIds = [
            this.connect('prepare', () => this.prepare()),
            this.connect('drag-begin', (_, drag: Gdk.Drag) => this.startDrag(drag)),
            this.connect('drag-end', () => this.endDrag())
        ];
    }
    private prepare(): Gdk.ContentProvider {
        if (!this.get_widget()) throw new Error('No tile associated with drag source');

        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(this.get_widget());

        return Gdk.ContentProvider.new_for_value(value);
    }

    private startDrag(drag: Gdk.Drag): void {
        const widget = this.get_widget() as Tile;
        if (!widget || !widget.hasPiece()) return;

        const piece = widget.piece;
        const size = Math.floor(piece.get_width() * 1.15); // +15%
        const imgCenter = size / 2;
        const icon = piece.getNewImage(size);
        drag.set_hotspot(-imgCenter + 8, -imgCenter + 2);
        this.set_icon(icon.get_paintable(), 0, 0);
        piece.set_visible(false);
        
        GameAction.selectedPosition = widget.position;
        GameAction.update(GameAction.GameState.SELECT);
    }

    private endDrag(): void {
        if (GameAction.currentState === GameAction.GameState.SELECT) {
            GameAction.update(GameAction.GameState.CANCEL);
        }
    }

    static {
        GObject.registerClass(DragSource);
    }
}

export default DragSource;