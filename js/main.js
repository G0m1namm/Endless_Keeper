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
function onDeviceReady() {
   
	game.state.start('Boot');
}