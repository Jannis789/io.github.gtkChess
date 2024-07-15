import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import GameLoop from './GameLoop.js';
import UI from './UI.js';

class Window extends Adw.ApplicationWindow {
    private _outerBox!: Gtk.Box;
    private cssProvider!: Gtk.CssProvider;

    constructor(params?: Partial<Adw.ApplicationWindow.ConstructorProperties>) {
        super(params);

        this.cssProvider = new Gtk.CssProvider();
        this.cssProvider.load_from_resource("/io/github/gtkChess/styles.css");

        const outerBoxContext = this._outerBox.get_style_context();

        outerBoxContext.add_class('outerBox');
        outerBoxContext.add_provider(this.cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

        this._outerBox.append(UI.Board.instance);

        GameLoop.updateGameState('BUILD_GAME');
    }

    static {
        GObject.registerClass(
            {
                Template: 'resource:///io/github/gtkChess/window.ui',
                InternalChildren: ['outerBox'],
            },
            Window
        );

        Gtk.Widget.add_shortcut(
            new Gtk.Shortcut({
                action: new Gtk.NamedAction({ action_name: 'window.close' }),
                trigger: Gtk.ShortcutTrigger.parse_string('<Control>w'),
            })
        );
    }
}

export { Window };
