export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    sub( v:Vector2 ) {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    }


    clone() {
        return new Vector2( this.x, this.y );
    }
}