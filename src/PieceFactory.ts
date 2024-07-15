import Piece from "./Piece.js";
import Position from "./Position.js";
import GameBoard from "./GameBoard.js";
namespace PieceFactory {

    export let draftBoard = [
        ["r", "p", null, null, null, null, "P", "R"],
        ["n", "p", null, null, null, null, "P", "N"],
        ["b", "p", null, null, null, null, "P", "B"],
        ["q", "p", null, null, null, null, "P", "Q"],
        ["k", "p", null, null, null, null, "P", "K"],
        ["b", "p", null, null, null, null, "P", "B"],
        ["n", "p", null, null, null, null, "P", "N"],
        ["r", "p", null, null, null, null, "P", "R"]
    ];

    export function placePieces(): void {
        const pieceLineUp: Record<string, new (position: Position, color: string) => Piece> = {
            "b": Bishop,
            "r": Rook,
            "q": Queen,
            "k": King,
            "p": Pawn,
            "n": Knight
        };

        for (let i = 0; i < draftBoard.length; i++) {
            for (let j = 0; j < draftBoard[i].length; j++) {
                const letter = draftBoard[i][j];
                if (!letter) continue;

                const color = letter.toUpperCase() === letter ? "white" : "black";
                GameBoard[i][j].piece = new pieceLineUp[letter.toLowerCase()](GameBoard[i][j].position, color);

                if (color === 'white') GameBoard[i][j].protection = true; // weil, 'white' als erstes dran ist
            }
        }
    }

    export class Pawn extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            const perspective = this.color === 'white' ? 'player' : 'enemy';
            return [];
        }
    }

    export class Knight extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            return [];
        }
    }

    export class Bishop extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            return [];
        }
    }

    export class Rook extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            return [];
        }
    }

    export class Queen extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            return [];
        }
    }

    export class King extends Piece {
        constructor(position: Position, color: string) {
            super(position, color);
        }

        public get possibleMoves(): Position[] {
            return [];
        }
    }
}
export default PieceFactory
