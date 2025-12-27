class GameTile {
    static width = 28;
    static height = 32;
    static height_offset = 9;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.image = document.getElementById('water_tile');
    }
    
    // Calculate the game coordinates from the tile's array position
    set_tile_position(canvas_position) {  
        this.x = canvas_position[0];
        this.y = canvas_position[1];
    }

    set_tile_type(type) {
        if (type < global_images.length)
            this.image = global_images[type];
        else
            this.image = document.getElementById('water_tile');
    }

    draw(context, scale) {
        context.fillstyle = 'white';
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, GameTile.width * scale, GameTile.height * scale);
    }

}