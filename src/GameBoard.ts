import Gtk from 'gi://Gtk?version=4.0';
import Tile from './Tile.js';
import GObject from 'gi://GObject';

class GameBoard extends Gtk.Grid {
    private static _instance: GameBoard;

    public constructor() {
        super();
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
                const protection = y <= 5 ? true : false;
                const tile = new Tile(protection);
                GameBoard.attach(tile, x, y, 1, 1);
                GameBoard.colorizeTile(tile, x, y);
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

    static {
        GObject.registerClass(GameBoard);
    }
}

export default GameBoard;

