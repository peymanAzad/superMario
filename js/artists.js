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

spriteArtist = function(sprite, context, spritesheet, cells, state){
    this.spritesheet = spritesheet;
    this.context = context;
    this.sprite = sprite;
    this.cells = cells;
    this.state = state;
    this.cellIndex = 0;
}
spriteArtist.prototype = {
    draw: function(){
        var cell = this.cells[this.state][this.cellIndex];

        this.context.drawImage(this.spritesheet, cell.left, cell.top,
                                            cell.width, cell.height,
                                            this.sprite.left, this.sprite.top,
                                            cell.width, cell.height);
    },
    advance: function(){
        if (this.cellIndex === this.cells[this.state].length-1) {
            this.cellIndex = 0;
        }
        else {
            this.cellIndex++;
        }
    }
}

platformArtist = function(sprite, context, spritesheet, cell, shape){
    this.sprite = sprite;
    this.context = context;
    this.spritesheet = spritesheet;
    this.cell = cell;
    this.shape = shape;
}
platformArtist.prototype = {
    draw: function(){
        switch (this.shape) {
            case "Rectangle":
                this.drawRectangle();
                break;
        
            default:
                this.drawRectangle();
                break;
        }
    },
    drawRectangle: function(){
        for(var top = this.sprite.top; top < this.sprite.top + this.sprite.height; top += this.cell.height)
            drawRow(top, this.sprite.left, this.sprite.left + this.sprite.width);
    },
    drawRow: function(top, leftRow, rightRow){
        for(var left = leftRow; left < rightRow; left += this.cell.width)
            doawCell(left, top);
    },
    drawCell: function(left, top){
        this.context.drawImage(this.spritesheet, cell.left, cell.top,
                                            cell.width, cell.height,
                                            left, top,
                                            cell.width, cell.height);
    }
}