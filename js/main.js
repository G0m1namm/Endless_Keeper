document.addEventListener("deviceready", onDeviceReady, false);



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
		game.load.tilemap('mapa', 'assets/Endless_keeper.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/warTileset_32x32.png');
        // assets para el jugador
        game.load.image('player', 'assets/Keeper32.png');
        // assets para los botones 
        game.load.image('botonAtras','assets/Botones/Boton_atras.png');
        game.load.image('botonControles','assets/Botones/Boton_controles.png');
        game.load.image('botonCreditos','assets/Botones/Boton_creditos.png');
        game.load.image('botonInicio','assets/Botones/Boton_inicio.png');
        // assets para los background
        game.load.image('bgControles','assets/Fondos/Controles.png');
        game.load.image('bgMenu','assets/Fondos/FondoMenu.png');
        game.load.image('bgCreditos','assets/Fondos/Creditos.png');
        game.load.image('bgVacio','assets/Fondos/FondoVacio.png');
        game.load.image('bgPreload','assets/Fondos/FondoPreload.png');

		
	},
	create: function(){
		game.state.start('InitGame');

	}
}
var initGame={
	
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#787878';

        map = game.add.tilemap('mapa');

        map.addTilesetImage('EndlessKeeper-World1', 'tiles');

        map.setCollision(12);
        map.setCollision(15);
        map.setCollision(9);
        map.setTileIndexCallback(9, this.hitCoin, this);

        btnAtras = game.add.button(32, 300, 'botonAtras');
        btnAtras.fixedToCamera=true;
        btnAtras.cameraOffset.setTo(30, 20);
        
        layer = map.createLayer('World1');

        // layer.debug = true;

        layer.resizeWorld();

        p = game.add.sprite(32, 200, 'player');
        game.physics.enable(p);

        game.physics.arcade.gravity.y = 350;

        p.body.bounce.y = 0;
        p.body.linearDamping = 1;
        p.body.collideWorldBounds = true;
        game.camera.follow(p);

        cursors = game.input.keyboard.createCursorKeys();



	},

	hitCoin: function (sprite, tile){
        p.kill();
        this.game.state.restart();
        return false;
    }
}

function onDeviceReady() {
   
	game.state.start('Boot');
}