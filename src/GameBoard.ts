import Gtk from 'gi://Gtk?version=4.0';
import Tile from './Tile.js';
import GObject from 'gi://GObject';

type Position = {x: number, y: number};

class GameBoard extends Gtk.Grid {
    private static _instance: GameBoard;
    public static tiles: Tile[];

    public constructor() {
        super();
        GameBoard.tiles = [];
        this.set_margin_bottom(10);
        this.set_margin_top(10);
        this.set_margin_end(10);
        this.set_margin_start(10);
    }

    public static get instance(): GameBoard {
        return GameBoard._instance || 
            (GameBoard._instance = new GameBoard());
    }

    public static createTiles(): void {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const tile = new Tile();
                GameBoard.attach(tile, x, y, 1, 1);
                GameBoard.colorizeTile(tile, x, y);
                GameBoard.tiles.push(tile);
            }
        }
    }

    private static colorizeTile(tile: Tile, x: number ,y: number): void {
        const isDark = x % 2 === y % 2 ? 'dark_tile' : 'light_tile';
        const className = getClassName();
        const cssProvider = new Gtk.CssProvider();
        cssProvider.load_from_resource("/io/github/gtkChess/styles.css");

        [isDark, className].forEach(className => tile.add_css_class(className));
        
        tile.get_style_context().add_provider(cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

        function getClassName(): string {
            if (x === 0 && y === 0) return 'corner_tl';
            if (x === 7 && y === 0) return 'corner_tr';
            if (x === 0 && y === 7) return 'corner_bl';
            if (x === 7 && y === 7) return 'corner_br';
            return 'no_corner';
        }
    }

    public static attach(tile: Tile, x: number, y: number, width: number, height: number): void {
        GameBoard.instance.attach(tile, x, y, width, height);
    }

    public static get_child_at(position: {x: number, y: number}): Tile {
        const tile = GameBoard.instance.get_child_at(position.x, position.y);
        if (!tile) throw new Error('Tile not found');
        return tile as Tile;
    }

    public static selectPossibleMoves(positions: Position[], value: boolean): void {
        positions.forEach(position => {
            const tile = GameBoard.get_child_at(position);
            tile.selected = value;
        })
    }

    public static switchProtection(): void {
        GameBoard.tiles.forEach(tile => {
            if (tile.hasPiece()) {
                tile.protection = !tile.protection;
            }
        })
    }

    static {
        GObject.registerClass(GameBoard);
    }
}

export default GameBoard;

