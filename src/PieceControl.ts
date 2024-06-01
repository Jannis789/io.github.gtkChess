import Tile from './Tile.js';
import DragControl from './DragControl.js';

type GameState = 'INIT' | 'SELECT' | 'VALIDATE' | 'MOVE' | 'NONE';


class PieceControl {
    private dragControl!: DragControl;
    public tiles: Tile[] = [];
    public pieceTiles: Tile[] = [];
    public dragSource!: Tile;
    public dropDestination!: Tile;

    private _gameState: GameState = 'NONE';

    constructor() {

    }

    public set updateGameState(state: GameState) {
        this._gameState = state;
        switch(state) {
            case 'INIT':
                this.dragControl = new DragControl(this.pieceTiles, this.tiles);
                this.dragControl.pieceControl = this;
                break;
            case 'SELECT':
                break;
            case 'MOVE':
                break;
        }
    }

    get gameState(): GameState {
        return this._gameState;
    }
}

export default PieceControl;
