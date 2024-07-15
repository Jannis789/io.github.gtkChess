import Gtk from 'gi://Gtk?version=4.0';
import _GameBoard from './GameBoard.js';
import _Tile from './Tile.js';
import GObject from 'gi://GObject';
import GdkPixbuf from 'gi://GdkPixbuf';
import EventControl from './EventControl.js';

namespace UI {
    export class Board extends Gtk.Grid {
        private static _instance: Board;
        public static tiles: (UI.Tile | null)[][];
        public static pieces: (UI.Piece | null)[][];
        private static cssProvider: Gtk.CssProvider;
        public data: typeof _GameBoard = _GameBoard;

        constructor() {
            super();
            Board.tiles = Array.from({ length: this.data.size() }, () => Array(this.data.size()).fill(null));
            Board.pieces = Array.from({ length: this.data.size() }, () => Array(this.data.size()).fill(null));

            Board.cssProvider = new Gtk.CssProvider();
            this.set_margin_bottom(8);
            this.set_margin_top(8);
            this.set_margin_end(8);
            this.set_margin_start(8);
        }


        private forEach(callback: (ui_tile: _Tile, x: number, y: number) => void) {
            for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].length; j++) {
                    callback(this.data[i][j], i, j);
                }
            }
        }

        public static get instance(): Board {
            if (!Board._instance) {
                Board._instance = new Board();
            }
            return Board._instance;
        }

        public static placeTiles() {
            Board.instance.forEach((_, x, y) => {
                const newUITile = new UI.Tile();
                Board.instance.attach(newUITile, x, y, 1, 1);
                Board.tiles[x][y] = newUITile;
            });
        }

        public static applyStyling() {
            Board.instance.forEach((_, x, y) => {
                const tile = Board.tiles[x][y];
                if (!tile) return;
                const isDark = x % 2 === y % 2 ? 'dark_tile' : 'light_tile';
                const className = getClassName(x, y);
                Board.cssProvider.load_from_resource(`/io/github/gtkChess/styles.css`);
                tile.add_css_class(isDark);
                tile.add_css_class(className);
                tile.get_style_context()?.add_provider(Board.cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);
            });

            function getClassName(x: number, y: number): string {
                if (x === 0 && y === 0) return 'corner_tl';
                if (x === 7 && y === 0) return 'corner_tr';
                if (x === 0 && y === 7) return 'corner_bl';
                if (x === 7 && y === 7) return 'corner_br';
                return 'no_corner';
            }
        }

        public static placePieces() { // weiß nicht ob ich das überhaupt brauche
            Board.instance.forEach((item, x, y) => {
                const piece = item.piece;
                if (!piece) return;

                const ui_tile = Board.tiles[x][y];
                if (!ui_tile) return;

                const newUIPiece = new UI.Piece(piece.type, piece.color);
                Board.pieces[x][y] = newUIPiece;

                ui_tile.set_child(newUIPiece);
                newUIPiece.renderPiece();
            });
        }

        public static addDragFunctionalities() {
            Board.instance.forEach((item, x, y) => {
                const ui_tile = Board.tiles[x][y];
                if (!ui_tile?.hasPiece) return;
                ui_tile.eventControl.addDragSource(item.position);
            });
        }

        public static addDropTargets() {
            Board.instance.forEach((item, x, y) => {
                const ui_tile = Board.tiles[x][y];
                if (!ui_tile || ui_tile.hasPiece) return;
                ui_tile.eventControl.addDropTarget(item.position);
            });
        }

        static {
            GObject.registerClass(Board);
        }
    }

    export class Tile extends Gtk.Button {
        public eventControl: EventControl;
        constructor() {
            super();
            this.eventControl = new EventControl();
            this.set_vexpand(true);
            this.set_hexpand(true);
        }

        public get hasPiece(): boolean {
            return this.get_child() instanceof UI.Piece;
        }

        static {
            GObject.registerClass(Tile);
        }
    }

    export class Piece extends Gtk.Image {
        constructor(private type: string, private color: string) {
            super();
        }

        public renderPiece(): void {
            this.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_resource_at_scale(
                `/io/github/gtkChess/img/${this.color}_${this.type}.svg`,
                200,
                200,
                true
            ));
        }

        public getNewImage(newSize: number): Gtk.Image {
            const img = new Gtk.Image();
            img.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_resource_at_scale(
                `/io/github/gtkChess/img/${this.color}_${this.type}.svg`,
                newSize,
                newSize,
                true
            ));
            return img;
        }

        static {
            GObject.registerClass(Piece);
        }
    }
}

export default UI;
