// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(700, 400, Phaser.AUTO, 'game', stateActions);

var score;
var player;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg", "assets/flappy_frog.png");
    game.load.audio("score", "assets/point.ogg");
    game.load.image("pipe", "assets/pipe_pink.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    player = game.add.sprite(100, 100, "playerImg");
    // set the background colour of the scene
    game.stage.setBackgroundColor("#3A7ABA");

    //game.input.onDown.add(clickHandler);

    //game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    //game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
    //game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
    //game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);

    var hole = Math.floor(Math.random() * 5) + 1;

    for(var count = 0; count < hole; count++){
        game.add.sprite(20, count * 50, "pipe");
    }

    for(var count = hole + 2; count < 8; count++){
        game.add.sprite(20, count * 50, "pipe");
    }

}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}

function clickHandler(mouse) {
    player.x = mouse.x;
    player.y = mouse.y;
}

function spaceHandler() {
    game.sound.play("score");
}

function moveLeft(){
    player.x -= 20;
}

function moveRight(){
    player.x+=20;
}

function moveUp(){
    player.y-=50;
}

function moveDown(){
    player.y+=50;
}