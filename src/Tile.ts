import Gtk from 'gi://Gtk?version=4.0';
import Piece from './Piece.js';

type Color = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";
type Direction = "top" | "bottom" | "right" | "left" | "top-right" | "top-left" | "bottom-right" | "bottom-left";

class Tile extends Gtk.Button {
    private styleContext!: Gtk.StyleContext;

    _init(): void {
        super._init({
            vexpand: true,
            hexpand: true,
        });
        this.styleContext = this.get_style_context();
    }

    add_css_provider(css_provider: Gtk.CssProvider): void {
        this.styleContext.add_provider(css_provider, Gtk.STYLE_PROVIDER_PRIORITY_USER)
    }

    get column(): number | undefined {
        const parent = this.get_parent();
        if (parent instanceof Gtk.Grid) return parent.query_child(this)[0];
        return undefined;
    }

    get row(): number | undefined {
        const parent = this.get_parent();
        if (parent instanceof Gtk.Grid) return parent.query_child(this)[1];
        return undefined;
    }

    get position(): {x: number | undefined, y: number | undefined} {
        return {x: this.column, y: this.row};
    }

    get piece(): Piece | null {
        const child = this.get_child();
        if (child instanceof Piece) return child;
        return null;
    }

    get grid(): Gtk.Grid | undefined {
        const parent = this.get_parent();
        if (parent instanceof Gtk.Grid) return parent;
        return undefined;
    }

    set piece(piece: Piece) {
        this.set_child(piece);
    }

    isOccupiedBy(color: Color | null, pieceType: typeof Piece): boolean {
        if (this.piece === null) return false;
        if ((this.piece.color === color || color === null) && this.piece instanceof pieceType) {
            return true;
        }
        return false;
    }

    getNewPosition(playerPerspective: Color, dir: Direction): null | { x: number, y: number } {
        if (this.row === undefined || 
            this.column === undefined ) 
            return null;

        const [x,y] = [this.column, this.row];
        const num = playerPerspective === "white" ? 1 : -1;

        const directionMap: Record<Direction, { x: number, y: number }> = {
            "top": { x: 0, y: -1 },
            "bottom": { x: 0, y: 1 },
            "right": { x: 1, y: 0 },
            "left": { x: -1, y: 0 },
            "top-right": { x: 1, y: -1 },
            "top-left": { x: -1, y: -1 },
            "bottom-right": { x: 1, y: 1 },
            "bottom-left": { x: -1, y: 1 }
        } as const;

        const delta = directionMap[dir];
        if (!delta) return null;

        const newX = x + delta.x * num;
        const newY = y + delta.y * num;

        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return null;

        return { x: newX, y: newY };
    }

}

export default Tile;
