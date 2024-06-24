import Tile from "./Tile.js";
import DragSource from "./DragSource.js";
import DropTarget from "./DropTarget.js";
import GObject from "gi://GObject";

class DragControl {
    public dragSource: DragSource | null;
    public dropTarget: DropTarget | null;

    public constructor() {
        this.dragSource = null;
        this.dropTarget = null;
    }

    public setDragWidget(tile: Tile): void {
        this.dragSource = new DragSource();
        this.dragSource.setSource(tile);
    }

    public setDropWidget(tile: Tile): void {
        this.dropTarget = new DropTarget();
        this.dropTarget.setSource(tile);
    }

    static {
        GObject.registerClass(DragSource);
        GObject.registerClass(DropTarget);
    }
}

export default DragControl;