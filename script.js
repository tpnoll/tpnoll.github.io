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
            this.is_mouse_down = false;
            this.mouse_location = [0, 0];
            this.click_location = [0, 0];

            this.pressed_keys = {
                w: false,
                a: false,
                s: false,
                d: false
            }

            // Event listeners for mouse
            window.addEventListener('mousedown', (e) => {
                const rect = canvas.getBoundingClientRect();
                this.is_mouse_down = true;
                
                this.click_location[0] = (e.clientX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
                this.click_location[1] = (e.clientY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));
            });
            window.addEventListener('mouseup', (e) => {
                this.is_mouse_down = false;
            });
            window.addEventListener('mousemove', (e) => {
                // Only update if the mouse is being held down
                const rect = canvas.getBoundingClientRect();

                this.mouse_location[0] = (e.clientX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
                this.mouse_location[1] = (e.clientY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));
            });
            window.addEventListener('wheel', (e) => {
                this.wheel_direction = e.deltaY;
            });
            // Condition when the mouse leaves the game screen
            window.addEventListener('mouseleave', (e) => {
                this.is_mouse_down = false;
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'w' || e.key === 'W')
                    this.pressed_keys.w = true;
                if (e.key === 'a' || e.key === 'A')
                    this.pressed_keys.a = true;
                if (e.key === 's' || e.key === 'S')
                    this.pressed_keys.s = true;
                if (e.key === 'd' || e.key === 'D')
                    this.pressed_keys.d = true;          
            });

            window.addEventListener('keyup', (e) => {
                if (e.key === 'w' || e.key === 'W')
                    this.pressed_keys.w = false;
                if (e.key === 'a' || e.key === 'A')
                    this.pressed_keys.a = false;
                if (e.key === 's' || e.key === 'S')
                    this.pressed_keys.s = false;
                if (e.key === 'd' || e.key === 'D')
                    this.pressed_keys.d = false;          
            });

            // Event listeners for touchscreen
            window.addEventListener('touchstart', (e) => {
                this.is_mouse_down = true;
            });
            window.addEventListener('touchend', (e) => {
                this.is_mouse_down = false;
            });
            window.addEventListener('touchmove', (e) => {
                const rect = canvas.getBoundingClientRect();

                // Get the location of the users finger and adjust the coordinates to match the canvas scaling
                this.mouse_location[0] = (e.touches[0].pageX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
                this.mouse_location[1] = (e.touches[0].pageY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));    
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

    map0 = new GameMap(2);
    
    // TODO: Pass only canvas width and height
    map0.generate_map(canvas);
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