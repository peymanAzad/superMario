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
 }
 MoveBehavior.prototype = {
     execute: function(sprite, now, context, lastAdvanceTime){
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
     reset: function(sprite, now){
         this.v0  = sprite.velocityX;
         this.a = sprite.aX;
         this.t0 = now;
         this.x0 = sprite.left;
     }
 }
 