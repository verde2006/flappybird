/* Global Variables & Constants */

// the jump velocity of the player - the larger the number the higher it jumps
var jump_height = 200;
// the initial height of the player
var initial_height = 270;
// the right margin of the player
var player_margin = 60;
// indicates whether the game is waiting for the player to fall after a pipe was hit
var player_falling = false;

// the height of pipe sprites
var pipe_size = 50;
// the horizontal offset at which pipes are spawned
var pipe_offset = 900;
// the interval (in seconds) at which new pipe columns are spawned
var pipe_interval = 1.75;
// the number of pipe sprites that make up a pipe column
var number_of_pipes = 8;
// the bigger the number the quicker the player falls
var gravity = 400;

// the height of the game scene
var game_height = pipe_size * number_of_pipes;
// the width of the game scene
var game_width = 790;
// the horizontal speed in pixels at which pipes move per second
var game_speed = 200;
// a boolean indicating whether the game is running or not
var game_playing = false;

// stores the current score
var score = 0;
// the interval (fraction of a second) at which the score is updated
var score_update_interval = 10;
// stores the distance that has been travelled by pipes
var distance_travelled = 0;

// font styles for the text
var big_style = { font: "30px Arial", fill: "#ffffff" };
var small_style = { font: "20px Arial", fill: "#ffffff" };

// variables which represent labels used to display text on the screen
var label_score;
var label_instructions;
var label_gameover;

// the player sprite
var player;
// the group of pipe sprites
var pipes;

// the Game object used by the phaser.io library
var actions = { preload: preload, create: create, update: update };
var game = new Phaser.Game(game_width, game_height, Phaser.AUTO, 'game', actions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    // load the images located in the 'assets/' folder and assign names to them (e.g. 'pipe')
    // game.load.image('jamesbond', 'assets/jamesBond.gif');
    game.load.image('flappybird', 'assets/flappy-cropped.png');
    game.load.image('pipe', 'assets/pipe.png');
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // there are three physics engine. this is the basic one
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // set the background colour of the scene
    game.stage.setBackgroundColor('#048C91');

    // create a sprite for the player
    player = game.add.sprite(player_margin, initial_height, 'flappybird');
    // player = game.add.sprite(player_margin, initial_height, 'jamesbond');

    // set the anchor to the middle of the sprite
    player.anchor.setTo(0.5, 0.5);

    // enable physics (gravity etc) for the player sprite
    game.physics.arcade.enable(player);

    // test whether the player sprite is still within the world bounds at each frame
    // and trigger the 'onOutOfBounds' event if not
    player.checkWorldBounds = true;

    // initialise the labels for the score, instructions, and game over message
    label_score = game.add.text(20, 20, score, big_style);
    label_score.visible = false;

    label_instructions = game.add.text(game.width/2, game.height/2 + 30, "Press [Space] to jump!", small_style);
    label_instructions.anchor.set(0.5);

    label_gameover = game.add.text(game.width/2,game.height/2, "Game over!", big_style);
    label_gameover.anchor.set(0.5);
    label_gameover.visible = false;

    // assign the 'on_space' function as an event handler to the space key
    var space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(on_space);

    // create a new group for the pipe sprites - this will allow us to easily manipulate all
    // pipes at once later on
    pipes = game.add.group();
}

/*
 * This function is called every time the game is started.
 */
function reset() {
    // toggle the visibility of the labels
    label_instructions.visible = false;
    label_gameover.visible = false;
    label_score.visible = true;

    // reset the score
    score = 0;
    label_score.setText(score);

    // reset the distance travelled to a negative value to account for
    // the longer distance to the first pipe
    distance_travelled = 0 - pipe_offset;

    // reset the player to its initial position - also resets the physics
    player.reset(player_margin, initial_height);

    // the bigger the number the quicker the player falls
    player.body.gravity.y = gravity;

    // set up timers for the pipe generation and score updates
    game.time.events.loop(Phaser.Timer.SECOND * pipe_interval, generate_pipes);
    game.time.events.loop(Phaser.Timer.SECOND / score_update_interval, update_score);

    // set up 'game_over' as an event handler for when the player sprite leaves the bounds of the screen
    player.events.onOutOfBounds.removeAll();
    player.events.onOutOfBounds.add(game_over);

    // change the state of the game
    game_playing = true;
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    // check that we are not currently in a menu
    if(!game_playing)
        return;

    // check for overlap between the player sprite and any pipe - call the 'game_over' function
    // if there is an overlap
    game.physics.arcade.overlap(player, pipes, game_over);

    // reset the rotation of the player once it starts falling after a jump
    if(player.body.velocity.y >= 0) {
        game.add.tween(player).to({angle: 0}, 100).start();
    }
}

