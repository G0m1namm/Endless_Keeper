
window.onload = function(){
    onDeviceReady();
}


var barConfig;
var jump=0;
var myHealthbar;
var timeText;
var punto;
var bestTimeText;
var numIntentos=3;
var head1;
var head2;
var head3;
var bestTime;
var check;
var check2 = 0;
var music;
var reg = {};

var gameOptions={
	gameWidth:640,
    gameHeight:360,
    localStorageName: "EndlessKeeper"
}

var game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, Phaser.CANVAS, 'game');
WebFontConfig = {
    google: {
      families: ['Roboto Slab']
    }

};
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
        // fonts
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        // Musica de fondo
        game.load.audio('musica',['img/musica.ogg']);
        // assets para el mapa
		game.load.tilemap('map', 'img/Endless_keeper.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('map2', 'img/DangerMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'img/warTileset_32x32.png');
        game.load.image('tiles2', 'img/wall.png');
        // assets para el jugador
        game.load.image('playerRight', 'img/Keeper47.png');
        game.load.image('playerLeft', 'img/Keeper47_left.png');
        // assets para los botones 
        game.load.image('botonAtras','img/Botones/Boton_atras.png', 171, 37);
        game.load.image('botonControles','img/Botones/Boton_controles.png', 171, 37);
        game.load.image('botonCreditos','img/Botones/Boton_creditos.png', 171, 37);
        game.load.image('botonInicio','img/Botones/Boton_inicio.png', 171, 37);
        game.load.image('botonReiniciar','img/Botones/reiniciar.png', 171, 37);
        game.load.image('botonAdelante','img/Botones/leftArrow.png', 171, 37);
        game.load.image('botonAnterior','img/Botones/rightArrow.png', 171, 37);
        // assets para los background
        game.load.image('bgControles','img/Fondos/Controles.png');
        game.load.image('bgMenu','img/Fondos/FondoMenu.png');
        game.load.image('bgCreditos','img/Fondos/Creditos.png');
        game.load.image('bgVacio','img/Fondos/FondoVacio.png');
        game.load.image('bgPreload','img/Fondos/FondoPreload.png');
        game.load.image('healthbg', 'img/healthbg.jpg');
        game.load.image('bgControles2','img/Fondos/Controles2.jpg');
        // assets para el joystick
        game.load.spritesheet('gamepad', 'img/joystick/gamepad_spritesheet.png',100,100);
        // assets para el numero de intentos
        game.load.image('KeeperHead1','img/KeeperHead.png');        
        game.load.image('KeeperHead2','img/KeeperHead.png');        
        game.load.image('KeeperHead3','img/KeeperHead.png');
        // assets para los modals
        game.load.image('victoria','img/Fondos/victoria.png'); 
        game.load.image('derrota','img/Fondos/derrota.png'); 
		
	},
	create: function(){
		game.state.start('Carga');

	}
}
var level1={
	
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#000';
        music=game.add.audio('musica');
        music.volume -= 0.8;
        music.play();
        map = game.add.tilemap('map');

        map.addTilesetImage('EndlessKeeper-World1', 'tiles');

        map.setCollision(2);
        map.setCollision(4);
        map.setCollision(5);
        map.setCollision(9);
        map.setCollision(7);
        map.setCollisionBetween(10,15);
        map.setTileIndexCallback(7, this.killPlayer, this);
        map.setTileIndexCallback(15, this.killPlayer, this);
        map.setTileLocationCallback(206,6,2,2,this.endMap, this);
        
        layer = map.createLayer('World1');

        // layer.debug = true;

        layer.resizeWorld();

        p = game.add.sprite(32, 200, 'playerRight');
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

        this.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
            
        this.joystick = this.gamepad.addJoystick(102, 280,1, 'gamepad');
        
        this.button = this.gamepad.addButton(560, 280,0.7, 'gamepad');

        this.startTime = new Date();
        this.totalTime = 120;
        this.timeElapsed = 0;

        timeText = game.add.text(barConfig.x-200,14, "00:00", { font: "16px Arial", fill: "#fff", align: "center" });
        timeText.fixedToCamera = true;  

        game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);


    },
    
	 update:function() {
		game.physics.arcade.collide(p, layer);

        p.body.velocity.x = 0;

        if (cursors.up.isDown)
        {
            jump+=0.1;
            myHealthbar.setPercent(100-jump);

            if(jump>=100){
                goToGameOver();
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
        if(p.body.x > (103*32)){
            check = true;
        }
        else{
            check = false;
        }
    },
    endMap: function(evt){
        this.winPlayer;
        goToVictory();
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
        if(numIntentos<=0 || jump>=100){
            goToGameOver();
            numIntentos=4;
            jump = 0;
        }
        else{
            if(check){
                p.body.x= (104*32);
                p.body.y=(4*32);
                return false;
            }
            p.body.x= 32;
            p.body.y=200;
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

var level2={
	
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#AEC440';
        music=game.add.audio('musica');
        music.volume -= 0.8;
        music.play();
        map2 = game.add.tilemap('map2');

        map2.addTilesetImage('wall', 'tiles2');

        map2.setCollision(53);
        map2.setCollision(43);
        map2.setCollision(72);
        map2.setCollision(73);
        map2.setCollision(71);
        map2.setCollision(81);
        map2.setCollision(82);
        map2.setCollision(3);
        map2.setCollision(1);
        map2.setCollision(36);
        // map.setCollisionBetween(10,15);
        map2.setTileIndexCallback(71, this.killPlayer, this);
        map2.setTileIndexCallback(72, this.killPlayer, this);
        map2.setTileIndexCallback(81, this.killPlayer, this);
        map2.setTileIndexCallback(15, this.killPlayer, this);
        // map2.setTileLocationCallback(79,14,3,2,this.checkpoint, this);
        // map2.setTileLocationCallback(137,12,3,2,this.checkpoint, this);
        // map2.setTileLocationCallback(222,7,3,2,this.checkpoint, this);
        // map2.setTileLocationCallback(354,12,3,2,this.checkpoint, this);
        map2.setTileLocationCallback(421,25,2,2,this.endMap, this);
        map2.setTileLocationCallback(208,11,3,4,this.changeColorBg, this);

        layer = map2.createLayer('backgroundZone');

        // layer.debug = true;

        layer.resizeWorld();


        p = game.add.sprite((208*16), 200, 'playerRight');
        game.physics.enable(p);

        game.physics.arcade.gravity.y = 350;

        p.body.bounce.y = 0;
        p.body.linearDamping = 1;
        p.body.collideWorldBounds = true;
        p.scale.setTo(0.8);

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

        this.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
            
        this.joystick = this.gamepad.addJoystick(102, 280,1, 'gamepad');
        
        this.button = this.gamepad.addButton(560, 280,0.7, 'gamepad');

        this.startTime = new Date();
        this.totalTime = 120;
        this.timeElapsed = 0;

        timeText = game.add.text(barConfig.x-200,14, "00:00", { font: "16px Arial", fill: "#fff", align: "center" });
        timeText.fixedToCamera = true;  

        punto = game.add.text(barConfig.x-200,34, check2, { font: "16px Arial", fill: "#fff", align: "center" });
        punto.fixedToCamera = true;  

        game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);


    },
    
	 update:function() {
		game.physics.arcade.collide(p, layer);

        p.body.velocity.x = 0;

        if (this.button.isDown)
        {
            jump+=0.1;
            myHealthbar.setPercent(100-jump);

            if(jump>=100){
                goToGameOver();
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
        if(p.body.x > (79*16)){
            check2 = 1;
        }
        if(p.body.x >= (137*16) && check2 == 1){
            check2 = 2;

        }
        if(p.body.x >= (222*16) && check2 == 2){
            check2 = 3;

        }
        if(p.body.x >= (354*16) && check2 == 3){
            check2 = 4;

        }
    },
    // checkpoint: function(point){
    //     check2++;
    // },
    changeColorBg: function(evt){
        game.stage.backgroundColor = '#204631';
    },
    endMap: function(evt){
        this.winPlayer;
        goToVictory();
        numIntentos=3;
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
        if(numIntentos<=0 || jump>=100){
            goToGameOver();
            numIntentos=4;
            check2 = 0;
            jump = 0;

        }
        else{
            if(check2 == 0){
                p.body.x= 32;
                p.body.y= 200;
                return false;
            }
            if(check2 == 1){
                p.body.x =  (79 * 16);
                p.body.y = (14 * 16);
                return false;
    
            }
            if(check2 == 2){
                p.body.x =  (137 * 16);
                p.body.y = (12 * 16);
                return false;
    
            }
            if (check2 == 3){
                p.body.x =  (222 * 16);
                p.body.y = (7 * 16);
                return false;
    
            }
            if(check2 == 4){
                p.body.x =  (354 * 16);
                p.body.y = (12 * 16);
                return false;
    
            }
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
        var btnAdelante= game.add.button(590,150,'botonAnterior',goToControles2,this);
        	
	},
	 update:function() {
	}

}

var controles2 ={

	create:function() {
		game.add.sprite(0, 0,'bgControles2');
        var btnAtras = game.add.button(0,0,'botonAtras',Inicio,this);
        btnAtras.scale.setTo(0.8);	
        var btnAnterior= game.add.button(10,150,'botonAdelante',goToControles,this);
	},
	 update:function() {
	}

}

var victory = {

    create: function(){
        game.add.sprite(0.5, 0.5,'bgMenu');
        var vic =game.add.image(0,0,'victoria');
        vic.scale.setTo(0.6);
        var score = game.add.text(gameOptions.gameWidth/1.8,203, bestTime, { font: "20px", fill: "#000", align: "center" });
        score.font = 'Roboto Slab';
        score.strokeThickness = 1;
        var btnHome = game.add.button(gameOptions.gameWidth/2.6,gameOptions.gameHeight-45,'botonInicio',Inicio,this);
        btnHome.scale.setTo(0.4);
    },
    update: function(){}
    
}

var gameOver= {

    create: function(){
        game.add.sprite(0.5, 0.5,'bgMenu');
		var vic =game.add.image(0,0,'derrota');
        vic.scale.setTo(0.6);
        var score = game.add.text(gameOptions.gameWidth/1.8,203, bestTime, { font: "20px", fill: "#000", align: "center" })
        score.font = 'Roboto Slab';
        score.strokeThickness = 1;
        var btnReiniciar = game.add.button(5,gameOptions.gameHeight-50,'botonReiniciar',goToGame,this);
        btnReiniciar.scale.setTo(0.6);
        var btnHome = game.add.button(470,gameOptions.gameHeight-45,'botonInicio',Inicio,this);
        btnHome.scale.setTo(0.4);

    },
    update: function(){

    }

}

function Inicio(){
    if(typeof music != "undefined"){
        music.pause();
    }
    game.state.start('Inicio');
}
function goToGame(){
    game.state.start('level2');
}

function goToCreditos(){
    game.state.start('Creditos');
}
function goToControles(){
    game.state.start('Controles');
}
function goToControles2(){
    game.state.start('Controles2');
}
function goToGameOver(){
    game.state.start('GameOver');
}
function goToVictory(){
    game.state.start('Victory');
}


game.state.add('Boot',boot);
game.state.add('level1', level1);
game.state.add('level2', level2);
game.state.add('Inicio', inicio);
game.state.add('Carga', carga);
game.state.add('Creditos', creditos);
game.state.add('Controles', controles);
game.state.add('Controles2', controles2);
game.state.add('GameOver', gameOver);
game.state.add('Victory', victory);


function onDeviceReady() {
    game.state.start('Boot');
}