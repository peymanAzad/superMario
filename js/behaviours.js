CycleBehavior = function(pause, duration){
    this.pause = pause || 0;
    this.lastAdvanceTime = 0;
    this.duration = duration || 0;
};
 CycleBehavior.prototype = {
      execute: function(sprite, now, context, lastAnimationFrame){
          if(!this.lastAdvanceTime){
              this.lastAdvanceTime = now;
          }
          if(this.pause && sprite.artist.cellIndex === 0){
              if(now - this.lastAdvanceTime > this.pause){
                  this.lastAdvanceTime = now;
                  sprite.artist.advance();
              }
          }else
           if(now - this.lastAdvanceTime > this.duration){
              this.lastAdvanceTime = now;
              sprite.artist.advance();
          }

    }
 }

 MoveBehavior = function(t0, v0, a, x0){
     this.t0 = t0;
     this.v0 = v0;
     this.v = v0;
     this.a = a;
     this.x0 = x0;
     this.stopStart = false;
 }
 MoveBehavior.prototype = {
     execute: function(sprite, now, context, lastAdvanceTime){
         if(!sprite.velocityX && !sprite.aX) return;
         if(!this.t0){
             this.t0  = now;
             return;
         }
         if(sprite.velocityX !== this.v || this.a !== sprite.aX){
            this.reset(sprite, now);
            return;
         }
         this.v = sprite.velocityX = mechanics.getV(sprite.aX, this.v0, now - this.t0);
         sprite.left = mechanics.getdeltaX(this.a, this.v0, now - this.t0) + this.x0;
     },
     reset: function(sprite, now){
         this.v0 = this.v = sprite.velocityX;
         this.a = sprite.aX;
         sprite.t0 = this.t0 = now;
         this.x0 = sprite.left;
     }
 };
 RunnerMovementBehavior = function(){
     this.MOVE_ACCESSLATOR = 0.00025;
     this.VELOCITY_TRESHURE = 0.1;
 }
 RunnerMovementBehavior.prototype = {
     execute: function(sprite, now){
        if (Key.isDown(Key.LEFT)) this.moveLeft(sprite);
        if (Key.isDown(Key.RIGHT)) this.moveRight(sprite);
        if(!Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT)) this.stop(sprite);
         
     },
     stop: function(sprite){
         if(!sprite.velocityX && !sprite.aX) return;
         if(sprite.velocityX > 0) sprite.aX = -this.MOVE_ACCESSLATOR;
         else if(sprite.velocityX < 0) sprite.aX = this.MOVE_ACCESSLATOR;
         if((sprite.aX > 0 && sprite.velocityX >= 0) || (sprite.aX < 0 && sprite.velocityX <= 0)){
             sprite.aX = 0;
             sprite.velocityX = 0;
         } 
     },
     moveLeft: function(sprite){
         if(sprite.velocityX < -this.VELOCITY_TRESHURE){
             sprite.aX = 0;
         }
         else{
             sprite.aX = -this.MOVE_ACCESSLATOR;
         }
     },
     moveRight: function(sprite){
         if(sprite.velocityX > this.VELOCITY_TRESHURE){
             sprite.aX = 0;
         }else{
             sprite.aX = this.MOVE_ACCESSLATOR;
         }
     }
 }
 