import Piece from "./Piece.js";
import GObject from 'gi://GObject';
import GameBoard from "./GameBoard.js";

let board: (string | null)[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

namespace PieceFactory {

    type Color = "white" | "black";
    
    export function initializePieces(): void {

        let classRecord: Record<string, any> = {
            r: Rook,
            n: Knight,
            b: Bishop,
            q: Queen,
            k: King,
            p: Pawn
        };

        GObject.registerClass(Piece as any);
        Object.values(classRecord).forEach(piece => GObject.registerClass(piece));
        
        board.forEach((row, yIndex) => row.forEach((letter, xIndex) => {
            if (letter === null) return;
            const color = letter === letter.toLowerCase() ? "black" : "white";
            const piece = new classRecord[letter.toLowerCase()]();
            piece.color = color;

            GameBoard.get_child_at({x: xIndex, y: yIndex}).piece = piece;
            piece.renderPiece();

        }));
    }

    export class Pawn extends Piece {
        public constructor() {
            super();
        }
    }

    export class Rook extends Piece {
        public constructor() {
            super();
        }
    }

    export class Knight extends Piece {
        public constructor() {
            super();
        }
    }

    export class Bishop extends Piece {
        public constructor() {
            super();
        }
    }

    export class Queen extends Piece {
        public constructor() {
            super();
        }
    }

    export class King extends Piece {
        public constructor() {
            super();
        }
    }
}

export default PieceFactory;