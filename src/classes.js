

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
    draw(ctx, showGradient, gradient){
        ctx.save();
        if(!showGradient){
        ctx.fillStyle = this.color;
    }
    else{
        ctx.fillStyle = gradient
    }
        ctx.fillRect(this.center.x - (this.width * this.scale / 2),this.center.y - (this.width * this.scale / 2),this.width * this.scale,this.height *this.scale);
        ctx.restore();
    }
}

class Triangle{
    constructor(points,color){
        this.points = points
        this.color = color;
        this.scale = 1;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.points[0],this.points[1]);
        ctx.lineTo(this.points[2],this.points[3]);
        ctx.lineTo(this.points[4],this.points[5]);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

    }
}

export{Square,Triangle};