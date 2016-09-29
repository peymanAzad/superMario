var superMario = function(){
    this.convas = document.getElementById("convas-game");
    this.context = this.convas.getContext("2d");

    this.timeSystem = new TimeSystem();
    
    this.toast = document.getElementById("toast");
    this.paused = false;

    this.keyStatus = "";
    //........................................................levels
    this.level = 0;
    this.subLevel = "main";
    this.levelData;

    //.........................................................images
    this.spritesheet = new Image();
    this.backgroundArtist;
    
    //.........................................................constants
    this.PAUSE_CHECK_INTERVAL = 200;
    this.lastAnimationFrame = 0;
    this.lastFpsUpdateTime = 0;
    this.VELOCITY_GROUND = 0.001;
    this.backgroundOffset = 0;
    this.BACKGROUND_WIDTH = data.background.width;
    this.DEFAULT_BACKGROUND_VELOCITY = 0.0004;

    //.............................................................Velocitires
    this.RUNNER_A_TRESHHOLD = 0.0001;
    this.GRAVITY_ACCESSLATOR = -0.0013;

    //................................................................offsets
    this.spriteOffset = 0;
    
    //................................................................sprites
    this.runnerType = "superMario";

    this.grounds =   [];
    this.platforms = [];
    this.runner;
    this.sprites =   [];
}

