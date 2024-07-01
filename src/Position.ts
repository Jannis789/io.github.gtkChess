class Position {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public x: number;
    public y: number;

    public equals(position: Position): boolean {
        return this.x === position.x && this.y === position.y;
    }

    public isMember(positions: Position[]) {
        return positions.some(pos => this.equals(pos));
    }
}

export default Position;