import Gtk from 'gi://Gtk?version=4.0';
import TileSet from './Pieces.js'

export default class GameBoard {
    private gameArea!: Gtk.Grid;
    private cssProvider!: Gtk.CssProvider;
    private tileSet!: TileSet;
    private numRows: number = 8;
    private numCols: number = 8;

    constructor(area: Gtk.Grid) {
        this.gameArea = area;
        this.cssProvider = new Gtk.CssProvider();
        this.addCssResource("/io/github/gtkChess/styles.css");
        this.tileSet = new TileSet();
        this._initBoard();
    }
    private addCssResource(fileName: string) {
        this.cssProvider.load_from_resource(fileName);
    }

    private _initBoard() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {

                const button = new Gtk.Button();
                button.set_hexpand(true);
                button.set_vexpand(true);

                const buttonContext = button.get_style_context();
                buttonContext.add_class((col % 2 === row % 2) ? 'dark_tile' : 'light_tile');
                buttonContext.add_class(this._getClassName(col, row));
                buttonContext.add_provider(this.cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

                this.gameArea.attach(button, col, row, 1, 1);

                this.tileSet.setObject(button, col, row);
            }
        }
    }

    private _getClassName(col: number, row: number): string {
        if (col === 0 && row === 0) return 'corner_tl';
        if (col === this.numCols - 1 && row === 0) return 'corner_tr';
        if (col === 0 && row === this.numRows - 1) return 'corner_bl';
        if (col === this.numCols - 1 && row === this.numRows - 1) return 'corner_br';
        return 'no_corner';
    }
}
