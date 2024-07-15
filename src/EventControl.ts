import DragSource from "./DragSource.js";
import DropTarget from "./DropTarget.js";
import Position from "./Position.js";
import UI from "./UI.js";
class EventControl {
    private dragSource: DragSource | null;
    private dropTarget: DropTarget | null;
    constructor() {
        this.dragSource = null;
        this.dropTarget = null;
    }

    public addDragSource(position: Position) {
        this.dragSource = new DragSource(position);
    }

    public addDropTarget(position: Position) {
        this.dropTarget = new DropTarget(position);
    }
}

export default EventControl;
