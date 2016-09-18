var Stopwatch = function ()  {
   this.startTime = 0;
   this.running = false;
   this.elapsed = undefined;

   this.paused = false;
   this.startPause = 0;
   this.totalPausedTime = 0;   
};

Stopwatch.prototype = {
   start: function (now) {
      this.startTime = now ? now : +new Date();
      this.elapsedTime = undefined;
      this.running = true;
      this.totalPausedTime = 0;
      this.startPause = 0;
   },

   stop: function (now) {
      if (this.paused) {
         this.unpause();
      }
      
      this.elapsed = (now ? now : +new Date()) - 
                      this.startTime - 
                      this.totalPausedTime;
      this.running = false;
   },

   pause: function (now) {
      if (this.paused) {
         return;
      }

      this.startPause = now ? now : +new Date(); 
      this.paused = true;
   },

   unpause: function (now) {
      if (!this.paused) {
         return;
      }

      this.totalPausedTime += (now ? now : +new Date()) - 
                              this.startPause; 
      this.startPause = 0;
      this.paused = false;
   },

   isPaused: function () {
      return this.paused;
   },
   
   getElapsedTime: function (now) {
      if (this.running) {
         return (now ? now : new Date().valueOf()) - 
                 this.startTime - 
                 this.totalPausedTime;
      }
      else {
        return this.elapsed;
      }
   },

   isRunning: function() {
      return this.running;
   },

   reset: function(now) {
     this.elapsed = 0;
     this.startTime = now ? now : new Date().valueOf();
     this.elapsedTime = undefined;
     this.running = false;
   }
};
//.....................................................................timeSystem
var TimeSystem = function () {
   this.transducer = function (elapsedTime) { return elapsedTime; };
   this.timer = new Stopwatch();
   this.lastTimeTransducerWasSet = 0;
   this.gameTime = 0;
}

TimeSystem.prototype = {
   start: function () {
      this.timer.start();
   },

   reset: function () {
      this.timer.stop();
      this.timer.reset();
      this.timer.start();
      this.lastTimeTransducerWasSet = this.gameTime;
   },
   
   setTransducer: function (transducerFunction, duration) {
   
      this.lastTransducer = this.transducer,
          self = this;

      this.calculateGameTime();
      //this.reset();
      this.transducer = transducerFunction;

      if (duration) {
         setTimeout( function (e) {
            self.setTransducer(self.lastTransducer);
         }, duration);
      }
   },
   revertToLastTransducer: function(){
       self.setTransducer(self.lastTransducer);
   },
   
   calculateGameTime: function () {
      this.gameTime = this.lastTimeTransducerWasSet + 
                      this.transducer(this.timer.getElapsedTime());
      this.reset();
      
      return this.gameTime;
   }
};