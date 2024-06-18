import Gtk from 'gi://Gtk?version=4.0';
import GdkPixbuf from 'gi://GdkPixbuf';
import TileSet, { pieceTile } from './TileSet.js';

abstract class Piece extends Gtk.Image {
    public color: 'black' | 'white';
    public perspective: 'player' | 'enemy';
    public enemyPerspective: 'player' | 'enemy';
    public enemyColor: 'white' | 'black';

    public constructor(color: 'black' | 'white') {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
        this.color = color;

        this.perspective = this.color === 'white' ? 'player' : 'enemy';
        this.enemyPerspective = this.color === 'white' ? 'enemy' : 'player';
        this.enemyColor = this.color === 'white' ? 'black' : 'white';
    }

    public renderPiece(color: 'black' | 'white', size: number ): Piece {     
        const imgPath = `/io/github/gtkChess/img/${color}_${this.pieceType}.svg`;
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            size,
            size,
            true
        );
        this.set_from_pixbuf(pixbuf);
        return this;
    }

    public get pieceType(): string {
        return this.constructor.name.toLowerCase();
    }

    public set position({ x, y }: { x: number, y: number }) {
        const newPiece = new (this.constructor as { new (color: 'black' | 'white'): Piece })(this.color).renderPiece(this.color, 200);
        
        const currentTile = TileSet.getTile(this);
        if (currentTile.piece !== null) {

            TileSet.pieceTiles.splice(TileSet.pieceTiles.indexOf(this as unknown as pieceTile), 1);
            TileSet.instance.pieceTileMap.delete(currentTile.piece);

            currentTile.piece = null;

        }

        TileSet.getTile({x, y}).piece = newPiece;   
    }
    
    abstract get possibleMoves(): { x: number, y: number }[];

    selectMoves(state: boolean): void {
        if (state) {
            this.possibleMoves.forEach(targetPosition => {
                TileSet.getTile(targetPosition).highlight = true;
            });
        } else {
            this.possibleMoves.forEach(targetPosition => {
                TileSet.getTile(targetPosition).highlight = false;
            });
        }
    }
}

export default Piece;