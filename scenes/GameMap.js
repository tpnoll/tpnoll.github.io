class GameMap extends Scene {
    static map_height = 30; //30; 300x500 too big, so is 100x200 12/30/25
    static map_width = 50; //50;
    static pan_speed = 20;

    constructor(canvas_name, canvas_size) {
        super(canvas_name, canvas_size);

        this.tile_array = [];
        this.tile_scale = 2;
        this.position = [0, 0];
    }

    get_canvas_position(array_position) {
        let canvas_position = [null, null];

        // Shift every other row so hexagons tile correctly
        if (array_position[1] % 2 == 0)
            array_position[0] = array_position[0] + 0.5
        
        // Calculate the canvas position from (0, 0)
        canvas_position[0] = array_position[0] * GameTile.width * this.tile_scale;
        canvas_position[1] = array_position[1] * (GameTile.height - GameTile.height_offset) * this.tile_scale;

        // Shift the tile position by the GameMap position
        canvas_position[0] += this.position[0];
        canvas_position[1] += this.position[1];

        return canvas_position;
    }

    // Create all the tiles
    generate_map() {
        let new_tile;
        for (let y = 0; y < GameMap.map_height; y++) {
            for (let x = 0; x < GameMap.map_width; x++) {
                new_tile = new GameTile(this);
                new_tile.set_tile_position(this.get_canvas_position([x, y]));
                this.tile_array.push(new_tile);
            }
        }       
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    scale_map(tile_scale) {
        // TODO: This clearing should probably not happen here
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.tile_scale = tile_scale;
        for (let y = 0; y < GameMap.map_height; y++) {
            for (let x = 0; x < GameMap.map_width; x++) {
                // TODO: I think GameTile should have a method for resizing rather than explictly touching the variable and 
                // forcing it to re-calculate its position, this is super janky
                // I also don't like how we are indexing the array
                this.tile_array[x + y * GameMap.map_width].set_tile_position(this.get_canvas_position([x, y]))
            }
        }  
    }

    update() {
        // Select a tile
        if (this.input.is_mouse_down) {
            this.select_tile(this.input.mouse_location[0], this.input.mouse_location[1]);
        }

        // Control Zoom
        if (this.input.wheel_direction < 0) {
            this.scale_map(this.tile_scale + 0.1);
            this.input.wheel_direction = 0;
        }
        else if (this.input.wheel_direction > 0) {
            this.scale_map(this.tile_scale - 0.1);
            this.input.wheel_direction = 0;
        }

        // Control Pan
        if (this.input.pressed_keys.a) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[0] += GameMap.pan_speed;
            this.scale_map(this.tile_scale);
        }
        if (this.input.pressed_keys.d) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[0] -= GameMap.pan_speed;
            this.scale_map(this.tile_scale);
        }
        if (this.input.pressed_keys.w) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[1] += GameMap.pan_speed;
            this.scale_map(this.tile_scale);
        }
                if (this.input.pressed_keys.s) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[1] -= GameMap.pan_speed;
            this.scale_map(this.tile_scale);
        }
    }

    // Select a tile in the game map
    // TODO: For now, we call set_tile_type
    select_tile(x, y) {
        let tile_index = this.get_tile_index(x, y);

        if (tile_index != null)
            this.tile_array[tile_index].set_tile_type(BuildPalette.selected_type);
    }

    // Calculate the index of the tile from canvas coordinates
    get_tile_index(x, y) {
        
        // Calculate the tiles position if the game map was at (0, 0)
        x = x - this.position[0];
        y = y - this.position[1];

        // Prevent coordinates from parts of the canvas that do not contain tiles
        // Multiple combinations of coordinates can be used to reach the same tile index,
        // So if a user clicks somwhere arbitary, it could select a tile that was not intended
        if (x < 0 || (x > GameMap.map_width * GameTile.width * this.tile_scale))
            return null;
        else if (y < 0 || (y > GameMap.map_height * GameTile.height * this.tile_scale))
            return null;

        // Adjust the coordinates to find the center of the hexagon
        x = x - GameTile.width * this.tile_scale / 2;
        y = y - GameTile.height * this.tile_scale / 2;

        let arr_y = Math.round(y / (GameTile.height - GameTile.height_offset) / this.tile_scale);

        // If the y-index is even, the x tile position is shifted by half a tile width
        if (arr_y % 2 == 0) {
            x = x - GameTile.width/2;
        }

        let arr_x = Math.round(x / GameTile.width / this.tile_scale);
        
        let tile_index = arr_x + arr_y * GameMap.map_width;

        // Never allow an illegal index to be returned
        if (tile_index < 0 || (tile_index > this.tile_array.length - 1))
            return null;

        return arr_x + arr_y * GameMap.map_width;
    }
}