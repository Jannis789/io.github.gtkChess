import Piece from './Piece.js';
import TileSet from './TileSet.js';

namespace PieceFactory {

    export var board = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, 'q', null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']

    ] as const;

    export class Pawn extends Piece {
        private hasMoved = false;
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            const positions: {x: number, y: number}[] = [];
            const tile = TileSet.getTile(this);
            const position = tile.getNewPosition(this.perspective, 'up', 1);
            
            if (position && !TileSet.isTileOccupiedAt(position, null, Piece)) positions.push(position);
            
            const optinalPosition = tile.getNewPosition(this.perspective, 'up', 2);
            if (!this.hasMoved && optinalPosition && !TileSet.isTileOccupiedAt(optinalPosition, null, Piece)) {
                positions.push(optinalPosition);
            }
            
            ['up-right', 'up-left'].forEach(dir => {
                const attackPosition = tile.getNewPosition(this.perspective, dir, 1);
                if (attackPosition && TileSet.isTileOccupiedAt(attackPosition, this.enemyColor, Piece)) {
                    positions.push(attackPosition);
                }
            });

            return positions;
        }
    }

    export class Rook extends Piece {
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            return getContinuingMoves(['up', 'down', 'left', 'right'], this);
        }
    }
        

    export class Knight extends Piece {
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            const positions: {x: number, y: number}[] = [];
            const currentTile = TileSet.getTile(this);

            ['right', 'left', 'up', 'down'].forEach(direction => {
                const nextPosition = currentTile.getNewPosition(this.perspective, direction, 2);
                if (!nextPosition) return;

                const nextTile = TileSet.getTile(nextPosition);
                const isStraightMove = direction === 'up' || direction === 'down';

                const lateralDirections = isStraightMove ? ['right', 'left'] : ['up', 'down'];
                lateralDirections.forEach(lateralDirection => {
                    const finalPosition = nextTile.getNewPosition(this.perspective, lateralDirection, 1);
                    if (finalPosition && (!TileSet.getTile(finalPosition).hasPiece() || TileSet.isTileOccupiedAt(finalPosition, this.enemyColor, Piece))) {
                        positions.push(finalPosition);
                    }
                });
            });

            return positions;
        }
    }

    export class Bishop extends Piece {
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            return getContinuingMoves(['up-right', 'up-left', 'down-right', 'down-left'], this);
        }
    }

    export class Queen extends Piece {
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            return getContinuingMoves(['up-right', 'up-left', 'down-right', 'down-left', 'up', 'down', 'left', 'right'], this);
        }
    }

    export class King extends Piece {
        constructor(color: 'black' | 'white') {
            super(color);
        }

        public get possibleMoves(): {x: number, y: number}[] {
            const positions: {x: number, y: number}[] = [];
            ['up-right', 'up-left', 'down-right', 'down-left', 'up', 'down', 'left', 'right'].forEach(dir => {
                const newPosition = TileSet.getTile(this).getNewPosition(this.perspective, dir, 1);
                if (newPosition && (!TileSet.getTile(newPosition).hasPiece() || TileSet.isTileOccupiedAt(newPosition, this.enemyColor, Piece))) {
                    positions.push(newPosition);
                }
            });

            return positions;
        }
    }
}

function getContinuingMoves(dir: string[], piece: Piece) {
    const positions: {x: number, y: number}[] = [];

    dir.forEach(dir => {
    let steps = 1;
    
        while (true) {
            const newPosition = TileSet.getTile(piece).getNewPosition(piece.perspective, dir, steps);     
            
            if (!newPosition || TileSet.isTileOccupiedAt(newPosition, piece.color, Piece)) break;
            
            positions.push(newPosition); 
            
            if (TileSet.isTileOccupiedAt(newPosition, piece.enemyColor, Piece))  break; 
            
            steps++;
        }
    });
    return positions;
    
}

export default PieceFactory;