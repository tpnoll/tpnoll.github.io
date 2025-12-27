// Wait for all assets to load before executing code
window.addEventListener('load', function() {
    const canvas = document.getElementById('game_canvas');
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

    // Random number function
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Each canvas gets an Input Handler
    const input = new InputHandler(canvas);

    // Create a build_palette
    build_palette = new BuildPalette();

    // Initialize background and water
    const background = new Background(canvas.width, canvas.height);

    map0 = new GameMap(2);
    
    // TODO: Pass only canvas width and height
    map0.generate_map();
    map0.draw_terrain();

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

        // Update Build Palette
        // TODO: We should be able to toggle whether or not this is visible
        build_palette.update();

        // Draw the tiles in the game map
        for(const tile of map0.tile_array) {
            tile.draw(ctx, map0.tile_scale);
        }

        // Update the game map
        map0.update(input);

        requestAnimationFrame(animate);
    }
    animate();
});