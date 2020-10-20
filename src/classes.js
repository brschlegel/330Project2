

class Shape{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
    }
}


class Square extends Shape{

    constructor(x,y,width,height,color){
        super(x,y,color);
        this.width = width;
        this.height = height;
        this.scale = 1;
        this.center = {x: this.x + width / 2, y: this.y + height /2};
    }
    draw(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.center.x - (this.width * this.scale / 2),this.center.y - (this.width * this.scale / 2),this.width * this.scale,this.height *this.scale);
        ctx.restore();
    }
}

export{Square};