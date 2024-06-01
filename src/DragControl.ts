import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GObject from 'gi://GObject';
import Tile from './Tile.js';
import PieceControl from './PieceControl.js';

class DragControl {
    private dragSourceTiles!: Tile[];
    private dropSourceTiles!: Tile[];
    public pieceControl!: PieceControl

    constructor(dragSourceTiles: Tile[], dropSourceTiles: Tile[]) {
        this.dragSourceTiles = dragSourceTiles;
        this.dropSourceTiles = dropSourceTiles;
        this.setDragSources();
        this.setDropSources();
    }

    private setDragSources() {
        for (const dragSourceTile of this.dragSourceTiles) {
            const dragSource = new Gtk.DragSource({
                actions: Gdk.DragAction.MOVE
            });

            dragSourceTile.add_controller(dragSource);

            dragSource.connect("prepare", () => this.prepareDrag(dragSourceTile));
            dragSource.connect("drag-begin", (source: Gtk.DragSource, drag: Gdk.Drag) => this.beginDrag(source, dragSourceTile, drag));
        }
    }

    private prepareDrag(dragSourceTile: Tile) {
        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(dragSourceTile);

        return Gdk.ContentProvider.new_for_value(value);
    }

    private beginDrag(source: Gtk.DragSource, dragSourceTile: Tile, drag: Gdk.Drag) {
        const piece = dragSourceTile.piece;
        if (!piece) return;
        const size = Math.floor(piece.get_width() * 1.15); // +15%
        const imgCenter = size / 2;
        piece.set_visible(false);
        const icon = piece.renderPiece(piece.color, piece.pieceType, size);
        drag.set_hotspot(-imgCenter + 8, -imgCenter + 2);
        source.set_icon(icon.get_paintable(), 0, 0);
        if (this.pieceControl) {
            this.pieceControl.updateGameState = 'SELECT';
            this.pieceControl.dragSource = dragSourceTile;
        } else {
            throw Error;
        }
    }

    private setDropSources() {
        for (const dropDestination of this.dropSourceTiles) {
            const dropTarget = Gtk.DropTarget.new(
                Gtk.Button.$gtype,
                Gdk.DragAction.MOVE
            );
            const dropController = Gtk.DropControllerMotion.new();
            dropDestination.add_controller(dropTarget);
            dropDestination.add_controller(dropController);

            dropTarget.connect('drop', () =>
                this.handleDrop(dropDestination));
        }
    }

    private handleDrop(dropDestination: Tile) {
        if (this.pieceControl) {
            this.pieceControl.updateGameState = 'VALIDATE';
            this.pieceControl.dropDestination = dropDestination;
        } else {
            throw Error;
        }
    }
}

export default DragControl;

