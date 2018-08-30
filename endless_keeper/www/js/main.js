
window.onload = function(){
    onDeviceReady();
}


var barConfig;
var jump=0;
var myHealthbar;
var timeText;
var bestTimeText;
var numIntentos=3;
var head1;
var head2;
var head3;
var bestTime;

var gameOptions={
	gameWidth:640,
    gameHeight:360,
    localStorageName: "EndlessKeeper"
}

var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS, 'game');

var boot = {
	init: function (){
         game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         
         if(localStorage.getItem(gameOptions.localStorageName) == null){

			localStorage.setItem(gameOptions.localStorageName, "00:00" );

		}
		else{
		 bestTime =localStorage.getItem(gameOptions.localStorageName);
		}

    },
	preload: function(){

        // assets para el mapa
		game.load.tilemap('map', 'img/Endless_keeper.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'img/warTileset_32x32.png');
        // assets para el jugador
        game.load.image('playerRight', 'img/Keeper47.png');
        game.load.image('playerLeft', 'img/Keeper47_left.png');
        // assets para los botones 
        game.load.image('botonAtras','img/Botones/Boton_atras.png', 171, 37);
        game.load.image('botonControles','img/Botones/Boton_controles.png', 171, 37);
        game.load.image('botonCreditos','img/Botones/Boton_creditos.png', 171, 37);
        game.load.image('botonInicio','img/Botones/Boton_inicio.png', 171, 37);
        // assets para los background
        game.load.image('bgControles','img/Fondos/Controles.png');
        game.load.image('bgMenu','img/Fondos/FondoMenu.png');
        game.load.image('bgCreditos','img/Fondos/Creditos.png');
        game.load.image('bgVacio','img/Fondos/FondoVacio.png');
        game.load.image('bgPreload','img/Fondos/FondoPreload.png');
        game.load.image('healthbg', 'img/healthbg.jpg');
        // assets para el joystick
        game.load.spritesheet('gamepad', 'img/joystick/gamepad_spritesheet.png',100,100);
        // assets para el numero de intentos
        game.load.image('KeeperHead1','img/KeeperHead.png');        
        game.load.image('KeeperHead2','img/KeeperHead.png');        
        game.load.image('KeeperHead3','img/KeeperHead.png');        
		
	},
	create: function(){
		game.state.start('Carga');

	}
}
var initGame={
	
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#787878';

        map = game.add.tilemap('map');

        map.addTilesetImage('EndlessKeeper-World1', 'tiles');

        map.setCollision(2);
        map.setCollision(9);
        map.setCollision(7);
        map.setCollision(10);
        map.setCollision(11);
        map.setCollision(12);
        map.setCollision(14);
        map.setCollision(13);
        map.setCollision(15);
        map.setTileIndexCallback(7, this.killPlayer, this);
        map.setTileIndexCallback(15, this.killPlayer, this);
        map.setTileLocationCallback(206,6,2,2,this.endMap, this);

        btnAtras = game.add.button(32, 300, 'botonAtras');
        btnAtras.fixedToCamera=true;
        btnAtras.cameraOffset.setTo(30, 20);
        
        layer = map.createLayer('World1');

        // layer.debug = true;

        layer.resizeWorld();

        p = game.add.sprite((203*32), 200, 'playerRight');
        game.physics.enable(p);

        game.physics.arcade.gravity.y = 350;

        p.body.bounce.y = 0;
        p.body.linearDamping = 1;
        p.body.collideWorldBounds = true;

        head1 = game.add.sprite(190,10,'KeeperHead1');
        head1.fixedToCamera = true;
        head2 = game.add.sprite(220,10,'KeeperHead2');
        head2.fixedToCamera = true;
        head3 = game.add.sprite(250,10,'KeeperHead3');
        head3.fixedToCamera = true;


        barConfig = {x:550, y:22, flipped:true};
        myHealthbar = new HealthBar(game, barConfig);
        myHealthbar.setFixedToCamera(true);
        myHealthbar.setBarColor('#aaa');
        game.camera.follow(p);

        btnAtras = game.add.button(0,10,'botonAtras',Inicio,this);
        btnAtras.fixedToCamera=true;
        btnAtras.scale.setTo(0.8); 	

        cursors = game.input.keyboard.createCursorKeys();

        // Add the VirtualGamepad plugin to the game
        this.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
            
        // Add a joystick to the game (only one is allowed right now)
        this.joystick = this.gamepad.addJoystick(102, 280,1, 'gamepad');
        
        // Add a button to the game (only one is allowed right now)
        this.button = this.gamepad.addButton(560, 280,0.7, 'gamepad');

        this.startTime = new Date();
        this.totalTime = 120;
        this.timeElapsed = 0;

        timeText = game.add.text(barConfig.x-200,14, "00:00", { font: "16px Arial", fill: "#fff", align: "center" });
        timeText.fixedToCamera = true;  
          
        game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);


    },
    
	 update:function() {
        var bool = false;
		game.physics.arcade.collide(p, layer);

        p.body.velocity.x = 0;

        if (cursors.up.isDown)
        {
            jump+=0.1;
            myHealthbar.setPercent(100-jump);

            if(jump>=100){
                this.killPlayer;
                return false
            }

            if (p.body.onFloor())
            {
                p.body.velocity.y = -190;
            }
        }

        if (this.joystick.properties.left)
        {
            p.body.velocity.x = -120;
            this.changeSide(true);
        }
        else if (this.joystick.properties.right)
        {
            p.body.velocity.x = 120;
            this.changeSide(false);
        }
        this.winPlayer(p);
		switch(numIntentos){
            case 1:
                head1.kill();
                head2.kill();
                break;
            case 2: 
                head1.kill();
                break;
            default:
                break;
        }
    },
    endMap: function(evt){
        this.winPlayer;
        console.log("finished");
    },
    winPlayer: function(){
        var res = bestTime.split(":");
        var local = localStorage.getItem(gameOptions.localStorageName);
        var localSplit = local.split(":");
        if(typeof local != "undefined"){
            if(parseInt(res[0])<=parseInt(localSplit[0])){
                if((parseInt(res[1])<=parseInt(localSplit[1])) || ((parseInt(localSplit[0])==0) && (parseInt(localSplit[1])==0))){
                    localStorage.setItem(gameOptions.localStorageName, bestTime);
                }
            }
        }
    },
    

	killPlayer: function (sprite, tile){
        numIntentos--;
        if(numIntentos<=0){
            game.state.restart();
        }
        else{
            p.body.x=32;
            p.body.y=200;
            jump=0;
            return false;
        }
        
    },

    changeSide: function (bool){
        if(bool){
            p.loadTexture('playerLeft', 0);
        }
        else{
            p.loadTexture('playerRight', 0);
        }
    },
    
    updateTimer: function(){
        var currentTime = new Date();
        var timeDifference = this.startTime.getTime() - currentTime.getTime();
            //Time elapsed in seconds
        this.timeElapsed = Math.abs(timeDifference / 1000);
    
        //Time remaining in seconds
        var timeRemaining = this.timeElapsed;
    
        //Convert seconds into minutes and seconds
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = Math.floor(timeRemaining) - (60 * minutes);
    
        //Display minutes, add a 0 to the start if less than 10
        bestTime = (minutes < 10) ? "0" + minutes : minutes;
    
        //Display seconds, add a 0 to the start if less than 10
        bestTime += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        
        timeText.setText(bestTime);
    }
}

