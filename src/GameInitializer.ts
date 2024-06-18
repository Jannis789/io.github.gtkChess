import Gtk from 'gi://Gtk?version=4.0';
import GameBoard from './GameBoard.js';
import GObject from 'gi://GObject';
import Tile from './Tile.js';
import Piece from './Piece.js';
import PieceFactory from './PieceFactory.js';
import TileSet from './TileSet.js';
import DragControl from './DragControl.js';

class GameInitializer {
    private static _instance: GameInitializer;
    public static gameField?: Gtk.Box

    public static get instance(): GameInitializer {
        return GameInitializer._instance || 
            (GameInitializer._instance = new GameInitializer());
    }

    public static start(): void {
        if (GameInitializer.gameField === undefined) throw Error("gameField is undefined");
        GObject.registerClass(GameBoard);
        GObject.registerClass(Tile);
        GObject.registerClass(Piece as any);
        GObject.registerClass(PieceFactory.Pawn);
        GObject.registerClass(PieceFactory.Knight);
        GObject.registerClass(PieceFactory.Rook);
        GObject.registerClass(PieceFactory.Bishop);
        GObject.registerClass(PieceFactory.Queen);
        GObject.registerClass(PieceFactory.King);


        GameInitializer.gameField.append(GameBoard.instance);
        GameBoard.createTiles();
        TileSet.createPieces();
        DragControl.dragSources = TileSet.pieceTiles;
        DragControl.dropTargets = TileSet.instance;
    }
}

export default GameInitializer;