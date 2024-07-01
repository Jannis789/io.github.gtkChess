import GameBoard from './GameBoard.js';
import Piece from './Piece.js';
import Position from './Position.js';
import GObject from 'gi://GObject';

namespace PieceFactory {
    export interface pieceProps {
        color: Color;
        position: Position;
    }

    export type Color = 'white' | 'black';

    const board: (null | string)[][] = [
        [ 'r',  'n',  'b',  'q',  'k',  'b',  'n',  'r'],
        [ 'p',  'p',  'p',  'p',  'p',  'p',  'p',  'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null,  'b', null],
        [ 'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P'],
        [ 'R',  'N',  'B',  'Q',  'K',  'B',  'N',  'R'],
    ] 

    export function createPieces() {
        const letterPieceRecord: Record<string, new (props: pieceProps) => Piece> = {
            'r': Rook,
            'n': Knight,
            'b': Bishop,
            'q': Queen,
            'k': King,
            'p': Pawn,
        };
    
        board.forEach((row, y) => row.forEach((letter, x) => {
            if (letter === null) return;
            const color: Color = letter === letter.toUpperCase() ? 'white' : 'black';
            const PieceClass = letterPieceRecord[letter.toLowerCase()];
            const props = { color: color, position: new Position(x, y) };
            const piece = new PieceClass(props);
            GameBoard.getChild(props.position).piece = piece;
            
            piece.renderPiece();
        }));

    }

    export class Pawn extends Piece {
        constructor(props: pieceProps) {
            super(props);
        }

        regularMoves(): Position[] {
            const tile = GameBoard.getChild(this.position);
            const perspective = tile.piece?.color === 'white' ? 'player' : 'enemy';
            const regularMoves: Position[] = [];

            for (const i of [1,2]) {
                const regularMove = tile.getNewPosition(this.position, perspective, 'down', i);
                if (!regularMove) break;
                const regularTile = GameBoard.getChild(regularMove);
                if (!regularTile.protection) regularMoves.push(regularMove);
            }

            for (const str of ['up-left', 'up-right']) {
                const attackMoves = tile.getNewPosition(this.position, perspective, str, 1);
                if (!attackMoves) break;
                const attackTile = GameBoard.getChild(attackMoves);
                if (attackTile.hasPiece() && !attackTile.protection) regularMoves.push(attackMoves);
            }
            return regularMoves;
        }

        static {
            GObject.registerClass(Pawn);
        }
    }

    export class Rook extends Piece {
        constructor(props: pieceProps) {
            super(props);
        }
        public regularMoves(): Position[] {
            return continuingMoves(['up', 'down', 'left', 'right'], this);
        }

        static {
            GObject.registerClass(Rook);
        }
    }

    export class Knight extends Piece {

        constructor(props: pieceProps) {
            super(props);
        }

        public regularMoves(): Position[] {
            const tile = GameBoard.getChild(this.position);
            const perspective = tile.piece?.color === 'white' ? 'player' : 'enemy';
            const regularMoves: Position[] = [];

            for (const str of ['up', 'down', 'left', 'right']) {
                const prePosition = tile.getNewPosition(this.position, perspective, str, 2);

                if (!prePosition) continue;
                if (str === 'up' || str === 'down') {
                    for (const postDir of ['left', 'right']) {
                        const position = tile.getNewPosition(prePosition, perspective, postDir, 1);
                        if (!position) continue;
                        const targetedTile = GameBoard.getChild(position);
                        if (!targetedTile.protection) regularMoves.push(position);
                    }
                } else {
                    for (const postDir of ['up', 'down']) {
                        const position = tile.getNewPosition(prePosition, perspective, postDir, 1);
                        if (!position) continue;
                        const targetedTile = GameBoard.getChild(position);
                        if (!targetedTile.protection) regularMoves.push(position);
                    }
                }
            }
            return regularMoves;
        }

        static {
            GObject.registerClass(Knight);
        }
    }

    export class Bishop extends Piece {
        constructor(props: pieceProps) {
            super(props);
        }

        public regularMoves(): Position[] {
            return continuingMoves(['up-left', 'up-right', 'down-left', 'down-right'], this);
        }

        static {
            GObject.registerClass(Bishop);
        }
    }

    export class Queen extends Piece {

        constructor(props: pieceProps) {
            super(props);
        }

        public regularMoves(): Position[] {
            return continuingMoves(['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'], this);
        }
        
        static {
            GObject.registerClass(Queen);
        }
    }

    export class King extends Piece {

        constructor(props: pieceProps) {
            super(props);
        }

        regularMoves() {
            const tile = GameBoard.getChild(this.position);
            const perspective = tile.piece?.color === 'white' ? 'player' : 'enemy';
            const regularMoves: Position[] = [];
        
            for (const str of ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right']) {
                const position = tile.getNewPosition(this.position, perspective, str, 1);
                if (!position) continue;
                const targetedTile = GameBoard.getChild(position);
                if (!targetedTile.protection) regularMoves.push(position);
            }
            return regularMoves;
        }

        static {
            GObject.registerClass(King);
        }
    }
}

function continuingMoves(dirs: string[], piece: Piece) {
    const tile = GameBoard.getChild(piece.position);
    const perspective = tile.piece?.color === 'white' ? 'player' : 'enemy';
    const regularMoves: Position[] = [];

    for (const str of dirs) {
        let position: Position | null;
        for (let step = 1;  
             position = tile.getNewPosition(piece.position, perspective, str, step); 
             step++) {

            const tile = GameBoard.getChild(position);
            if (!tile.protection) regularMoves.push(position);

            if (tile.hasPiece()) break;
        }
    }
    return regularMoves;
}

export default PieceFactory;