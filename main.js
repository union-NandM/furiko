(() => {
    function drawCircle(ctx, centerX, centerY, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawLine(ctx, fromX, fromY, toX, toY, width, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
    
    function resetCanvas(canvas, ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const colors = {
        black: '#000000',
        white: '#ffffff',
    };

    const rope = {
        length: 400,
        width: 1,
        angle_0: Math.PI / 12,
        color: colors.white,

        angle(t) {
            return this.angle_0 * Math.cos(t);
        },

        draw(t) {
            drawLine(
                ctx,
                pin.x,
                pin.y,
                ball.x(t),
                ball.y(t),
                this.width,
                this.color
                );
        
        },
    };

    const pin = {
        x: 250,
        y: 30,
        radius: 10,
        color: colors.white,

        draw() {
            drawCircle(
                ctx,
                this.x,
                this.y,
                this.radius, 
                this.color
                );
        },
    };

    const ball = {
        radius: 30,
        color: colors.white,

        x(t) {
            return pin.x + rope.length * Math.sin(rope.angle(t));
        },

        y(t) {
            return pin.y + rope.length * Math.cos(rope.angle(t));
        },

        draw(t) {
            drawCircle(
                ctx,
                this.x(t),
                this.y(t),
                this.radius,
                this.color
                );
        },
    };

    let t = 0;
    const fps = 50;
    setInterval(() => {
        resetCanvas(canvas, ctx, colors.black);
        rope.draw(t * Math.PI / 100)
        pin.draw();
        ball.draw(t * Math.PI / 100);
        if(t >= 200) {
            t = 0;
        }
        t++;
    }, 1000 / fps);

})();


