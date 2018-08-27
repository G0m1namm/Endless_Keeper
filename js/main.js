document.addEventListener("deviceready", onDeviceReady, false);



var gameOptions={
	gameWidth:640,
	gameHeight:360
}
var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS, 'game');