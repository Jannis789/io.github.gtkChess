import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';
import ChessGame from './ChessGame.js';

export class Window extends Adw.ApplicationWindow {
    private _gridFrame!: Gtk.Grid;
    private cssProvider!: Gtk.CssProvider;
    private _outerBox!: Gtk.Box;
    static {
        GObject.registerClass(
            {
                Template:
                    'resource:///io/github/gtkChess/window.ui',
                InternalChildren: ['gridFrame', 'outerBox'],
            },
            this
        );

        Gtk.Widget.add_shortcut(
            new Gtk.Shortcut({
                action: new Gtk.NamedAction({ action_name: 'window.close' }),
                trigger: Gtk.ShortcutTrigger.parse_string('<Control>w'),
            })
        );
    }

    constructor(params?: Partial<Adw.ApplicationWindow.ConstructorProperties>) {
        super(params);
        new ChessGame(this._gridFrame);
        this.cssProvider = new Gtk.CssProvider();
        this.addCssResource("/io/github/gtkChess/styles.css");
        const outerBoxContext = this._outerBox.get_style_context();
        outerBoxContext.add_class('outerBox')
        outerBoxContext.add_provider(this.cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);
    }
    addCssResource(fileName: string) {
        this.cssProvider.load_from_resource(fileName);
    }
}