var carga={
    create: function(){
        game.add.sprite(0,0,'bgPreload');
        game.time.events.loop(2500,function(){
            game.state.start('Inicio');
        });
        
    }

}

var inicio={
    create:function() {
        
		game.add.sprite(0, 0,'bgMenu');
        btnPlay = game.add.button(115,150,'botonInicio',goToGame,this);
        btnInfo = game.add.button(198,250,'botonControles',goToControles,this);
        btnInfo.scale.setTo(0.6);	
        btnCreditos = game.add.button(235,320,'botonCreditos',goToCreditos,this);
        btnCreditos.scale.setTo(0.7);	
	},
	 update:function() {
	}
}

var creditos ={

	create:function() {
		game.add.sprite(0, 0,'bgCreditos');
        btnAtras = game.add.button(0,0,'botonAtras',Inicio,this);
        btnAtras.scale.setTo(0.8); 	
         	
	},
	 update:function() {
	}

}

var controles ={

	create:function() {
		game.add.sprite(0, 0,'bgControles');
        var btnAtras = game.add.button(0,0,'botonAtras',Inicio,this);
        btnAtras.scale.setTo(0.8); 	
        	
	},
	 update:function() {
	}

}

function Inicio(){
    game.state.start('Inicio');
}
function goToGame(){
    game.state.start('InitGame');
}

function goToCreditos(){
    game.state.start('Creditos');
}
function goToControles(){
    game.state.start('Controles');
}

function goToGame() {
    game.state.start('InitGame');
}

game.state.add('Boot',boot);
game.state.add('InitGame', initGame);
game.state.add('Inicio', inicio);
game.state.add('Carga', carga);
game.state.add('Creditos', creditos);
game.state.add('Controles', controles);


function onDeviceReady() {
   
	game.state.start('Boot');
}