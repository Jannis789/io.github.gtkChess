import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import GameBoard from './GameBoard.js';
import PieceFactory from './PieceFactory.js';
import Piece from './Piece.js';


class GameInitializer {
    private static _instance: Gtk.Box;

    public static get instance(): Gtk.Box {
        return GameInitializer._instance;
    }

    public static set instance(instance: Gtk.Box) {
        new GameInitializer();
        GameInitializer._instance = instance;
    }

    public static start() {
        GameInitializer.instance.append(GameBoard.instance);
        GameBoard.createTiles();
        PieceFactory.initializePieces();
    }
}

export default GameInitializer;
