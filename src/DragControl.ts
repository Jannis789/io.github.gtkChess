import Tile from './Tile.js';
import Piece from './Piece.js';
import DragSource from './DragSource.js';
import DropTarget from './DropTarget.js';
import GObject from 'gi://GObject';
import TileSet, { pieceTile } from './TileSet.js';

class DragControl {
    private static _instance: DragControl;
    private readonly _dragSources: pieceTile[] = [];
    private readonly _dropTargets: Tile[] = [];

    public static get instance(): DragControl {
        return DragControl._instance || (DragControl._instance = new DragControl());
    }

    private constructor() {
        GObject.registerClass({ GTypeName: 'DragSource' }, DragSource);
        GObject.registerClass({ GTypeName: 'DropTarget' }, DropTarget);
    }

    public static removeDragSource(tile: pieceTile): void {    
        TileSet.instance.tileDragSourceMap.get(tile)?.disconnectAll();
        TileSet.instance.tileDragSourceMap.delete(tile);
        DragControl.instance._dragSources.splice(DragControl.instance._dragSources.indexOf(tile), 1);
    }

    public static removeDropTarget(tile: Tile): void {
        TileSet.instance.tileDropTargetMap.get(tile)?.disconnectAll();
        TileSet.instance.tileDropTargetMap.delete(tile);
        DragControl.instance._dropTargets.splice(DragControl.instance._dropTargets.indexOf(tile), 1);
    }

    public static set newDragSource(tile: Tile & { piece: Piece }) {
        (console as any).log(tile);
        DragControl.instance._dragSources.push(tile);
        DragSource.createDragSource(tile);
    }

    public static set newDropTarget(tile: Tile) {
        DragControl.instance._dropTargets.push(tile);
        DropTarget.createDropTarget(tile);
    }

    public static set dragSources(dragSources: pieceTile[]) {
        DragControl.instance._dragSources.splice(0, DragControl.instance._dragSources.length, ...dragSources);
        DragSource.createDragSources(dragSources);
    }

    public static get dragSources(): pieceTile[] {
        return DragControl.instance._dragSources;
    }

    public static set dropTargets(dropTargets: TileSet) {
        DragControl.instance._dropTargets.splice(0, DragControl.instance._dropTargets.length, ...dropTargets);
        DropTarget.createDropTargets(dropTargets);
    }

    public static get dropTargets(): Tile[] {
        return DragControl.instance._dropTargets;
    }
}

export default DragControl;
