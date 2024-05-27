import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import GObject from "gi://GObject";
import TileSet from "./Pieces.js";

export default class DragControl {
    private tileSet: TileSet;
    private drag_sources: Gtk.DragSource[] = [];
    private BUTTON_COUNT: number = 0;
    private MAX_BUTTONS: number = 64;
    private buttons: Gtk.Button[] = [];
    private dragSourceButton!: Gtk.Button;

    constructor(SetOfTiles: TileSet) {
        this.tileSet = SetOfTiles;
    }

    setDragSource(button: Gtk.Button, icon: Gtk.Image) {
        // Drag-Source erstellen
        const drag_source = new Gtk.DragSource({
            actions: Gdk.DragAction.MOVE
        });
        const icon_paintable = new Gtk.WidgetPaintable({ widget: icon });
        drag_source.set_icon(icon_paintable, 0, 0);
        icon.add_controller(drag_source);

        // "prepare"-Signal verbinden
        drag_source.connect("prepare", _source => {
            const value = new GObject.Value({} as GObject.Value);
            value.init(Gtk.Button.$gtype);
            value.set_object(button);

            return Gdk.ContentProvider.new_for_value(value);
        });

        // "drag-begin"-Signal verbinden
        drag_source.connect("drag-begin", (_source, drag) => {
            const imgCenter =
                drag_source.get_widget().get_allocated_width() / 2;
            drag.set_hotspot(-imgCenter + 8, -imgCenter - 8);
            this.dragSourceButton = button;
        });
    }

    setDropSource(button: Gtk.Button) {
        this.buttons.push(button);
        this.BUTTON_COUNT++;

        if (this.BUTTON_COUNT !== this.MAX_BUTTONS) return;
        for (const button of this.buttons) {
            const drop_target = Gtk.DropTarget.new(
                Gtk.Button.$gtype,
                Gdk.DragAction.MOVE
            );
            const drop_controller = new Gtk.DropControllerMotion();
            button.add_controller(drop_target);
            button.add_controller(drop_controller);

            drop_target.connect("drop", (target, value) => {
                (console as any).log("Drop detected");
                if (!value) {
                    console.error("Drop value is null");
                    return false;
                }
                const sourceButton = this.dragSourceButton;
                const targetWidget = target.get_widget();

                if (targetWidget instanceof Gtk.Button) {
                    this.tileSet.handleCurrentDropAction(
                        sourceButton,
                        targetWidget
                    );
                }
            });
        }
    }
}