superMario.prototype = {
     animate: function(now){
         now = game.timeSystem.calculateGameTime();
        if(game.paused){
            setTimeout(function(){
                requestNextAnimationFrame(game.animate)
            }, game.PAUSE_CHECK_INTERVAL);
        }else{
            game.fps = game.calculateFps(now);

            game.setOffsets(now);
            game.draw(now);
           
            // game.runner.width = data.ground.serface.left.width + 10*data.ground.serface.middle.width  +data.ground.serface.right.width ;
            // game.runner.left = 60;
            // game.runner.offset += game.VELOCITY_GROUND * now;
            // var artist = new groundArtist(game.runner, game.context, game.spritesheet, data.ground, game.convas);
            // game.runner.artist = artist;
            // game.context.translate(-game.runner.offset, 0);
            // artist.draw();
            // game.context.translate(game.runner.offset, 0);
            
            requestNextAnimationFrame(game.animate);
        }
    },

    setBackgroundOffset: function(now, offset){
        if(!offset){
            offset = this.DEFAULT_BACKGROUND_VELOCITY * now;
        }
        this.backgroundOffset += offset;
        if (this.backgroundOffset < 0 || 
        this.backgroundOffset > this.BACKGROUND_WIDTH) {
         this.backgroundOffset = 0;
      }
    },

    setOffsets: function(now){
        this.setBackgroundOffset(now);
    },

    drawBackground: function(){
        this.context.translate(-this.backgroundOffset,0);
        this.backgroundArtist.draw(this.backgroundOffset);
        this.context.translate(this.backgroundOffset, 0);
    },

    isSpriteInGameConvas: function(sprite){
        return (sprite.left + sprite.width > sprite.offset && sprite.left < sprite.offset + this.convas.width);
    },
    
    isSpriteInView: function(sprite){
        return this.isSpriteInGameConvas(sprite);
    },

    updateSprites: function(now){
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            if(sprite.visible && this.isSpriteInView(sprite)){
                sprite.update(now, this.context, this.lastAnimationFrame);
            }
        }
    },
    
    drawSprites: function(){
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            if(sprite.visible && this.isSpriteInView(sprite)){
                if(sprite.type === "runner"){
                    sprite.draw(this.context);
                    continue;
                }
                this.context.translate(-game.spriteOffset, 0);
                sprite.draw(this.context);
                this.context.translate(game.spriteOffset, 0)
            }
        }
    },

    draw: function(now){
        this.drawBackground();
        this.updateSprites(now);
        this.drawSprites();
    },

    togglePause: function(){
        if(this.paused){
            this.timeSystem.revertToLastTransducer();
        }else{
            this.timeSystem.setTransducer(function(t){return 0.0});
        }
        this.paused = !this.paused;
    },
    
    calculateFps: function(now){
        var fps = 1000 / (now-this.lastAnimationFrame);
        this.lastAnimationFrame = now;
        if(now - this.lastFpsUpdateTime >= 1000){
            document.getElementById("fps").innerHTML = fps.toFixed(0) + " fps";
            this.lastFpsUpdateTime = now;
        }
        return fps;
    },

     startGame: function(){
         this.timeSystem.start();
         //game.timeSystem.setTransducer(function(t){return 0.0},2000);
         //this.runner = new Sprite("runner");
        window.requestNextAnimationFrame(this.animate);
    },

    initializeImages: function(){
        this.spritesheet.src = "src/img/spritesheet.png";
        var self = this;
        this.spritesheet.onload = function(e){
            self.startGame();
        }
     },

     loadLevelData: function(){
         var level = levels[this.level];
         this.levelData = level[this.subLevel];
     },

     loadLevel: function(){
         this.loadLevelData();
         this.backgroundArtist =  new backgroundArtist(this.convas, this.context, this.spritesheet, this.levelData.background);
         this.createSprites();
     },

     createGroundSprites: function(){
         for (var index = 0; index < this.levelData.grounds.length; index++) {
             var ground = this.levelData.grounds[index];
             var sprite = new Sprite("ground");
             sprite.left = ground.left;
             sprite.top = ground.top;
             sprite.width = ground.width;
             sprite.height = ground.height;
             var artist = new groundArtist(sprite, this.context, this.spritesheet, data.ground, this.convas);
             sprite.artist = artist;
             this.grounds.push(sprite);
             this.sprites.push(sprite);
         }
     },

     createPlatformSprites: function(){
         for (var index = 0; index < this.levelData.platforms.length; index++) {
             var platform = this.levelData.platforms[index];
             var sprite = new Sprite("platform");
             sprite.left = platform.left;
             sprite.top = platform.top;
             sprite.width = platform.width;
             sprite.height = platform.height;
             var artist = new platformArtist(sprite, this.context, this.spritesheet, platform.cell, platform.shape);
             sprite.artist = artist;
             this.platforms.push(sprite);
             this.sprites.push(sprite);
         }
     },
     
     createrunnerSprite: function(){
          var runner = this.levelData.runner;
          var sprite = new Sprite("runner");
          sprite.top = runner.top;
          sprite.left = runner.left;
          sprite.width = data[this.runnerType][runner.vector].idle[0].width;
          sprite.height = data[this.runnerType][runner.vector].idle[0].height;
          sprite.aY = game.GRAVITY_ACCESSLATOR;
          var artist = new spriteArtist(sprite, this.context, this.spritesheet, data[this.runnerType][runner.vector], runner.state);
          sprite.behaviours.push(new CycleBehavior(0, 100));
          sprite.velocityX = 0;
          sprite.aX = 0;
          sprite.behaviours.push(new MoveBehavior(0, sprite.velocityX, sprite.aX, sprite.left));
          sprite.behaviours.push(new RunnerMovementBehavior());
          sprite.behaviours.push(new RunnerStateBehaviour());
          sprite.behaviours.push(new FallBehaviour(0, sprite.velocityY, sprite.aY, sprite.top))
          sprite.artist = artist;
          
          this.runner = sprite;
          this.sprites.push(sprite);
     },

     createSprites: function(){
         if(this.levelData.grounds)
            this.createGroundSprites();
         if(this.levelData.platforms)
            this.createPlatformSprites();
         if(this.levelData.runner)
            this.createrunnerSprite();
     },

     initializeGame: function(){
         this.initializeImages();
         this.loadLevel();
     }
}

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  JUMP: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(keyCode) {
    this._pressed[keyCode] = true;
  },
  
  onKeyup: function(keyCode) {
    delete this._pressed[keyCode];
  }
};
window.addEventListener('keyup', function(event) { Key.onKeyup(event.keyCode); }, false);
window.addEventListener('keydown', function (e) {
    if(game.key === "pressed")return;
    game.keyStatus = "pressed";
    
    var key = e.keyCode;

    switch (key) {
        case 32: //space
        case 40:
        case 39:
        case 38:
        case 37:
            Key.onKeydown(key);
            break;
        case 80: //p
            game.togglePause();
            break;
    }
}, false);

var game = new superMario();
game.initializeGame();