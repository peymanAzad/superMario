var superMario = function(){
    this.convas = document.getElementById("convas-game");
    this.context = this.convas.getContext("2d");
    
    this.toast = document.getElementById("toast");

    //........................................................levels
    this.level = 0;
    this.subLevel = "Main";
    this.levelData;

    //.........................................................images
    this.spritesheet = new Image();
    
    //.........................................................constants
    this.PAUSE_CHECK_INTERVAL = 200;
    this.lastAnimationFrame = 0;
    this.lastFpsUpdateTime = 0;
}

superMario.prototype = {
     animate: function(now){
        if(game.paused){
            setTimeout(function(){
                requestNextAnimationFrame(game.animate)
            }, game.PAUSE_CHECK_INTERVAL);
        }else{
            game.fps = game.calculateFps(now);
            
            //game.draw(now);
            
            requestNextAnimationFrame(game.animate);
        }
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

var game = new superMario();
game.initializeGame();