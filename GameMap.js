class GameMap {
    static map_height = 30;
    static map_width = 50;

    constructor(tile_scale) {
        this.tile_array = []
        this.tile_scale = tile_scale;
        this.position = [0, 0];
    }

    // Create all the tiles
    generate_map(canvas) {
        let new_tile;
        for (let y = 0; y < GameMap.map_height; y++) {
            for (let x = 0; x < GameMap.map_width; x++) {
                new_tile = new GameTile(canvas.width, canvas.height);
                new_tile.set_tile_position(x, y, this.tile_scale);
                this.tile_array.push(new_tile);
            }
        }       
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Temporary function to make random tiles land
    draw_terrain() {
        console.log(this.tile_array[0].x);
        for (const tile of this.tile_array) {
            tile.set_tile_type(this.getRandomInt(0,1));
        }
    }

    scale_map(tile_scale) {
        this.tile_scale = tile_scale;
        for (let y = 0; y < GameMap.map_height; y++) {
            for (let x = 0; x < GameMap.map_width; x++) {
                // TODO: I think GameTile should have a method for resizing rather than explictly touching the variable and 
                // forcing it to re-calculate its position, this is super janky
                // I also don't like how we are indexing the array
                this.tile_array[x + y * GameMap.map_width].set_tile_position(x + this.position[0], y + this.position[1], this.tile_scale)
            }
        }  
    }

    update(input) {
        // Select a tile
        if (input.is_mouse_down) {
            this.select_tile(input.mouse_location[0], input.mouse_location[1]);
        }

        // Control Zoom
        if (input.wheel_direction < 0) {
            this.scale_map(this.tile_scale + 0.1);
            input.wheel_direction = 0;
        }
        else if (input.wheel_direction > 0) {
            this.scale_map(this.tile_scale - 0.1);
            input.wheel_direction = 0;
        }

        // Control Pan
        if (input.pressed_keys.a) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[0] += 2;
            this.scale_map(this.tile_scale);
        }
        if (input.pressed_keys.d) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[0] -= 2;
            this.scale_map(this.tile_scale);
        }
        if (input.pressed_keys.w) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[1] += 2;
            this.scale_map(this.tile_scale);
        }
                if (input.pressed_keys.s) {
            // TODO: This is inconsistent with how zoom is handled
            this.position[1] -= 2;
            this.scale_map(this.tile_scale);
        }
    }

    // For now, turn a selected tile to sand
    select_tile(x, y) {
        let tile_index = this.get_tile_index(x, y);

        if (tile_index != null)
            this.tile_array[tile_index].set_tile_type(2);
    }

    // Calculate the index of the tile from canvas coordinates
    get_tile_index(x, y) {
        
        // The user clicks on the tile, we must back-calculate the tiles original position to get a consistent conversion
        // for the array index
        x = x - this.position[0] * GameTile.width * this.tile_scale;
        y = y - this.position[1] * (GameTile.height - GameTile.height_offset) * this.tile_scale;

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