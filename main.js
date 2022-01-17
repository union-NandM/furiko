(() => {
  // 連想配列でmapを回す関数
  const objMap = (func) => (obj) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));

  // 糸
  class Rope {
    constructor({ length, width }, color, angle = Math.PI / 12) {
      this.length = length;
      this.width = width;
      this.angle_0 = angle;
      this.color = color;
    }

    // 糸の角度を進行状況progから求める関数
    angle = (prog) => {
      return this.angle_0 * Math.cos(prog);
    };
  }

  // 振り子の運動の中心のピン
  class Pin {
    constructor({ x, y, radius }, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }
  }

  // 振り子の玉
  class Ball {
    constructor({ radius }, color) {
      this.radius = radius;
      this.color = color;
    }

    // 進行状況progを使って糸の角度と糸の長さから玉のx座標を取得
    x = (prog, rope, pin) => {
      return pin.x + rope.length * Math.sin(rope.angle(prog));
    };

    // 進行状況progを使って糸の角度と糸の長さから玉のy座標を取得
    y = (prog, rope, pin) => {
      return pin.y + rope.length * Math.cos(rope.angle(prog));
    };
  }

  // 描画されるもの全体のクラス
  class View {
    // 色
    static colors = {
      backGround: "#000000",
      item: "#ffffff",
    };

    // 振り子の振れる速さ
    static speed = Math.PI / 100;

    // 描画されるオブジェクトの相対的なサイズ
    static rel_parts_size = {
      rope: {
        length: 400,
        width: 1,
      },
      pin: {
        x: 250,
        y: 30,
        radius: 10,
      },
      ball: {
        radius: 30,
      },
    };

    // コンストラクタ
    constructor() {
      // 要素の取得
      this.container = document.getElementById("container");
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

      // レスポンシブ対応
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
      this.size = this.container.clientWidth;

      // オブジェクトの生成
      const abs_parts_size = objMap(objMap(View.setAbsoluteSize(this.size)))(
        View.rel_parts_size
      );
      this.rope = new Rope(abs_parts_size.rope, View.colors.item);
      this.pin = new Pin(abs_parts_size.pin, View.colors.item);
      this.ball = new Ball(abs_parts_size.ball, View.colors.item);

      // アニメーションの設定
      this.t = 0;
      this.fps = 50;
    }

    // 相対的なサイズを絶対的なサイズに
    static setAbsoluteSize = (viewSize) => (size) => {
      const DEFAULT_VIEW_SIZE = 500;
      return (viewSize / DEFAULT_VIEW_SIZE) * size;
    };

    // 画面を初期化
    resetCanvas = () => {
      this.ctx.fillStyle = View.colors.backGround;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    // 丸の描画
    drawCircle = (centerX, centerY, radius, color) => {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fill();
    };

    // 線の描画
    drawLine = (fromX, fromY, toX, toY, width, color) => {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.lineCap = "butt";
      this.ctx.beginPath();
      this.ctx.moveTo(fromX, fromY);
      this.ctx.lineTo(toX, toY);
      this.ctx.stroke();
    };

    // 糸の描画
    drawRope = () => {
      this.drawLine(
        this.pin.x,
        this.pin.y,
        this.ball.x(this.prog(), this.rope, this.pin),
        this.ball.y(this.prog(), this.rope, this.pin),
        this.rope.width,
        this.rope.color
      );
    };

    // ピンの描画
    drawPin = () => {
      this.drawCircle(this.pin.x, this.pin.y, this.pin.radius, this.pin.color);
    };

    // 玉の描画
    drawBall = () => {
      this.drawCircle(
        this.ball.x(this.prog(), this.rope, this.pin),
        this.ball.y(this.prog(), this.rope, this.pin),
        this.ball.radius,
        this.ball.color
      );
    };

    // 画面全体の描画
    drawAll = () => {
      this.resetCanvas();
      this.drawRope();
      this.drawPin();
      this.drawBall();
    };

    // tの更新
    update_t = () => {
      if (this.t >= 200) {
        this.t = 0;
      }
      this.t++;
    };

    // 進行状態
    prog = () => this.t * View.speed;

    // 開始関数
    start = () => {
      setInterval(() => {
        this.drawAll();
        this.update_t();
      }, 1000 / this.fps);
    };
  }

  // 実行
  const view = new View();
  view.start();
})();
