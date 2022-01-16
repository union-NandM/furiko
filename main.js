(() => {
  function resizeCanvas(canvas, container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  // 丸を描く関数
  function drawCircle(ctx, centerX, centerY, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  // 振り子の糸を描く関数
  function drawLine(ctx, fromX, fromY, toX, toY, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  // 画面を初期化する関数
  function resetCanvas(canvas, ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const container = document.getElementById("container");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // 色
  const colors = {
    black: "#000000",
    white: "#ffffff",
  };

  // 糸
  const rope = {
    length: 400,
    width: 1,
    angle_0: Math.PI / 12,
    color: colors.white,

    // 糸の角度を経過時間tから求める関数
    angle(t) {
      return this.angle_0 * Math.cos(t);
    },

    // 描画関数
    draw(t) {
      drawLine(ctx, pin.x, pin.y, ball.x(t), ball.y(t), this.width, this.color);
    },
  };

  // 振り子の運動の中心のピン
  const pin = {
    x: 250,
    y: 30,
    radius: 10,
    color: colors.white,

    // 描画関数
    draw() {
      drawCircle(ctx, this.x, this.y, this.radius, this.color);
    },
  };

  // 振り子の玉
  const ball = {
    radius: 30,
    color: colors.white,

    // 経過時間tを使って糸の角度と糸の長さから玉のx座標を取得
    x(t) {
      return pin.x + rope.length * Math.sin(rope.angle(t));
    },

    // 経過時間tを使って糸の角度と糸の長さから玉のy座標を取得
    y(t) {
      return pin.y + rope.length * Math.cos(rope.angle(t));
    },

    // 描画関数
    draw(t) {
      drawCircle(ctx, this.x(t), this.y(t), this.radius, this.color);
    },
  };

  // キャンバスをリサイズ
  resizeCanvas(canvas, container);

  // 実行
  let t = 0;
  const fps = 50;
  setInterval(() => {
    resetCanvas(canvas, ctx, colors.black);
    rope.draw((t * Math.PI) / 100);
    pin.draw();
    ball.draw((t * Math.PI) / 100);
    if (t >= 200) {
      t = 0;
    }
    t++;
  }, 1000 / fps);
})();
