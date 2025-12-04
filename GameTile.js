class GameTile {
    constructor(gameWidth, gameHeight, x, y) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 108;
        this.height = 128;
        this.height_offset = 31; 
        this.scale = 0.5;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('grass_tile');
    }

    // Calculate the game coordinates from the tile's array position
    set_tile_position(x, y) {
        if (y % 2 == 0)
            x = x + 0.5
        
        this.x = x * this.width * this.scale;
        this.y = y * (this.height - this.height_offset) * this.scale;
    }

    draw(context) {
        context.fillstyle = 'white';
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width * this.scale, this.height * this.scale);
    }

}