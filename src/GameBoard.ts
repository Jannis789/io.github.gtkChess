import Gtk from 'gi://Gtk?version=4.0';
import Tile, { pieceTile } from './Tile.js';
import GObject from 'gi://GObject';
import Position from './Position.js';
import Piece from './Piece.js';
import EventControl from './EventControl.js';
import PieceFactory from './PieceFactory.js';
import GameAction from './GameAction.js';

class GameBoard extends Gtk.Grid {
    private static _instance: GameBoard;
    private static cssProvider: Gtk.CssProvider;
    public static tiles: Tile[];
    public static pieceTiles: (Tile & { piece: Piece })[];
    public static selectedTilePositions: Position[] = [];

    public constructor() {
        super();
        GameBoard.tiles = [];
        GameBoard.pieceTiles = [];
        GameBoard.cssProvider = new Gtk.CssProvider();
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
        GameBoard.cssProvider.load_from_resource("/io/github/gtkChess/styles.css");

        [isDark, className].forEach(className => tile.add_css_class(className));
        
        tile.get_style_context().add_provider(GameBoard.cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

        function getClassName(): string {
            if (x === 0 && y === 0) return 'corner_tl';
            if (x === 7 && y === 0) return 'corner_tr';
            if (x === 0 && y === 7) return 'corner_bl';
            if (x === 7 && y === 7) return 'corner_br';
            return 'no_corner';
        }
    }

    public static selectTile(position: Position, value: boolean): void {
        if (value) {
            GameBoard.selectedTilePositions.push(position);
            GameBoard.getChild(position).add_css_class('selected');
        } else {
            GameBoard.selectedTilePositions = GameBoard.selectedTilePositions.filter(tilePosition => tilePosition.equals(position));
            GameBoard.getChild(position).remove_css_class('selected');
        }
    }
    public static attach(tile: Tile, x: number, y: number, width: number, height: number): void {
        GameBoard.instance.attach(tile, x, y, width, height);
    }

    public static getChild(position: Position): Tile {
        const tile = GameBoard.instance.get_child_at(position.x, position.y);
        if (!tile) throw new Error('Tile not found');
        return tile as Tile;
    }

    public static setProtection(color: PieceFactory.Color): void{
            GameBoard.pieceTiles.forEach(tile => {
                if (tile.piece?.color === color) 
                    {tile.protection = true} else 
                    {tile.protection = false};
            });
        
    }

    public static movePieceTo(from: Position, to: Position): void {
        const oldTile = GameBoard.getChild(from);
        const piece = oldTile.piece;
        const newTile = GameBoard.getChild(to);
        oldTile.piece = null;
        newTile.piece = piece;
        newTile.piece?.renderPiece();
        newTile.piece?.set_visible(true);
    }

    static {
        GObject.registerClass(GameBoard);
    }
}

export default GameBoard;
