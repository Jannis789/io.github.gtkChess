import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';

export class Window extends Adw.ApplicationWindow {
    private _chessWidget!: Gtk.Box;

    static {
        GObject.registerClass(
            {
                Template:
                    'resource:///io/github/gtkChess/window.ui',
                InternalChildren: ['chessWidget'],
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



    }
}

