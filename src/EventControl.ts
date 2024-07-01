import DragSource from './DragSource.js';
import DropTarget from './DropTarget.js';
import GameBoard from './GameBoard.js';
class EventControl {
    public dragSource: DragSource | null;
    public dropTarget: DropTarget | null;

    constructor() {
        this.dragSource = null;
        this.dropTarget = null;
    }
    
    public static createEventHandling(): void {
        GameBoard.tiles.forEach(tile => {
            if (tile.hasPiece() && tile.piece.color === 'white') {
                tile.eventControl.dragSource = new DragSource(tile);
            } else {
                tile.eventControl.dropTarget = new DropTarget(tile);
            }
        })
    }
}

export default EventControl;