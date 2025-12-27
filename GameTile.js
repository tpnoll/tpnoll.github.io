class GameTile {
    static width = 28;
    static height = 32;
    static height_offset = 9;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.image = document.getElementById('water_tile');
        this.content_image = null;
    }
    
    // Calculate the game coordinates from the tile's array position
    set_tile_position(canvas_position) {  
        this.x = canvas_position[0];
        this.y = canvas_position[1];
    }

    set_tile_type(type) {
        if (type < global_images.length) {
            if (global_images[type][1]) {
                this.content_image = global_images[type][0];
            }
            else {
                this.image = global_images[type][0];
                this.content_image = null;
            }
        }
        else
            this.image = document.getElementById('water_tile');
    }

    draw(context, scale) {
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, GameTile.width * scale, GameTile.height * scale);
        
        if (this.content_image)
            context.drawImage(this.content_image, 0, 0, this.content_image.width, this.content_image.height, this.x, this.y, GameTile.width * scale, GameTile.height * scale);
    }

}