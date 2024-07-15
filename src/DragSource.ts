import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GObject from 'gi://GObject';
import GameLoop from './GameLoop.js';
import Position from './Position.js';
import UI from './UI.js';

class DragSource extends Gtk.DragSource {
    private handlers: number[] = [];
    private size: number = 0;
    private ui_tile: UI.Tile;

    public constructor(private position: Position) {
        super({
            actions: Gdk.DragAction.MOVE,
        });

        this.ui_tile = position.uiTile;

        this.ui_tile.add_controller(this);
        this._connectHandlers();
    }

    private _connectHandlers() {
        this.handlers = [
            this.connect('prepare', () => this.prepare()),
            this.connect('drag-begin', (_, drag: Gdk.Drag) => this.startDrag(drag)),
            this.connect('drag-end', () => this.endDrag())
        ]
    }

    private get piece(): UI.Piece | null {
        return this.ui_tile.get_child() as UI.Piece | null;
    }

    private prepare() {
        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(this.ui_tile);

        return Gdk.ContentProvider.new_for_value(value);
    }

    private startDrag(drag: Gdk.Drag) {
        if (!this.piece) throw new Error("Can't set drag source without a piece");

        this.size = this.piece.get_width() > 0 ? this.piece.get_width() : this.size;
        const iconCenter = this.size / 2;
        const icon = this.piece.getNewImage(this.size);

        drag.set_hotspot(-iconCenter + 8, -iconCenter + 2);
        this.set_icon(icon.get_paintable(), 0, 0);
        this.piece.set_visible(false);
    }

    private endDrag() {
        if (!this.piece) throw new Error("will be not happening");
        GameLoop.dragPosition = this.position;
        GameLoop.updateGameState('DROP');
    }

    static {
        GObject.registerClass(DragSource);
    }
}

export default DragSource;
