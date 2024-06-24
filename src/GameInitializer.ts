import Gtk from 'gi://Gtk?version=4.0';
import GameBoard from './GameBoard.js';
import PieceFactory from './PieceFactory.js';


class GameInitializer {
    private static _instance: Gtk.Box;

    public static get instance(): Gtk.Box {
        return GameInitializer._instance;
    }

    public static set instance(instance: Gtk.Box) {
        new GameInitializer();
        GameInitializer._instance = instance;
    }

    public static start(): void {
        GameInitializer.instance.append(GameBoard.instance);
        GameBoard.createTiles();
        PieceFactory.initializePieces();

        setProtection();
        function setProtection() {
            GameBoard.tiles.forEach(tile => {
                tile.piece?.color === 'white' ? 
                tile.protection = true : 
                tile.protection = false;
            });
        }
    }
}

export default GameInitializer;
