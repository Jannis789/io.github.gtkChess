import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import GObject from "gi://GObject";
import TileSet from "./TileSet.js";

export default class DragControl {
    private tileSet: TileSet;
    private BUTTON_COUNT: number = 0;
    private MAX_BUTTON_COUNT: number = 64;
    private buttons: Gtk.Button[] = [];
    private dragSourceButton!: Gtk.Button;

    constructor(setOfTiles: TileSet) {
        this.tileSet = setOfTiles;
    }

    setDragSource(
        button: Gtk.Button,
        icon: Gtk.Image,
        color: string,
        type: string
    ) {
        const dragSource = new Gtk.DragSource({
            actions: Gdk.DragAction.MOVE
        });

        button.add_controller(dragSource);

        dragSource.connect("prepare", this.prepareSource.bind(this, button));
        dragSource.connect(
            "drag-begin",
            this.startDrag.bind(this, button, icon, color, type)
        );
        dragSource.connect("drag-end", this.endDrag.bind(this));
        dragSource.connect("drag-cancel", this.cancelDrag.bind(this));
    }

    prepareSource(
        button: Gtk.Button,
        _source: Gtk.DragSource
    ): Gdk.ContentProvider {
        const value = new GObject.Value({} as GObject.Value);
        value.init(Gtk.Button.$gtype);
        value.set_object(button);

        return Gdk.ContentProvider.new_for_value(value);
    }

    startDrag(
        button: Gtk.Button,
        icon: Gtk.Image,
        color: string,
        type: string,
        _source: Gtk.DragSource,
        drag: Gdk.Drag
    ): void {
        (console as any).log("Drag recognized");
        this.dragSourceButton = button;

        const size = Math.floor(icon.get_width() * 1.15); // +15% size

        button.get_child()!.set_visible(false);

        const imgCenter = size / 2;
        drag.set_hotspot(-imgCenter + 8, -imgCenter - 8);

        const img = this.tileSet.renderImage(color, type, size);
        _source.set_icon(img.get_paintable(), 0, 0);
    }

    setDropSource(button: Gtk.Button): void {
        this.buttons.push(button);
        this.BUTTON_COUNT++;

        if (this.BUTTON_COUNT !== this.MAX_BUTTON_COUNT) return;
        for (const btn of this.buttons) {
            const dropTarget = Gtk.DropTarget.new(
                Gtk.Button.$gtype,
                Gdk.DragAction.MOVE
            );
            const dropController = Gtk.DropControllerMotion.new();

            btn.add_controller(dropTarget);
            btn.add_controller(dropController);

            dropTarget.connect(
                "drop",
                (target: Gtk.DropTarget, value: GObject.Value) =>
                    this.handleDrop(target, value, btn)
            );
        }
    }

    private handleDrop(
        target: Gtk.DropTarget,
        value: GObject.Value,
        button: Gtk.Button
    ): boolean {
        if (!value) {
            console.error("Drop value is null");
            return false;
        } else {
            (console as any).log("Drop recognized");
        }

        const sourceButton = this.dragSourceButton;
        this.tileSet.handleCurrentDropAction(sourceButton, button);

        return true;
    }

    private endDrag(_source: Gtk.DragSource, drag: Gdk.Drag) {
        (console as any).log("Drag ended");
    }

    private cancelDrag(_source: Gtk.DragSource, drag: Gdk.Drag) {
        (console as any).log("Drag cancelled");
    }
}

