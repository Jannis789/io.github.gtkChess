import Tile from "./Tile.js";
import Position from "./Position.js";

class GameBoard extends Array<Tile[]> {
    private static _instance: GameBoard;
    public size = () => this.numSize;
    private constructor(private numSize = 8) {
        super();
    }

    public static get instance(): GameBoard {
        return GameBoard._instance || (GameBoard._instance = new GameBoard());
    }

    public placeTiles(): void {
        for (let i = 0; i < this.numSize; i++) {
            this.push([]);
            for (let j = 0; j < this.numSize; j++) {
                this[i][j] = new Tile(new Position(i, j));
            }
        }
    }

    public printDraft(): void {
        for (let j = 0; j < this.numSize; j++) {
            let row = '';
            for (let i = 0; i < this.numSize; i++) {
                const piece = this[i][j].piece;
                if (piece) {
                    if (piece.color === 'white') {
                        row += piece.type.toUpperCase()[0];
                    } else {
                        row += piece.type.toLowerCase()[0];
                    }
                } else {
                    row += '-';
                }
                row += ' ';
            }
            console.log(row);
        }
    }
    
}

export default GameBoard.instance;
