var groundArtist = function(sprite, context, spritesheet, type, convas){
    this.sprite = sprite;
    this.spritesheet = spritesheet;
    this.type = type;

    this.context = context;
    this.convas = convas;
    this.widthToDraw;
    this.leftToDraw;
}
groundArtist.prototype = {
    draw:function(){
        this.calculateDrawing();
        for(var top = this.sprite.top; top <= this.sprite.top + this.sprite.height; top += type.height){
            if(type.serface && top === this.sprite.top)
                this.drawRow(type.serface, top);
            else this.drawRow(type.body, top);
        }
    },
    calculateDrawing:function(){
        if(this.sprite.left + this.sprite.width > this.sprite.offset)
            if(this.sprite.left > this.sprite.offset)
                this.leftToDraw = this.sprite.left;
            else this.leftToDraw = this.sprite.offset;
        if(this.sprite.left > this.sprite.offset + this.convas.width)
            if(this.sprite.left + this.sprite.width < this.sprite.offset + this.convas.width)
                this.widthToDraw = this.sprite.width;
            else this.widthToDraw = this.sprite.offset + this.convas.width;
    },
    drawRow:function(row, top){
        for (var left = this.leftToDraw; left <= this.leftToDraw + this.widthToDraw; left+= this.sprite.width) {
            if(left === this.leftToDraw && left === this.sprite.left)
                this.drawCell(row.left, left, top)
            else if(left + this.sprite.width === this.sprite.left + this.sprite.width)
                this.drawCell(row.right, left, top);
            else this.drawCell(row.middle, left, top);
        }
    }, 
    drawCell(cell, left, top){
        this.context.drawImage(this.spritesheet, cell.left, cell.top,
                                          cell.width, cell.height,
                                          left, top,
                                          cell.width, cell.height);
    }
}