
// the Game object used by the phaser.io library
var actions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', actions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    // load the images located in the 'assets/' folder and assign names to them (e.g. 'pipe')
    // game.load.image('jamesbond', 'assets/jamesBond.gif');
    game.load.image('flappybird', 'assets/flappy-cropped.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.audio('score', 'assets/point.ogg');
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor('#ccc');

    // create a sprite for the player
    game.add.sprite(100, 200, 'flappybird').anchor.setTo(0.5, 0.5);
    game.add.text(game.width/2, game.height/2 + 30, "Press [Space] to jump!").anchor.set(0.5);

    // assign the 'on_space' function as an event handler to the space key
    game.add.audio('score');
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(on_space);

    // Listen to a mouse click
    game.input.onDown.add(on_mouse, game);
}

function on_mouse(mouse) {
    // mouse.clientX, mouse.ClientY
    console.log(mouse, mouse.x, mouse.y);
    game.add.sprite(mouse.x, mouse.y, 'flappybird').anchor.setTo(0.5, 0.5);
}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    
}

/*
 * This function serves as an event handler for when the space key is pressed. If the
 * game is running, then it will cause the player sprite to jump. If the game has not been started
 * or the game over screen is visible, then this will cause the game to be started.
 */
function on_space() {
    game.sound.play('score');
}
