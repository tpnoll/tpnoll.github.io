class GameTile {
    static width = 28;
    static height = 32;
    static height_offset = 9;

    constructor(gameWidth, gameHeight, x, y) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('water_tile');
    }

    // Calculate the game coordinates from the tile's array position
    set_tile_position(x, y, scale) {
        if (y % 2 == 0)
            x = x + 0.5
        
        this.x = x * GameTile.width * scale;
        this.y = y * (GameTile.height - GameTile.height_offset) * scale;
    }

    set_tile_type(type) {
        switch (type) {
            case 0:
                this.image = document.getElementById('water_tile');
                break;
            case 1:
                this.image = document.getElementById('grass_tile');
                break;
            default:
                this.image = document.getElementById('grass_tile');
        }
    }

    draw(context, scale) {
        context.fillstyle = 'white';
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, GameTile.width * scale, GameTile.height * scale);
    }

}