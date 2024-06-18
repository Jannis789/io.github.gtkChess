import Tile from "./Tile.js";
import PieceFactory from "./PieceFactory.js";
import Piece from "./Piece.js";
import DragSource from "./DragSource.js";
import DropTarget from "./DropTarget.js";

export type pieceTile = Tile & { piece: Piece };
type Position = { x: number; y: number };

class TileSet extends Array<Tile> {
    private static _instance: TileSet;
    public static pieceTiles: pieceTile[] = [];
    public pieceTileMap: Map<Piece, Tile> = new Map();
    public tileDragSourceMap: Map<Tile, DragSource> = new Map();
    public tileDropTargetMap: Map<Tile, DropTarget> = new Map();
    public static selectedTiles: Tile[] = [];

    public static get instance(): TileSet {
        return TileSet._instance || 
            (TileSet._instance = new TileSet());
    }

    public static createPieces(): void {
        const board = PieceFactory.board;
        const classRecord: Record<string, new (color: "black" | "white") => Piece> = {
            r: PieceFactory.Rook,
            n: PieceFactory.Knight,
            b: PieceFactory.Bishop,
            q: PieceFactory.Queen,
            k: PieceFactory.King,
            p: PieceFactory.Pawn
        } as const;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const letter = board[row][col];
                if (letter === null) continue;
                const color =
                    letter.toLowerCase() === letter ? "white" : "black";
                const pieceClass = classRecord[letter.toLowerCase()];

                const targetTile = TileSet.getTile({ x: col, y: row });
                const newPiece = (targetTile.piece = new pieceClass(color));
                newPiece.renderPiece(color, 200);
            }
        }
    }

    public static addTile(tile: Tile): void {
        TileSet.instance[tile.column + tile.row * 8] = tile;
    }

    public static getTile(arg: Position | Piece): Tile {
        const tile: Tile | null | undefined =
            arg instanceof Piece
                ? TileSet.instance.pieceTileMap.get(arg)
                : TileSet.instance[arg.x + arg.y * 8];
        if (tile) return tile;
        throw Error(`Associated tile not found: ${arg}`);
    }

    public static isTileOccupiedAt({x, y}: Position, color: 'black' | 'white' | null, pieceType: typeof Piece): boolean {
        const tile = TileSet.getTile({x, y});
        if (!tile) throw Error(`Tile not found at position: x: ${x}, y: ${y}`); 
        return tile.isOccupiedBy(color, pieceType);
    }

    public static isTileSelected(tile: Tile): boolean {
        return TileSet.selectedTiles.includes(tile);
    }
}

export default TileSet;
