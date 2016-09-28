CycleBehavior = function(pause, duration){
    this.pause = pause || 0;
    this.lastAdvanceTime = 0;
    this.duration = duration || 0;
};
 CycleBehavior.prototype = {
      execute: function(sprite, now, context, lastAnimationFrame){
          if(sprite.type === "runner"){
            if(sprite.velocityX === 0) return;
            else this.duration = 20/Math.abs(sprite.velocityX);
          }
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
         if(!sprite.velocityX && !sprite.aX){
             this.a = this.v = 0;
             return;
        }
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
     this.MOVE_ACCESSLATOR = 0.0004;
     this.VELOCITY_TRESHURE = 0.2;
     this.VELOCITY_JUMP = 0.5;
 }
 RunnerMovementBehavior.prototype = {
     execute: function(sprite, now){
        if (Key.isDown(Key.LEFT)) this.moveLeft(sprite);
        if (Key.isDown(Key.RIGHT)) this.moveRight(sprite);
        if(!Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT)) this.stop(sprite);
        if(Key.isDown(Key.JUMP) && !sprite.jumping){ 
            sprite.velocityY = this.VELOCITY_JUMP;
            sprite.jumping = true;
        }
     },
     stop: function(sprite){
         if(!sprite.velocityX && !sprite.aX) return;
         if((sprite.aX > 0 && sprite.velocityX >= 0) || (sprite.aX < 0 && sprite.velocityX <= 0)){
             sprite.aX = 0;
             sprite.velocityX = 0;
         } 
         if(sprite.velocityX > 0) sprite.aX = -this.MOVE_ACCESSLATOR;
         else if(sprite.velocityX < 0) sprite.aX = this.MOVE_ACCESSLATOR;
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
 RunnerStateBehaviour = function(){
     this.lastVector;
 }
 RunnerStateBehaviour.prototype = {
     execute: function(sprite){
          if(sprite.jumping){
             sprite.artist.state = "jump";
             sprite.artist.cellIndex = 0;
         }else if(sprite.aX === 0 && sprite.velocityX === 0){
             sprite.artist.state = "idle";
             sprite.artist.cellIndex = 0;
         }else if(sprite.velocityX > 0){
             sprite.artist.cells = data[game.runnerType]["right"];
             sprite.artist.state = "run";
         }else if(sprite.velocityX < 0){
             sprite.artist.cells = data[game.runnerType]["left"];
             sprite.artist.state = "run";
         }

     }
 }
 
 FallBehaviour = function(t0, v0, a, y0){
     this.t0 = t0;
     this.v0 = v0;
     this.v = v0;
     this.a = a;
     this.y0 = y0;
 }
 FallBehaviour.prototype = {
     execute: function(sprite, now){
         if (!this.isFalling(sprite) && sprite.velocityY <= 0 ) {
             sprite.aY = sprite.velocityY = this.a = this.v = 0;
             sprite.jumping = false;
            }
         else {
             sprite.aY = game.GRAVITY_ACCESSLATOR;
             if (!sprite.velocityY && !sprite.aY) {
                 this.aY = this.v = 0;
                 return;
             }
             this.fall(sprite, now);
         }
     },
     isFalling: function (sprite) {
         var allplatforms = game.platforms.concat(game.grounds);
         for (var i = 0; i < allplatforms.length; i++) {
             var platform = allplatforms[i];
             if(mechanics.isPlatformUnderSprite(sprite, platform)) return false;
         }
         return true;
     },
     fall: function(sprite, now){
         if(!this.t0){
             this.t0  = now;
             return;
         }
         if(sprite.velocityY !== this.v || this.a !== sprite.aY){
            this.reset(sprite, now);
            return;
         }
         this.v = sprite.velocityY = mechanics.getV(sprite.aY, this.v0, now - this.t0);
         sprite.top = -mechanics.getdeltaX(this.a, this.v0, now - this.t0) + this.y0;
     },
     reset: function(sprite, now){
         this.v0 = this.v = sprite.velocityY;
         this.a = sprite.aY;
         sprite.t0 = this.t0 = now;
         this.y0 = sprite.top;
     }
 }
 