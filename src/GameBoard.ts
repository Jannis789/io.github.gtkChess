import Gtk from 'gi://Gtk?version=4.0';
import Tile from './Tile.js';
import TileSet from './TileSet.js';

class GameBoard extends Gtk.Grid {
    private static _instance: GameBoard;

    public static get instance(): GameBoard {
        return GameBoard._instance || 
            (GameBoard._instance = new GameBoard());
    }

    private static cssProvider = new Gtk.CssProvider();

    public constructor() {
        super();
        this.set_margin_bottom(10);
        this.set_margin_top(10);
        this.set_margin_end(10);
        this.set_margin_start(10);
        GameBoard.cssProvider.load_from_resource("/io/github/gtkChess/styles.css");
    }

    private static colorizeTile(tile: Tile): void {
        const isDark = tile.column % 2 === tile.row % 2;
        const className = this.getClassName(tile.column, tile.row);
        tile.colorize(isDark ? 'dark_tile' : 'light_tile', this.cssProvider);
        tile.colorize(className, this.cssProvider);
    }

    private static getClassName(col: number, row: number): string {
        if (col === 0 && row === 0) return 'corner_tl';
        if (col === 7 && row === 0) return 'corner_tr';
        if (col === 0 && row === 7) return 'corner_bl';
        if (col === 7 && row === 7) return 'corner_br';
        return 'no_corner';
    }

    public static createTiles(): void {
        const tiles: Tile[] = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const tile = GameBoard.createTile(col, row);
                TileSet.addTile(tile);
            }
        }
    }

    private static createTile(col: number, row: number): Tile {
        const tile = new Tile();
        GameBoard.instance.attach(tile, col, row, 1, 1);
        GameBoard.colorizeTile(tile);
        return tile;
    }
}

export default GameBoard;

