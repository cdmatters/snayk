/*ideas
*  move the origin
*  flip reverse head if you flip th e
*/

;(function (){
    var Game = function () {
        var screen = document.getElementById('screen').getContext('2d');
        this.size = {x:screen.canvas.width, y:screen.canvas.height};
        this.bodies = [new Player(this)]
        this.origin = new Origin(this)

        var self = this;
        var tick = function(){
            self.update();
            self.draw(screen);
            requestAnimationFrame(tick);
        };
        tick();
    };

    Game.prototype = {
        update: function(){
            this.origin.update();
            for (var i = 0; i< this.bodies.length; i++){
                this.bodies[i].update();
            }
        },
        draw: function(screen){
            screen.clearRect(0, 0, this.size.x, this.size.y);
            this.origin.draw(screen);
            for (var i = 0; i< this.bodies.length; i++){
                this.bodies[i].draw(screen);
            }
        },
        addBody: function(body){
            this.bodies.push(body);
            //console.log(this.bodies)
        }

    };





    var Player = function(game) {
        this.game = game;

        this.size = { x: 10, y: 10};
        this.polars = {r: 100, theta: 0}
        this.centre = { x: this.game.size.x/2 +this.polars.r , y: this.game.size.y / 2}
        
        this.velocity = {r: 0, theta: 0.02}
        this.keyboarder = new Keyboarder();

        this.next = null
        this.prev = null

        this.tracks = {x: [], y: []}
    };

    Player.prototype = {
        update: function(){
            if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)){
                this.velocity.r = 2;
                this.velocity.theta = 0;             
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)){
                this.velocity.r = -2;
                this.velocity.theta = 0;
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)){
                this.velocity.r = 0;
                this.velocity.theta = -0.02
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)){
                this.velocity.r = 0;
                this.velocity.theta = 0.02;
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.ENTER)){
                this.addTail()
                }               
             
            
            this.storeThisPosition();

            this.polars.r += this.velocity.r;
            this.polars.theta += this.velocity.theta;
        
            this.toCartesian(this.polars.r, this.polars.theta) ;


        },
        draw: function(screen) {
            drawRect(screen, this);
        },

        toCartesian: function(){
            this.centre.x = this.polars.r*Math.cos(this.polars.theta) + this.game.origin.centre.x;
            this.centre.y  = this.polars.r*Math.sin(this.polars.theta) + this.game.origin.centre.y;
        },
        storeThisPosition: function(){
            this.tracks.x.push(this.centre.x);
            this.tracks.y.push(this.centre.y);
            if (this.tracks.x.length>5 || this.tracks.y.length>5){
                this.tracks.x.shift();
                this.tracks.y.shift();
            }
        },
        addTail: function(){
            segment = this
                while (true){
                    if (segment.next === null){
                        segment.next = new BodyPart(segment.game, segment);
                        segment.game.addBody(segment.next);
                        break
                    }
                    segment = segment.next
                }
        }

        

    }
        


    var Keyboarder = function() {
        var keyState = {};
        window.addEventListener('keydown', function(e){
            keyState[e.keyCode] = true;
        });

        window.addEventListener('keyup', function(e){
            keyState[e.keyCode] = false;
        })

        this.isDown = function(keyCode){
            return keyState[keyCode]===true;
        };
        this.KEYS = {LEFT: 37, RIGHT:39, UP:38, DOWN:40, ENTER:13}

        }
    


   var Origin = function(game){ //why?? function of game?
       this.game = game;
       this.size = {x:5, y:5};
       this.centre = { x: this.game.size.x/2, y: this.game.size.y / 2};   
    }

    Origin.prototype = {
        update: function(){
            console.log('Only move this if you want insane mode');

        },
        draw: function(screen){
            drawRect(screen, this);
        }
    }


    var BodyPart = function(game, previous){
        this.game = game;

        this.size = {x:10, y:10};
        this.centre = {x:previous.tracks.x[0], y:previous.tracks.y[0]}

        this.prev = previous;
        this.next = null;

        this.tracks = {x:[], y:[]};
        
    }

    BodyPart.prototype = {

        update: function(){
        
        this.storeThisPosition()
        this.centre.x = this.prev.tracks.x[0] ;
        this.centre.y = this.prev.tracks.y[0] ;
        
        },
        
        draw: function(screen){
            drawRect(screen, this)

        },
        storeThisPosition: function(){
            this.tracks.x.push(this.centre.x);
            this.tracks.y.push(this.centre.y);
            if (this.tracks.x.length>5 || this.tracks.y.length>5){
                this.tracks.x.shift();
                this.tracks.y.shift();

            }
        }


    }


    var drawRect = function(screen, body){
        screen.fillRect(body.centre.x - body.size.x/2,
                    body.centre.y - body.size.y/2,
                    body.size.x,
                    body.size.y);
    }


    window.addEventListener('load', function(){
        new Game();
    });
})();

