// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(740, 400, Phaser.AUTO, 'game', stateActions);

var score = -2;
var labelScore;
var player;
var pipes;


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg1", "assets/flappy_superman.png");
    game.load.image("playerImg2", "assets/flappy_batman.png");
    game.load.audio("score", "assets/point.ogg");
    game.load.image("block","assets/pipe_red.png")

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);


    game.stage.setBackgroundColor("#8D1919");
    // set the background colour of the scene

    //game.add.text(300,200,"Let's Play!", {font:"40px Arial", fill: "#7A7ACC"});
    // set the title
    //game.add.sprite(300, 300, "playerImg2");
    // sets where to place the image
    //game.add.sprite(1, 350, "playerImg1");




    game.input.onDown.add(clickhandler);
    //game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(changeScore);

    labelScore = game.add.text(20, 20, "0");

    player = game.add.sprite(100, 200, "playerImg1");

    game.physics.arcade.enable(player);

    player.body.gravity.y = 200;

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown);
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    pipes = game.add.group();

    //game.add.sprite(20, 0, "block");
    //game.add.sprite(20, 20, "block");
    //game.add.sprite(20, 50, "block");
    //game.add.sprite(20, 100, "block");
    //game.add.sprite(20, 150, "block");

    pipeInterval = 1.75;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    // call the function
    //generatePipe();

}
function playerJump(){
    player.body.velocity.y = -100;


}


// defines the function
function generatePipe(){

    var gapStart = game.rnd.integerInRange(1, 5);

    for(var count = 0; count < 8; count ++){
        if(count != gapStart && count != gapStart + 1) {
            addPipeBlock(800, count * 50);
        }
    }
    changeScore();

}

function addPipeBlock(x, y){
    var pipe = pipes.create(x, y, "block");
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade.overlap(player, pipes, gameOver);

}
function gameOver() {
   location.reload();
}

function clickhandler(event) {
    alert(score)
    game.add.sprite(event.x, event.y, "playerImg1");
}

function getPoint(){

    score = score + 1;
    game.sound.play("score");

}

function changeScore(){
    score = score + 1;
    if(score>0){
        labelScore.setText(score.toString());
    }

}
function moveRight () {
    player.x = player.x + 10
}
function moveLeft () {
    player.x = player.x - 10
}
// y  increases when going down
function moveUp () {
    player.y = player.y - 10
}
function moveDown () {
    player.y = player.y + 10
}