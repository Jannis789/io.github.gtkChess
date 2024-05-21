import Gtk from 'gi://Gtk?version=4.0';
import GameBoard from './GameBoard.js';

export default class ChessGame {
    private gameArea!: Gtk.Grid;

    constructor(area: Gtk.Grid) {
        this.gameArea = area;
        new GameBoard(this.gameArea);
    }
}

