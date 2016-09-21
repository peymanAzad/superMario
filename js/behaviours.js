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
     this.a = a;
     this.x0 = x0;
     this.stopStart = false;
 }
 MoveBehavior.prototype = {
     execute: function(sprite, now, context, lastAdvanceTime){
         if(sprite.status === "stop"){
            this.stop(sprite, now);
            return;
        }
         if(!sprite.velocityX && !sprite.aX) return;
         if(!this.t0){
             this.t0  = now;
             return;
         }
         if(this.v0 !== sprite.velocityX || this.a !== sprite.aX){
            this.reset(sprite, now);
            return;
         }
         sprite.left = mechanics.getdeltaX(this.a, this.v0, now - this.t0) + this.x0;
     },
     stop: function(sprite, now){
         var v = mechanics.getV(sprite.aX, sprite.velocityX, now - sprite.t0);
         if((v >= 0 && this.v0 < 0) || (v <= 0 && this.v0 >0)){
             this.stopEnd(sprite, now);
             return;
         }
         if(!this.stopStart){
             if(Math.abs(v) < 0.2) {
                 this.stopEnd(sprite, now);
                 return;
             }
             sprite.t0 = now;
             this.x0 = sprite.left;
             this.v0 = sprite.velocityX;
             this.stopStart = true;
         }
         if(sprite.velocityX > 0)
            sprite.aX= -0.0004;
         else sprite.aX = 0.0004;

         sprite.left = mechanics.getdeltaX(sprite.aX, sprite.velocityX, now - sprite.t0) + this.x0;
     },
     stopEnd: function(sprite, now){
         sprite.aX = this.a = sprite.velocityX = this.v0 =  0;
         this.x0 = sprite.left;
         sprite.status = "stoped";
         this.stopStart = false;
     },
     reset: function(sprite, now){
         this.v0  = sprite.velocityX;
         this.a = sprite.aX;
         sprite.t0 = this.t0 = now;
         this.x0 = sprite.left;
     }
 }
 RunnerMovementBehavior = function(){

 }
 RunnerMovementBehavior.prototype = {
     execute: function(sprite, now){
         if(!sprite.velocityX && !sprite.aX) return;
         if(!sprite.t0) return;
         var v = mechanics.getV(sprite.aX, sprite.velocityX, now - sprite.t0);
         if((sprite.aX > 0 && v > 0.2) || (sprite.aX<0 && v < -0.2)){
            sprite.aX = 0;
            sprite.velocityX = v;
         }
     }
 }