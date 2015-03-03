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
        this.fruit = []

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
            if (Math.random() > 0.995 && this.fruit.length==0){
                this.addFruit()
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
        },
        addFruit: function(){
            console.log('fruit added')
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
             
            
            this.storeInTracks();

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
        storeInTracks: function(){
            storeThisPosition(this)
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
    


    var BodyPart = function(game, previous){
        
        this.game = game;

        this.size = {x:10, y:10};
        this.centre = {x:previous.tracks.x[0], y:previous.tracks.y[0]};

        this.prev = previous;
        this.next = null;

        this.tracks = {x:[], y:[]};
        
    }

    BodyPart.prototype = {

        update: function(){
        
        this.storeInTracks()
        this.centre.x = this.prev.tracks.x[0] ;
        this.centre.y = this.prev.tracks.y[0] ;
        
        },        
        draw: function(screen){
            drawRect(screen, this)
        },
        storeInTracks: function(){
            storeThisPosition(this)
        }
    }

    var Fruit = function (game, point_size, centre, velocity){
        this.game = game; 
        this.points = points;
        
        this.size = {x:10, y:10};
        this.centre = centre;
        this.velocity = velocity;
    }

    Fruit.prototype = {
       draw: function(screen){
            drawRect(screen, this)
       }
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

    var storeThisPosition = function(segment){
        var memory = 5;
        segment.tracks.x.push(segment.centre.x);
        segment.tracks.y.push(segment.centre.y);
        if (segment.tracks.x.length>memory || segment.tracks.y.length>memory){
            segment.tracks.x.shift();
            segment.tracks.y.shift();
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


