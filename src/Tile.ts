import Gtk from 'gi://Gtk?version=4.0';
import Piece from './Piece.js';

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
        return {x: this.column, y: this.column};
    }

    get piece(): Piece | null {
        const child = this.get_child();
        if (child instanceof Piece) return child;
        return null;
    }
}

export default Tile;