/*
 * Calculates the score and updates the score label. This function is called
 * score_update_interval-many times per second.
 */
function update_score() {
    // game_speed is the velocity at which the pipes move to the left (in pixels) of the screen (per second)
    distance_travelled += game_speed / score_update_interval;

    if(distance_travelled >= 0) {
        // pipe_interval is the interval in seconds at which pipes spawn
        var pipe_distance = pipe_interval * game_speed;

        score = Math.floor(distance_travelled / pipe_distance);
    }

    label_score.setText(score);
}

/*
 * This function serves as an event handler for when the space key is pressed. If the
 * game is running, then it will cause the player sprite to jump. If the game has not been started
 * or the game over screen is visible, then this will cause the game to be started.
 */
function on_space() {
    if(game_playing) {
        jump();
    }
    else if(!player_falling) {
        reset();
    }
}

/*
 * Sets the player sprite's vertical velocity to a negative value, which causes it to go up.
 */
function jump() {
    // the smaller the number the higher it jumps
    player.body.velocity.y = jump_height * -1;
    // a bit of banter to rotate the player slightly as it jumps
    game.add.tween(player).to({angle: -15}, 100).start();
}

/*
 * Adds a single pipe sprite to the game at the specified coordinates.
 */
function add_one_pipe(x, y) {
    // create the pipe in the 'pipes' group
    var pipe = pipes.create(x, y, 'pipe');

    // enable physics for the pipe
    game.physics.arcade.enable(pipe);

    // set the pipe's horizontal velocity to a negative value, which causes it to go left.
    pipe.body.velocity.x = game_speed * -1;
}

/*
 * This function serves as an event handler for the pipe generator. It is called score_update_interval
 * times per second.
 */
function generate_pipes() {
    // calculate a random position for the hole within the pipe
    var hole = Math.floor(Math.random()*5)+1;

    // generate the pipes, except where the hole should be
    for (var i = 0; i < hole; i++) {
        add_one_pipe(pipe_offset, i * pipe_size);
    }
    for(var i = hole + 2; i < number_of_pipes; i++){
        add_one_pipe(pipe_offset, i * pipe_size);
    }
}

/*
 * This function is used as an event handler if the game is waiting for the player sprite to fall out of
 * the scene after a pipe has been hit.
 */
function player_fallen() {
    // we are no longer waiting for the player sprite to fall out of the scene
    player_falling = false;
    player.events.onOutOfBounds.removeAll();

    label_instructions.visible = true;
}

/*
 * This function stops the game. It is called when the player sprite touches a pipe or leaves
 * the bounds of the scene.
 */
function game_over() {
    // check that the game hasn't been stopped already
    if(!game_playing)
        return;

    game_playing = false;

    // stop all events (generation of pipes, score updates)
    game.time.events.removeAll();

    // remove all pipes from the game
    pipes.destroy(true, true);

    // remove the event handler which checks if the player sprite has left the bounds of the scene
    player.events.onOutOfBounds.removeAll();

    // if the player sprite is still within the bounds of the scene, we want to wait for it to fall out
    // before allowing the game to be restarted (this is purely for aesthetics)
    // otherwise, we don't wait
    if(game.world.bounds.contains(player.x, player.y)) {
        // change the game state to 'waiting for the player to fall out of the scene' and set up an
        // event handler which waits for this to occur
        player_falling = true;
        player.events.onOutOfBounds.add(player_fallen);
    }
    else {
        label_instructions.visible = true;
    }

    // toggle the visibility of the game over/score labels
    label_gameover.visible = true;
    label_score.visible = false;
}
