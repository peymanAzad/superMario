var Sprite = function(type, artist, behaviours){
    this.type = type;
    this.artist = artist || "";
    this.behaviours = behaviours || [];
    this.offset = 0;
    this.left = 0;
    this.top = 0;
    this.height = 10;
    this.width = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.opacity = 1.0;
    this.visible = true;
    this.drawCollisionRectangle = false;
    
    this.collisionMargin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
}
Sprite.prototype = {
    
    draw: function(context){
        var r;
        context.save()
        context.globalAlpha = this.opacity;
        
        if (this.artist && this.visible) {
            this.artist.draw(this, context);
        }
        
        if (this.drawCollisionRectangle) {
            this.calculateCollisionRectangle();
            context.begingPath();
            context.strokeStyle = "white";
            context.lineWidth = 2.0;
            context.rect(r.left + this.offset, r.top, r.right - r.left, r.bottom - r.top);
            context.stroke();
        }
        context.restore();
    },
    
    update: function(time, fps, context, lastAnimationFrame){
        for (var i = 0; i < this.behaviours.length; i++) {
            var element = this.behaviours[i];
            if (element === undefined) {
                return;
            }
            element.execute(this, time, fps, context, lastAnimationFrame);
        }
    },
    
    calculateCollisionRectangle: function(){
        return {
            left: this.left - this.offset + this.collisionMargin.right,
            right: this.left - this.offset + this.width - this.collisionMargin.left,
            top: this.top + this.collisionMargin.top,
            bottom: this.top + this.collisionMargin.top + this.height - this.collisionMargin.bottom,
            
            centerX: this.left + this.width/2,
            conterY: this.top + this.height/2
        }
    }
}