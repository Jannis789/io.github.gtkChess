import GameBoard from "./GameBoard.js";
import Tile from "./Tile.js";
import Piece from "./Piece.js";
import UI from "./UI.js";

class Position {
    constructor(public x: number, public y: number) { }

    public get tile(): Tile {
        if (this.isOutOfBounds) throw new Error("Position is out of bounds");
        return GameBoard[this.x][this.y];
    }

    public equals(position: Position): boolean {
        return this.x === position.x && this.y === position.y;
    }

    public get piece(): Piece | null {
        if (this.isOutOfBounds) throw new Error("Position is out of bounds");
        return GameBoard[this.x][this.y].piece;
    }

    public get isOutOfBounds(): boolean {
        return GameBoard[this.x] && GameBoard[this.x][this.y] === undefined;
    }

    public get uiPiece(): UI.Piece | undefined {
        if (this.isOutOfBounds) throw new Error("Position is out of bounds");
        return UI.Board.pieces[this.x][this.y] || undefined;
    }

    public get uiTile(): UI.Tile {
        if (this.isOutOfBounds) throw new Error("Position is out of bounds");
        const tile = UI.Board.tiles[this.x][this.y];
        if (!tile) throw new Error("UI Tile not found");
        return tile;
    }

    public isMemberOf(positionArray: Position[]): boolean {
        return positionArray.some(position => position.equals(this));
    }

    public getNewPosition(perspective: 'player' | 'enemy', direction: string, steps: number): Position | null {
        const [preDx, preDy] = {
            "down": [0, steps],
            "up": [0, -steps],
            "left": [-steps, 0],
            "right": [steps, 0],
            "up-left": [-steps, steps],
            "up-right": [steps, steps],
            "down-left": [-steps, -steps],
            "down-right": [steps, -steps],
        }[direction] as [number, number];

        const dx = perspective === 'player' ? preDx : -preDx;
        const dy = perspective === 'player' ? preDy : -preDy;
        const [x, y] = [this.x + dx, this.y + dy];

        if (x >= 0 && x < GameBoard.size() && y >= 0 && y < GameBoard.size()) {
            return GameBoard[x][y].position;
        }
        return null;
    }
}

export default Position;
