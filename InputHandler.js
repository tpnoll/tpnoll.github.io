class InputHandler {
    
    constructor(canvas) {
        this.is_mouse_down = false;
        this.mouse_location = [0, 0];
        this.click_location = [0, 0];
        this.screen_location = [0, 0];

        this.pressed_keys = {
            w: false,
            a: false,
            s: false,
            d: false
        }

        // Event listeners for mouse
        window.addEventListener('mousedown', (e) => {
            // Return if this was not the canvas that was clicked
            if (!canvas.contains(e.target)) return;

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

            // Cursor location on the canvas
            this.mouse_location[0] = (e.clientX * (canvas.width/(rect.right - rect.left)) - rect.left * (canvas.height/(rect.bottom - rect.top)));
            this.mouse_location[1] = (e.clientY * (canvas.height/(rect.bottom - rect.top)) - rect.top * (canvas.height/(rect.bottom - rect.top)));
        
            // Cursor location on the screen
            this.screen_location[0] = e.clientX;
            this.screen_location[1] = e.clientY;
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