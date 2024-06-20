import Gtk from 'gi://Gtk?version=4.0';
type Color = 'white' | 'black';
import GdkPixbuf from 'gi://GdkPixbuf';

abstract class Piece extends Gtk.Image {
    private _color: Color | undefined;
    public size?: number;
    public constructor() {
        super();
        this.set_vexpand(true);
        this.set_hexpand(true);
    }

    public get color(): Color {
        if (this._color === undefined) throw new Error('Color is undefined');
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
    }

    public static get type(): string {
        return this.name.toLowerCase();
    }

    public renderPiece(): Piece {
        const size = (this.size === undefined) ? 200 : this.size;
        const imgPath = `/io/github/gtkChess/img/${this.color}_${this.constructor.name.toLowerCase()}.svg`;
        const pixbuf: GdkPixbuf.Pixbuf = GdkPixbuf.Pixbuf.new_from_resource_at_scale(
            imgPath,
            size,
            size,
            true
        );
        this.set_from_pixbuf(pixbuf);
        return this;
    }


}

export default Piece;