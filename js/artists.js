var groundArtist = function(sprite, context, spritesheet, type, convas){
    this.sprite = sprite;
    this.spritesheet = spritesheet;
    this.type = type;

    this.context = context;
    this.convas = convas;
    this.widthToDraw = sprite.width;
    this.leftToDraw = sprite.left;
}
groundArtist.prototype = {
    draw:function(){
        //this.calculateDrawing();
        for(var top = this.sprite.top; top <= this.sprite.top + this.sprite.height; top += this.type.body.middle.height){
            if(this.type.serface && top === this.sprite.top){
                this.drawRow(this.type.serface, top);
            }
            else this.drawRow(this.type.body, top);
        }
    },
    calculateDrawing:function(){
        if(this.sprite.left + this.sprite.width > this.sprite.offset)
            if(this.sprite.left > this.sprite.offset)
                this.leftToDraw = this.sprite.left;
            else {
                this.leftToDraw = this.sprite.offset;
                this.widthToDraw -= this.sprite.offset - this.sprite.left;
            }
        if(this.sprite.left < this.sprite.offset + this.convas.width)
            if(this.sprite.left + this.sprite.width < this.sprite.offset + this.convas.width)
                this.widthToDraw += this.sprite.width;
            else this.widthToDraw += this.sprite.offset + this.convas.width;
    },
    drawRow:function(row, top){
        var widthToOffset = row.left.width;
        for (var left = this.sprite.left; left < this.sprite.left + this.sprite.width; left+= widthToOffset) {
            if(left === this.sprite.left)
                this.drawCell(row.left, left, top)
            else if(left+widthToOffset > this.sprite.left + this.sprite.width)
                this.drawCell(row.right, left, top);
            else this.drawCell(row.middle, left, top);

            if(left > this.sprite.left)
                if(left + widthToOffset < this.sprite.left + this.sprite.width)
                    widthToOffset = row.middle.width;
                else widthToOffset = row.right.width;
        }
    },
    cellIsInView: function(cell){
        return cell.left + cell.width > this.sprite.offset && cell.left < this.sprite.offset + this.convas.width;
    }, 
    drawCell(cell, left, top){
        if(this.cellIsInView(cell)){
        this.context.drawImage(this.spritesheet, cell.left, cell.top,
                                          cell.width, cell.height,
                                          left, top,
                                          cell.width, cell.height);
        }
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