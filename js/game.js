var superMario = function(){
    this.convas = document.getElementById("convas-game");
    this.context = this.convas.getContext("2d");

    this.timeSystem = new TimeSystem();
    
    this.toast = document.getElementById("toast");
    this.paused = false;


    //........................................................levels
    this.level = 0;
    this.subLevel = "Main";
    this.levelData;

    //.........................................................images
    this.spritesheet = new Image();
    this.backgroundArtist = new backgroundArtist(this.convas, this.context, this.spritesheet, data.background)
    
    //.........................................................constants
    this.PAUSE_CHECK_INTERVAL = 200;
    this.lastAnimationFrame = 0;
    this.lastFpsUpdateTime = 0;
    this.VELOCITY_GROUND = 0.001;
    this.backgroundOffset = 0;
    this.BACKGROUND_WIDTH = data.background.width;
    this.DEFAULT_BACKGROUND_VELOCITY = 0.0001;
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

    draw: function(now){
        this.drawBackground();
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
         this.runner = new Sprite("runner");
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

     initializeGame: function(){
         this.initializeImages();
         this.loadLevelData();
     }
}
window.addEventListener('keydown', function (e) {
   var key = e.keyCode;

  
   
 if (key === 80) { // 'p'
      game.togglePause();
   }
   
});
var game = new superMario();
game.initializeGame();