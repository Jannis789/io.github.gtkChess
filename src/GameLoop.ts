import GameBoard from './GameBoard.js';
import PieceFactory from './PieceFactory.js';
import UI from './UI.js';
import Position from './Position.js';
import ActionChain from './ActionChain.js';

namespace GameLoop {
    export type GameState = 'BUILD_GAME' | 'BUILD_UI' | 'NONE' | 'DROP';

    export var currentState: GameState = 'NONE';
    export var dragPosition: Position | null = null;
    export var dropTarget: Position | null = null;

    export function updateGameState(gameState: GameState) {
        currentState = gameState;
        switch (gameState) {
            case 'BUILD_GAME':
                GameBoard.placeTiles();
                PieceFactory.placePieces();

                UI.Board.placeTiles();
                UI.Board.applyStyling();
                ActionChain.build();
                UI.Board.addDragFunctionalities();
                UI.Board.addDropTargets();

                GameBoard.printDraft();
                GameBoard[0][1].piece!.possibleMoves;
                break;
            case 'BUILD_UI':
                break;
            case 'NONE':
                break;
        }
    }
}
export default GameLoop;
