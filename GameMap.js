class GameMap {
    static map_height = 30;
    static map_width = 50;

    constructor(tile_scale) {
        this.tile_array = []
        this.tile_scale = tile_scale;
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
                this.tile_array[x + y * GameMap.map_width].set_tile_position(x, y, this.tile_scale)
            }
        }  
    }

    update(input) {
        if (input.wheel_direction < 0) {
            this.scale_map(this.tile_scale + 0.1);
            input.wheel_direction = 0;
        }
        else if (input.wheel_direction > 0) {
            this.scale_map(this.tile_scale - 0.1);
            input.wheel_direction = 0;
        }
    }
}