// TODO: I am designing this class on the risky assumption that there will only ever be one instance
class BuildPalette {
    static width = 120;
    static height = 240;
    static selected_type = 0;

    constructor() {
        this.build_palette = document.getElementById('edit_canvas');
        this.build_palette_ctx = this.build_palette.getContext('2d');
        this.input = new InputHandler(this.build_palette);      
        
        this.build_palette.width = BuildPalette.width;
        this.build_palette.height = BuildPalette.height;

        this.draw();
    }

    update() {
        if (this.input.is_mouse_down) {
            
            const mouse_x = this.input.click_location[0];
            const mouse_y = this.input.click_location[1];

            // Make sure we clicked the canvas
            if (mouse_x < 0 || mouse_x > BuildPalette.width)
                return;
            if (mouse_y < 0 || mouse_y > BuildPalette.height)
                return;

            // Drag the canvas around
            if (!this.drag_offset) {
                const rect = this.build_palette.getBoundingClientRect();
                this.drag_offset = [this.input.screen_location[0] - rect.left, this.input.screen_location[1] - rect.top];
            }

            this.build_palette.style.position = "absolute";
            this.build_palette.style.left = (this.input.screen_location[0] - this.drag_offset[0]) + "px";
            this.build_palette.style.top = (this.input.screen_location[1] - this.drag_offset[1]) + "px";

            // Select item to place
            // TODO: These numbers correspond to the ones in draw(), they should all be parameterized
            let arr_x = Math.floor(mouse_x / 40);
            let arr_y = Math.floor(mouse_y / 40);
            BuildPalette.selected_type = arr_x + arr_y * 3;
        }
        else {
            this.drag_offset = null;
        }
    }

    draw() {
        this.build_palette_ctx.fillstyle = 'white';

        let counter = 0;
        let x = 4;
        let y = 4;

        for (const image of global_images) {
            this.build_palette_ctx.drawImage(image, 0, 0, image.width, image.height, x, y, 32, 32);

            counter += 1;
            x += 40;

            if (counter % 3 == 0) {
                x = 0;
                y += 40;
            }
        }
    }
}

