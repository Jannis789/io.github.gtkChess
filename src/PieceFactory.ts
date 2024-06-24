import Piece from "./Piece.js";
import GObject from 'gi://GObject';
import GameBoard from "./GameBoard.js";

var board: (null | string)[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'b', null],
    [null, 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

type Position = { x: number, y: number };

namespace PieceFactory {
    var searchForCheck = false;
    export const pieces: Piece[] = [];

    export function initializePieces(): void {
        var classRecord: Record<string, new () => Piece> = {
            r: Rook,
            n: Knight,
            b: Bishop,
            q: Queen,
            k: King,
            p: Pawn
        } as const;

        GObject.registerClass(Piece as any);
        Object.values(classRecord).forEach(piece => GObject.registerClass(piece));

        board.forEach((row, yIndex) => row.forEach((letter, xIndex) => {
            if (letter === null) return;
            const color = letter === letter.toLowerCase() ? "black" : "white";
            const piece = new classRecord[letter.toLowerCase()]();
            piece.color = color;

            GameBoard.get_child_at({ x: xIndex, y: yIndex }).piece = piece;
            piece.renderPiece();
        }));
    }

    export class Pawn extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            const tile = this.parent;
            const possibleMoves: Position[] = [];
            if (!tile) throw new Error('Parent Element not found');

            for (const step of [1, 2]) {
                const tileAtTargetPosition = tile.getTileOnNewPosition(this.perspective, 'up', step);
                if (!tileAtTargetPosition || tileAtTargetPosition.protection || tileAtTargetPosition.hasPiece()) break;
                possibleMoves.push(tileAtTargetPosition.position);
            }

            ['up-left', 'up-right'].forEach(dir => {
                const atteckedTile = tile.getTileOnNewPosition(this.perspective, dir, 1);
                if (!atteckedTile || !atteckedTile.hasPiece() || atteckedTile.protection) return;
                possibleMoves.push(atteckedTile.position);
            });

            return validatePossibleMoves(possibleMoves, this);
        }
    }

    export class King extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            const tile = this.parent;
            const possibleMoves: Position[] = [];
            ['up', 'down', 'left', 'right'].forEach(dir => {
                const targetedTile = tile.getTileOnNewPosition(this.perspective, dir, 1);
                if (!targetedTile || targetedTile.protection) return;
                possibleMoves.push(targetedTile.position);
            });

            return validatePossibleMoves(possibleMoves, this);
        }

        public isInCheck(): boolean {
            const enemyPieces = pieces.filter(piece => piece.color !== this.color);
            const position = this.parent.position;

            GameBoard.switchProtection();
            let isInCheck = false;
            for (const piece of enemyPieces) {
                for (const move of piece.possibleMoves) {
                    
                    if (move.x === position.x && move.y === position.y) {
                        (console as any).log(piece.constructor.name);
                        isInCheck = true;
                        break;
                    }
                }
                if (isInCheck) break;
            }

            GameBoard.switchProtection();

            (console as any).log("Is Player's King in check: " + isInCheck);

            return isInCheck;
        }
    }

    export class Rook extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            return validatePossibleMoves(
                continuingPossibleMoves(this, ['up', 'down', 'left', 'right']), 
                this
            );
        }
    }

    export class Knight extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            const tile = this.parent;
            const possibleMoves: Position[] = [];
            ['up', 'down', 'left', 'right'].forEach(dir => {
                const prePositionTile = tile.getTileOnNewPosition(this.perspective, dir, 2);
                const postDirections = dir === 'up' || dir === 'left' ? ['right', 'left'] : ['up', 'down'];
                postDirections.forEach(postDir => {
                    const postPositionTile = prePositionTile?.getTileOnNewPosition(this.perspective, postDir, 1);
                    if (!postPositionTile || postPositionTile.protection) return;
                    possibleMoves.push(postPositionTile.position);
                });
            });

            return validatePossibleMoves(possibleMoves, this);
        }
    }

    export class Bishop extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            return validatePossibleMoves(
                continuingPossibleMoves(this, ['up-right', 'up-left', 'down-right', 'down-left']), 
                this
            );
        }
    }

    export class Queen extends Piece {
        public constructor() {
            super();
        }

        get possibleMoves(): Position[] {
            return validatePossibleMoves(
                continuingPossibleMoves(this, ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right']),
                this
            );
        }
    }

    function validatePossibleMoves(possibleMoves: Position[], piece: Piece): Position[] {
        if (searchForCheck) return possibleMoves;
        
        searchForCheck = true;

        piece.parent.ignorePiece = true;
        possibleMoves = possibleMoves.filter(possibleMove => {
            const tileOnPossiblePosition = GameBoard.get_child_at(possibleMove);
            const hasPiece = tileOnPossiblePosition?.hasPiece();
            tileOnPossiblePosition.protection = !tileOnPossiblePosition.protection;

            if (hasPiece)
                tileOnPossiblePosition.piece.color = piece.color;

            const isValidMove = !piece.playerKing.isInCheck();

            if (hasPiece)
                tileOnPossiblePosition.piece.color = piece.color === 'white' ? 'black' : 'white';

            tileOnPossiblePosition.protection = !tileOnPossiblePosition.protection;

            return isValidMove;
        });

        piece.parent.ignorePiece = false;

        searchForCheck = false;

        return possibleMoves;
    }

    function continuingPossibleMoves(piece: Piece, directions: string[]): Position[] {
        const tile = piece.parent;
        const possibleMoves: Position[] = [];
    
        directions.forEach(dir => {
            let steps = 1;
            while (true) {
                const newTile = tile.getTileOnNewPosition(piece.perspective, dir, steps);
                if (!newTile || newTile.protection) {
                    break;
                }
                possibleMoves.push(newTile.position);
                steps++;
                if (newTile?.hasPiece() && !newTile.ignorePiece) break;
            }
        });
        return possibleMoves;
    }

}
    /* validatePossibleMoves()
    searchForCheck = false
    ignorePiece = true
    inLoop
        protection = false
        hasPiece ? color = enemyColor // maybe implement a skip method, instead of changing color
            [push]
        hasPiece ? color = playerColor
        protection = true
    inLoop
    ignorePiece = false
    searchForCheck = true
    */
   
export default PieceFactory;
