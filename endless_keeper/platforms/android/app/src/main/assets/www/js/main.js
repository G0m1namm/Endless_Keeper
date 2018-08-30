
window.onload = function(){
    onDeviceReady();
}


var barConfig;
var jump=0;
var myHealthbar;

var gameOptions={
	gameWidth:640,
	gameHeight:360
}

var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS, 'game');

var boot = {
	init: function (){
		 game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

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
		
	},
	create: function(){
		game.state.start('InitGame');

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

        btnAtras = game.add.button(32, 300, 'botonAtras');
        btnAtras.fixedToCamera=true;
        btnAtras.cameraOffset.setTo(30, 20);
        
        layer = map.createLayer('World1');

        // layer.debug = true;

        layer.resizeWorld();

        p = game.add.sprite(32, 200, 'playerRight');
        game.physics.enable(p);

        game.physics.arcade.gravity.y = 350;

        p.body.bounce.y = 0;
        p.body.linearDamping = 1;
        p.body.collideWorldBounds = true;

        barConfig = {x:550, y:32, flipped:true};
        myHealthbar = new HealthBar(game, barConfig);
        myHealthbar.setFixedToCamera(true);
        myHealthbar.setBarColor('#aaa');
        game.camera.follow(p);

        cursors = game.input.keyboard.createCursorKeys();

        // Add the VirtualGamepad plugin to the game
        this.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
            
        // Add a joystick to the game (only one is allowed right now)
        this.joystick = this.gamepad.addJoystick(102, 280,1, 'gamepad');
        
        // Add a button to the game (only one is allowed right now)
        this.button = this.gamepad.addButton(560, 280,0.7, 'gamepad');



    },
    
	 update:function() {
        var bool = false;
		game.physics.arcade.collide(p, layer);

        p.body.velocity.x = 0;

        if (this.button.isDown)
        {
            jump+=0.1;
            myHealthbar.setPercent(100-jump);

            if(jump>=100){
                p.kill();
                game.state.restart();
                jump=0;
                return false
            }

            if (p.body.onFloor())
            {
                p.body.velocity.y = -190;
            }
        }

        if (this.joystick.properties.left)
        {
            p.body.velocity.x = -90;
            this.changeSide(true);
        }
        else if (this.joystick.properties.right)
        {
            p.body.velocity.x = 90;
            this.changeSide(false);
        }

		
	},

	killPlayer: function (sprite, tile){
        p.kill();
        this.game.state.restart();
        return false;
    },

    changeSide: function (bool){
        if(bool){
            p.loadTexture('playerLeft', 0);
        }
        else{
            p.loadTexture('playerRight', 0);
        }
    }
}

function goToGame() {
    game.state.start('InitGame');
}



	game.state.add('Boot',boot);
	game.state.add('InitGame', initGame);



function onDeviceReady() {
   
	game.state.start('Boot');
}