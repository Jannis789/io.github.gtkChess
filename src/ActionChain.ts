import Position from "./Position.js";
import Piece from "./Piece.js";
import UI from "./UI.js";

export interface Props {
    position: Position;
    color?: string;
    piece?: string | null;
}

class ActionChain extends Array<Props> {
    private static _instance: ActionChain;
    constructor() {
        super();
    }

    public static get instance(): ActionChain {
        return ActionChain._instance = new ActionChain() ||
            ActionChain._instance;
    }

    public build(): void {
        for (const { position, color, piece } of this) {
            const ui_tile = position.uiTile;
            if (!piece) {
                ui_tile.set_child(null);
                continue;
            };
            if (color && piece) {
                const newUIPiece = new UI.Piece(piece, color);
                ui_tile.set_child(newUIPiece);
                newUIPiece.renderPiece();
            }
        }
    }
}

export default ActionChain.instance;
