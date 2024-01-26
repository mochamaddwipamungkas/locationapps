import React, { useState, useEffect } from "react";

function Bola(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [line, setLine] = useState({
    start: { x: 0, y: 0 },
    end: { x: 400, y: 400 },
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      // Hitung posisi bola berikutnya
      const nextX = x + speed;
      const nextY =
        y + (speed * (line.end.y - line.start.y)) / (line.end.x - line.start.x);

      // Periksa apakah bola sudah keluar dari garis
      if (nextX > line.end.x) {
        nextX = line.start.x;
        nextY =
          line.start.y +
          (speed * (line.end.y - line.start.y)) / (line.end.x - line.start.x);
      } else if (nextX < line.start.x) {
        nextX = line.end.x;
        nextY =
          line.end.y +
          (speed * (line.end.y - line.start.y)) / (line.end.x - line.start.x);
      }

      // Pindahkan bola ke posisi berikutnya
      setX(nextX);
      setY(nextY);

      // Render bola
      renderBola();
    });
  }, [x, y, speed, line]);

  const renderBola = () => {
    // Gambar bola
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 100, 100);
  };

  return (
    <div>
      <canvas id="canvas" width="400" height="400"></canvas>
    </div>
  );
}

const App = () => {
  const [line, setLine] = useState({
    start: { x: 0, y: 0 },
    end: { x: 400, y: 400 },
  });

  return (
    <div>
      <Bola line={line} />
    </div>
  );
};

export default App;
