/*
Parent Class
*/

class Scene {
    constructor(canvas_name, canvas_size) {
        this.canvas = document.getElementById(canvas_name);
        this.canvas.width = canvas_size[0];
        this.canvas.height = canvas_size[1];
        
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler(this.canvas); 

    }
}