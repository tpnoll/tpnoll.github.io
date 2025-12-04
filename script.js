// Wait for all assets to load before executing code
window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    
    const musicButton = this.document.getElementById('musicButton');
    const backgroundMusic = this.document.getElementById('backgroundMusic');
    const popSound = this.document.getElementById('popsound');
    const splashSound = this.document.getElementById('splashsound');
    const ringSound = this.document.getElementById('ring');

    allow_sound = false;
    musicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicButton.textContent = '🔊';
            allow_sound = true;
        } 
        else {
            backgroundMusic.pause();
            musicButton.textContent = '🔇';
            allow_sound = false;
        }
    });

    // Restart sound if its ended
    backgroundMusic.addEventListener('ended', () => {
        if (allow_sound) { 
          backgroundMusic.currentTime = 0; 
          backgroundMusic.play(); 
        }
      });    

    function playPopSound() {
        if(allow_sound) {
            popSound.play();
        }
    }

    function playSplashSound() {
        if(allow_sound) {
            splashSound.play();
        }
    }

    function playRingSound() {
        if(allow_sound) {
            ringSound.play();
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = this.gameWidth;
            this.height = this.gameHeight;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }

    // Handle user input
    class InputHandler {
        constructor() {
            // This will hold whether the mouse is being held down and the coordinates
            this.mouseDown = null;
            this.mouseLocation = [0, 0];

            // Event listeners for mouse
            window.addEventListener('mousedown', (e) => {
                this.mouseDown = e.buttons;
            });
            window.addEventListener('mouseup', (e) => {
                this.mouseDown = e.buttons;
            });
            window.addEventListener('mousemove', (e) => {
                // Only update if the mouse is being held down
                const rect = canvas.getBoundingClientRect();
                this.mouseDown = e.buttons;
                //this.mouseLocation[0] = e.clientX - rect.left;
                //this.mouseLocation[1] = e.clientY - rect.top;
                this.mouseLocation[0] = (e.clientX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
                this.mouseLocation[1] = (e.clientY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));
            });

            // Event listeners for touchscreen
            window.addEventListener('touchstart', (e) => {
                this.mouseDown = 1;
            });
            window.addEventListener('touchend', (e) => {
                this.mouseDown = 0;
            });
            window.addEventListener('touchmove', (e) => {
                const rect = canvas.getBoundingClientRect();

                // Get the location of the users finger and adjust the coordinates to match the canvas scaling
                this.mouseLocation[0] = (e.touches[0].pageX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
                this.mouseLocation[1] = (e.touches[0].pageY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));    
            });
        }
    }

    // Random number function
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    const input = new InputHandler();

    // Initialize background and water
    const background = new Background(canvas.width, canvas.height);

    // TODO:
    /*
    1. GameMap class should hold all of the tiles
    2. Generate the map
        a. Procedurally or from a file?
    3. Different types of tiles
        a. (Water, Mountain, Forest, Resource, ???)
    */
    // Initialize and draw a hexagon



    tile_array = []
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 30; x++) {
            new_tile = new GameTile(canvas.width, canvas.height, 0, 0);
            new_tile.set_tile_position(x, y);
            tile_array.push(new_tile);
        }
    }

    // Initialize physics
    init_physics(canvas.width, canvas.height);

    // This function loops to handle animations
    function animate() {
        // Reset the canvas and draw new animations
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //background.draw(ctx);




        // Calculate physics
        //physics_iterate(bubble_array, spoon_hitbox, cup);
        //physics_draw(bubble_array, ctx);

        // physics_draw just draws every object in an array so I can hijack it for this
        // Draw the hexagons
        physics_draw(tile_array, ctx);

        requestAnimationFrame(animate);
    }
    animate();
});