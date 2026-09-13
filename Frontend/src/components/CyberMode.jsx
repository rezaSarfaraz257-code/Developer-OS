import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

function CyberOcean() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let last = 0;
    let time = 0;

    const particles = [];
    const stars = [];
    const nodes = [];
    const packets = [];
    const streams = [];
    const shards = [];

    const mouse = {
      x: 0,
      y: 0,
      active: false,
    };

    // ------------------------------------------------------------
    // Utilities
    // ------------------------------------------------------------

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    const glow = (color, blur) => {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
    };

    const clearGlow = () => {
      ctx.shadowBlur = 0;
    };

    // ------------------------------------------------------------
    // Resize
    // ------------------------------------------------------------

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildScene();
    }

    // ------------------------------------------------------------
    // Scene
    // ------------------------------------------------------------

    function buildScene() {
      particles.length = 0;
      stars.length = 0;
      nodes.length = 0;
      packets.length = 0;
      streams.length = 0;
      shards.length = 0;

      const area = width * height;

      const particleCount = clamp(
        Math.floor(area / 7000),
        130,
        420
      );

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: random(-1, 1),
          y: random(-1, 1),
          z: random(0.03, 1),
          speed: random(0.00025, 0.0012),
          size: random(0.5, 1.8),
          alpha: random(0.15, 0.8),
          cyan: Math.random() > 0.12,
        });
      }

      const starCount = clamp(
        Math.floor(area / 5000),
        100,
        220
      );

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          size: random(0.3, 1.4),
          alpha: random(0.15, 0.7),
          twinkle: random(0.001, 0.004),
        });
      }

      const nodeCount = width < 700 ? 24 : 55;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          angle: random(0, TAU),
          radius: random(0.38, 0.9),
          height: random(-0.4, 0.4),
          speed: random(-0.0004, 0.0004),
          pulse: random(0, TAU),
          size: random(2, 4.5),
        });
      }

      for (let i = 0; i < 24; i++) {
        packets.push({
          angle: random(0, TAU),
          radius: random(0.3, 1),
          progress: Math.random(),
          speed: random(0.0003, 0.001),
          lane: Math.floor(random(0, 4)),
        });
      }

      const streamCount = width < 700 ? 14 : 38;

      for (let i = 0; i < streamCount; i++) {
        streams.push({
          x: random(0, 1),
          y: random(-1, 1),
          speed: random(0.002, 0.007),
          length: random(30, 130),
          alpha: random(0.15, 0.55),
        });
      }

      for (let i = 0; i < 45; i++) {
        shards.push({
          angle: random(0, TAU),
          distance: random(180, 650),
          speed: random(0.0003, 0.001),
          size: random(3, 16),
          alpha: random(0.2, 0.8),
        });
      }
    }

    // ------------------------------------------------------------
    // Projection
    // ------------------------------------------------------------

    function project(x, y, z) {
      const focal = Math.min(width, height) * 0.72;

      const depth = Math.max(0.05, z);

      return {
        x: width / 2 + x * focal / depth,
        y: height * 0.48 + y * focal / depth,
        scale: 1 / depth,
      };
    }

    // ------------------------------------------------------------
    // Background
    // ------------------------------------------------------------

    function drawBackground() {
      const bg = ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );

      bg.addColorStop(0, "#000207");
      bg.addColorStop(0.35, "#010914");
      bg.addColorStop(0.55, "#001222");
      bg.addColorStop(0.78, "#010914");
      bg.addColorStop(1, "#000104");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const center = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        0,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.65
      );

      center.addColorStop(0, "rgba(0,180,255,.12)");
      center.addColorStop(0.25, "rgba(0,120,255,.055)");
      center.addColorStop(0.6, "rgba(0,40,100,.025)");
      center.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = center;
      ctx.fillRect(0, 0, width, height);

      const violet = ctx.createRadialGradient(
        width * 0.82,
        height * 0.22,
        0,
        width * 0.82,
        height * 0.22,
        width * 0.5
      );

      violet.addColorStop(
        0,
        "rgba(120,40,255,.08)"
      );

      violet.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = violet;
      ctx.fillRect(0, 0, width, height);
    }

    // ------------------------------------------------------------
    // Stars
    // ------------------------------------------------------------

    function drawStars() {
      for (const star of stars) {
        const pulse =
          star.alpha +
          Math.sin(time * star.twinkle + star.x * 20) *
            0.15;

        ctx.fillStyle = `rgba(80,190,255,${clamp(
          pulse,
          0.05,
          0.8
        )})`;

        ctx.beginPath();

        ctx.arc(
          star.x * width,
          star.y * height,
          star.size,
          0,
          TAU
        );

        ctx.fill();
      }
    }

    // ------------------------------------------------------------
    // Perspective Grid
    // ------------------------------------------------------------

    function drawPerspectiveGrid() {
      const horizon = height * 0.53;

      ctx.save();

      ctx.lineWidth = 1;

      // Vertical perspective rays
      for (let i = -18; i <= 18; i++) {
        const bottomX =
          width / 2 + i * width * 0.065;

        ctx.strokeStyle =
          Math.abs(i) % 5 === 0
            ? "rgba(0,180,255,.13)"
            : "rgba(0,120,200,.045)";

        ctx.beginPath();

        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(bottomX, height);

        ctx.stroke();
      }

      // Horizontal depth lines
      for (let i = 0; i < 24; i++) {
        const p = i / 24;
        const y =
          horizon +
          Math.pow(p, 2.15) *
            (height - horizon);

        ctx.strokeStyle =
          i % 5 === 0
            ? "rgba(0,190,255,.13)"
            : "rgba(0,120,200,.045)";

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Digital Streams
    // ------------------------------------------------------------

    function drawStreams(delta) {
      ctx.save();

      ctx.font =
        width < 700
          ? "8px monospace"
          : "10px monospace";

      for (const stream of streams) {
        stream.y +=
          stream.speed * delta * 0.1;

        if (stream.y > 1.15) {
          stream.y = random(-0.4, -0.05);
        }

        const x = stream.x * width;
        const y = stream.y * height;

        for (
          let i = 0;
          i < stream.length;
          i += 12
        ) {
          const alpha =
            stream.alpha *
            (1 - i / stream.length);

          ctx.fillStyle =
            `rgba(0,190,255,${alpha})`;

          const char =
            Math.random() > 0.5
              ? "0"
              : "1";

          ctx.fillText(
            char,
            x,
            y - i
          );
        }
      }

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Globe
    // ------------------------------------------------------------

    function drawGlobe() {
      const cx = width / 2;
      const cy = height * 0.46;

      const radius =
        Math.min(width, height) *
        (width < 700 ? 0.18 : 0.22);

      ctx.save();

      // Atmospheric glow
      const glowGradient = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.2,
        cx,
        cy,
        radius * 1.55
      );

      glowGradient.addColorStop(
        0,
        "rgba(0,210,255,.20)"
      );

      glowGradient.addColorStop(
        0.5,
        "rgba(0,100,255,.08)"
      );

      glowGradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = glowGradient;

      ctx.beginPath();
      ctx.arc(
        cx,
        cy,
        radius * 1.6,
        0,
        TAU
      );
      ctx.fill();

      // Sphere
      ctx.strokeStyle =
        "rgba(0,190,255,.55)";

      ctx.lineWidth = 1.4;

      glow(
        "rgba(0,190,255,.75)",
        12
      );

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        radius,
        0,
        TAU
      );

      ctx.stroke();

      clearGlow();

      // Latitude lines
      for (let i = -5; i <= 5; i++) {
        const lat =
          i * Math.PI / 12;

        const ry =
          Math.sin(
            Math.acos(lat)
          ) * radius;

        const y =
          cy +
          Math.sin(lat) * radius;

        ctx.strokeStyle =
          "rgba(0,160,255,.16)";

        ctx.beginPath();

        ctx.ellipse(
          cx,
          y,
          radius,
          ry * 0.35,
          0,
          0,
          TAU
        );

        ctx.stroke();
      }

      // Longitude lines
      const rotation =
        time * 0.00022;

      for (let i = 0; i < 12; i++) {
        const angle =
          rotation +
          (i / 12) * TAU;

        const scale =
          Math.abs(Math.cos(angle));

        ctx.strokeStyle =
          "rgba(0,190,255,.18)";

        ctx.beginPath();

        ctx.ellipse(
          cx,
          cy,
          radius * scale,
          radius,
          0,
          0,
          TAU
        );

        ctx.stroke();
      }

      // Digital world points
      for (let i = 0; i < 90; i++) {
        const a =
          (i * 137.5 * Math.PI) / 180;

        const r =
          radius *
          (0.35 + ((i * 17) % 65) / 100);

        const x =
          cx +
          Math.cos(a + rotation) *
            r;

        const y =
          cy +
          Math.sin(a * 1.37) *
            r *
            0.55;

        if (
          Math.hypot(x - cx, y - cy) <
          radius
        ) {
          ctx.fillStyle =
            i % 7 === 0
              ? "rgba(170,80,255,.9)"
              : "rgba(0,210,255,.65)";

          ctx.fillRect(
            x,
            y,
            1.5,
            1.5
          );
        }
      }

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Reactor Rings
    // ------------------------------------------------------------

    function drawReactor() {
      const cx = width / 2;
      const cy = height * 0.52;

      const base =
        Math.min(width, height) *
        0.28;

      ctx.save();

      for (let i = 0; i < 9; i++) {
        const radius =
          base *
          (0.25 + i * 0.09);

        const rotation =
          time *
            (0.00025 + i * 0.00004) *
            (i % 2 ? 1 : -1);

        ctx.save();

        ctx.translate(cx, cy);
        ctx.rotate(rotation);

        ctx.scale(1, 0.32);

        ctx.strokeStyle =
          i % 3 === 0
            ? "rgba(140,50,255,.48)"
            : "rgba(0,190,255,.48)";

        ctx.lineWidth =
          i % 3 === 0 ? 1.3 : 0.8;

        ctx.setLineDash([
          8 + i * 2,
          12 + i
        ]);

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          radius,
          0,
          TAU
        );

        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Network Nodes
    // ------------------------------------------------------------

    function drawNetwork(delta) {
      const cx = width / 2;
      const cy = height * 0.46;

      const scale =
        Math.min(width, height);

      const points = [];

      for (const node of nodes) {
        node.angle +=
          node.speed * delta;

        const distance =
          node.radius * scale * 0.42;

        const x =
          cx +
          Math.cos(node.angle) *
            distance;

        const y =
          cy +
          Math.sin(node.angle * 1.7) *
            distance *
            0.55 +
          node.height * scale * 0.25;

        points.push({
          x,
          y,
          node,
        });
      }

      // Connections
      for (let i = 0; i < points.length; i++) {
        for (
          let j = i + 1;
          j < points.length;
          j++
        ) {
          const a = points[i];
          const b = points[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;

          const distance =
            Math.sqrt(dx * dx + dy * dy);

          if (distance > scale * 0.23)
            continue;

          ctx.strokeStyle =
            `rgba(0,150,255,${clamp(
              0.22 -
                distance / scale * 0.35,
              0.025,
              0.18
            )})`;

          ctx.lineWidth = 0.7;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const point of points) {
        const pulse =
          1 +
          Math.sin(
            time * 0.003 +
              point.node.pulse
          ) *
            0.45;

        ctx.fillStyle =
          "rgba(0,210,255,.9)";

        glow(
          "rgba(0,190,255,.9)",
          10
        );

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          point.node.size * pulse,
          0,
          TAU
        );

        ctx.fill();

        clearGlow();
      }
    }

    // ------------------------------------------------------------
    // Data Packets
    // ------------------------------------------------------------

    function drawPackets(delta) {
      const cx = width / 2;
      const cy = height * 0.46;

      const scale =
        Math.min(width, height);

      for (const packet of packets) {
        packet.progress +=
          packet.speed * delta;

        if (packet.progress > 1) {
          packet.progress = 0;
          packet.angle =
            random(0, TAU);
        }

        const angle =
          packet.angle +
          packet.progress * TAU;

        const radius =
          packet.radius *
          scale *
          0.35;

        const x =
          cx +
          Math.cos(angle) * radius;

        const y =
          cy +
          Math.sin(angle * 1.8) *
            radius *
            0.48;

        ctx.fillStyle =
          packet.lane % 3 === 0
            ? "#8b5cff"
            : "#00d9ff";

        glow(
          packet.lane % 3 === 0
            ? "rgba(130,70,255,.9)"
            : "rgba(0,220,255,.9)",
          10
        );

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          2.2,
          0,
          TAU
        );

        ctx.fill();

        clearGlow();
      }
    }

    // ------------------------------------------------------------
    // Energy Beams
    // ------------------------------------------------------------

    function drawBeams() {
      const cx = width / 2;
      const cy = height * 0.46;

      const max =
        Math.max(width, height) *
        0.75;

      ctx.save();

      for (let i = 0; i < 18; i++) {
        const angle =
          (i / 18) * TAU +
          time * 0.00008;

        const inner =
          Math.min(width, height) *
          0.2;

        const x1 =
          cx +
          Math.cos(angle) * inner;

        const y1 =
          cy +
          Math.sin(angle) * inner;

        const x2 =
          cx +
          Math.cos(angle) * max;

        const y2 =
          cy +
          Math.sin(angle) * max;

        const gradient =
          ctx.createLinearGradient(
            x1,
            y1,
            x2,
            y2
          );

        gradient.addColorStop(
          0,
          "rgba(0,220,255,.16)"
        );

        gradient.addColorStop(
          0.4,
          "rgba(0,130,255,.06)"
        );

        gradient.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Shards / Flying Data
    // ------------------------------------------------------------

    function drawShards(delta) {
      const cx = width / 2;
      const cy = height * 0.46;

      for (const shard of shards) {
        shard.angle +=
          shard.speed * delta;

        const distance =
          shard.distance +
          Math.sin(
            time * 0.001 +
              shard.angle
          ) *
            30;

        const x =
          cx +
          Math.cos(shard.angle) *
            distance;

        const y =
          cy +
          Math.sin(shard.angle) *
            distance *
            0.5;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(shard.angle);

        ctx.fillStyle =
          `rgba(0,190,255,${shard.alpha})`;

        ctx.fillRect(
          0,
          0,
          shard.size,
          1
        );

        ctx.restore();
      }
    }

    // ------------------------------------------------------------
    // Command Core
    // ------------------------------------------------------------

    function drawCore() {
      const cx = width / 2;
      const cy = height * 0.46;

      const radius =
        Math.min(width, height) *
        0.085;

      ctx.save();

      const coreGlow =
        ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          radius * 3
        );

      coreGlow.addColorStop(
        0,
        "rgba(0,220,255,.34)"
      );

      coreGlow.addColorStop(
        0.3,
        "rgba(0,140,255,.14)"
      );

      coreGlow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = coreGlow;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        radius * 3,
        0,
        TAU
      );

      ctx.fill();

      // Core
      const body =
        ctx.createRadialGradient(
          cx - radius * 0.3,
          cy - radius * 0.3,
          0,
          cx,
          cy,
          radius
        );

      body.addColorStop(
        0,
        "rgba(120,245,255,.95)"
      );

      body.addColorStop(
        0.3,
        "rgba(0,150,255,.8)"
      );

      body.addColorStop(
        0.72,
        "rgba(0,35,80,.9)"
      );

      body.addColorStop(
        1,
        "rgba(0,5,18,1)"
      );

      ctx.fillStyle = body;

      glow(
        "rgba(0,210,255,.9)",
        20
      );

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        radius,
        0,
        TAU
      );

      ctx.fill();

      clearGlow();

      // Reactor frame
      for (let i = 0; i < 5; i++) {
        ctx.save();

        ctx.translate(cx, cy);

        ctx.rotate(
          time *
            0.0004 *
            (i % 2 ? 1 : -1)
        );

        ctx.strokeStyle =
          i % 2
            ? "rgba(130,70,255,.8)"
            : "rgba(0,220,255,.85)";

        ctx.lineWidth = 1.5;

        ctx.setLineDash([
          5 + i * 2,
          8 + i
        ]);

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          radius *
            (1.25 + i * 0.18),
          0,
          TAU
        );

        ctx.stroke();

        ctx.restore();
      }

      // Crosshair
      ctx.strokeStyle =
        "rgba(0,220,255,.55)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(
        cx - radius * 1.9,
        cy
      );

      ctx.lineTo(
        cx - radius * 1.2,
        cy
      );

      ctx.moveTo(
        cx + radius * 1.2,
        cy
      );

      ctx.lineTo(
        cx + radius * 1.9,
        cy
      );

      ctx.moveTo(
        cx,
        cy - radius * 1.9
      );

      ctx.lineTo(
        cx,
        cy - radius * 1.2
      );

      ctx.moveTo(
        cx,
        cy + radius * 1.2
      );

      ctx.lineTo(
        cx,
        cy + radius * 1.9
      );

      ctx.stroke();

      ctx.restore();
    }

    // ------------------------------------------------------------
    // HUD
    // ------------------------------------------------------------

    function drawHUD() {
      ctx.save();

      const font =
        width < 700
          ? "9px monospace"
          : "11px monospace";

      ctx.font = font;

      ctx.fillStyle =
        "rgba(0,205,255,.72)";

      ctx.textAlign = "left";

      ctx.fillText(
        "◈ DEVELOPER OS // COMMAND CENTER",
        24,
        28
      );

      ctx.fillStyle =
        "rgba(0,150,255,.38)";

      ctx.fillText(
        "SYSTEM ONLINE",
        24,
        47
      );

      ctx.textAlign = "right";

      ctx.fillStyle =
        "rgba(0,205,255,.7)";

      ctx.fillText(
        "SECURE CHANNEL",
        width - 24,
        28
      );

      ctx.fillStyle =
        "rgba(0,150,255,.38)";

      ctx.fillText(
        "ENCRYPTED // SYNCED",
        width - 24,
        47
      );

      // Core label
      const cx = width / 2;
      const cy = height * 0.46;

      ctx.textAlign = "center";

      ctx.fillStyle =
        "rgba(180,245,255,.95)";

      ctx.font =
        width < 700
          ? "bold 13px monospace"
          : "bold 18px monospace";

      ctx.fillText(
        "DEVELOPER OS",
        cx,
        cy + Math.min(width, height) * 0.13
      );

      ctx.fillStyle =
        "rgba(0,210,255,.65)";

      ctx.font =
        width < 700
          ? "8px monospace"
          : "10px monospace";

      ctx.fillText(
        "BUILD • CREATE • SCALE",
        cx,
        cy + Math.min(width, height) * 0.155
      );

      // Bottom status
      ctx.textAlign = "center";

      ctx.fillStyle =
        "rgba(0,210,255,.6)";

      ctx.fillText(
        "◉ SCANNING NETWORK  //  ALL SYSTEMS OPERATIONAL",
        width / 2,
        height - 22
      );

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Side HUD Decorations
    // ------------------------------------------------------------

    function drawPanels() {
      if (width < 900) return;

      ctx.save();

      const panelColor =
        "rgba(0,180,255,.25)";

      const textColor =
        "rgba(100,210,255,.65)";

      // Left panel
      ctx.strokeStyle = panelColor;
      ctx.lineWidth = 1;

      ctx.strokeRect(
        18,
        76,
        250,
        150
      );

      ctx.fillStyle = textColor;
      ctx.font = "10px monospace";

      ctx.fillText(
        "REAL-TIME SYSTEM MONITOR",
        30,
        96
      );

      ctx.fillText(
        "CPU       28%",
        30,
        124
      );

      ctx.fillText(
        "MEMORY    46%",
        30,
        145
      );

      ctx.fillText(
        "NETWORK   12.4 MB/s",
        30,
        166
      );

      ctx.fillText(
        "SECURITY  SECURE",
        30,
        187
      );

      ctx.fillStyle =
        "rgba(0,220,255,.15)";

      ctx.fillRect(
        30,
        200,
        210,
        5
      );

      ctx.fillStyle =
        "rgba(0,220,255,.7)";

      ctx.fillRect(
        30,
        200,
        155,
        5
      );

      // Right panel
      ctx.strokeStyle = panelColor;

      ctx.strokeRect(
        width - 268,
        76,
        250,
        150
      );

      ctx.fillStyle = textColor;

      ctx.fillText(
        "LIVE COMMAND STREAM",
        width - 256,
        96
      );

      ctx.fillStyle =
        "rgba(0,230,255,.65)";

      ctx.fillText(
        "> system.init()",
        width - 256,
        120
      );

      ctx.fillText(
        "> network.sync()",
        width - 256,
        140
      );

      ctx.fillText(
        "> security.scan()",
        width - 256,
        160
      );

      ctx.fillText(
        "> projects.load()",
        width - 256,
        180
      );

      ctx.fillStyle =
        "rgba(130,80,255,.65)";

      ctx.fillText(
        "> developer_os.ready()",
        width - 256,
        205
      );

      ctx.restore();
    }

    // ------------------------------------------------------------
    // Scanline
    // ------------------------------------------------------------

    function drawScanline() {
      const y =
        (time * 0.07) %
        height;

      const gradient =
        ctx.createLinearGradient(
          0,
          y - 30,
          0,
          y + 30
        );

      gradient.addColorStop(
        0,
        "rgba(0,210,255,0)"
      );

      gradient.addColorStop(
        0.5,
        "rgba(0,210,255,.055)"
      );

      gradient.addColorStop(
        1,
        "rgba(0,210,255,0)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        y - 30,
        width,
        60
      );
    }

    // ------------------------------------------------------------
    // Vignette
    // ------------------------------------------------------------

    function drawVignette() {
      const gradient =
        ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.25,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.72
        );

      gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      gradient.addColorStop(
        0.7,
        "rgba(0,0,0,.18)"
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,.72)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    // ------------------------------------------------------------
    // Particles
    // ------------------------------------------------------------

    function drawParticles(delta) {
      for (const particle of particles) {
        particle.z -=
          particle.speed * delta;

        if (particle.z < 0.03) {
          particle.z = 1;
          particle.x = random(-1, 1);
          particle.y = random(-1, 1);
        }

        const point =
          project(
            particle.x,
            particle.y,
            particle.z
          );

        if (
          point.x < -50 ||
          point.x > width + 50 ||
          point.y < -50 ||
          point.y > height + 50
        ) {
          continue;
        }

        const size =
          particle.size *
          (1 / particle.z) *
          0.7;

        const alpha =
          particle.alpha *
          (1 - particle.z);

        ctx.fillStyle = particle.cyan
          ? `rgba(0,210,255,${alpha})`
          : `rgba(130,80,255,${alpha})`;

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          Math.min(size, 4),
          0,
          TAU
        );

        ctx.fill();
      }
    }

    // ------------------------------------------------------------
    // Main Render
    // ------------------------------------------------------------

    function render(timestamp) {
      const delta =
        last
          ? Math.min(timestamp - last, 40)
          : 16;

      last = timestamp;
      time += delta;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      drawBackground();
      drawStars();
      drawPerspectiveGrid();
      drawBeams();
      drawStreams(delta);
      drawParticles(delta);
      drawNetwork(delta);
      drawPackets(delta);
      drawShards(delta);
      drawGlobe();
      drawReactor();
      drawCore();
      drawPanels();
      drawHUD();
      drawScanline();
      drawVignette();

      animationId =
        requestAnimationFrame(render);
    }

    // ------------------------------------------------------------
    // Mouse interaction
    // ------------------------------------------------------------

    function onPointerMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function onPointerLeave() {
      mouse.active = false;
    }

    // ------------------------------------------------------------
    // Visibility optimization
    // ------------------------------------------------------------

    function onVisibilityChange() {
      if (
        document.hidden &&
        animationId
      ) {
        cancelAnimationFrame(
          animationId
        );

        animationId = 0;
      } else if (
        !document.hidden &&
        !animationId
      ) {
        last = 0;
        animationId =
          requestAnimationFrame(render);
      }
    }

    // ------------------------------------------------------------
    // Start
    // ------------------------------------------------------------

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "pointermove",
      onPointerMove,
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      onPointerLeave,
      { passive: true }
    );

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    animationId =
      requestAnimationFrame(render);

    // ------------------------------------------------------------
    // Cleanup
    // ------------------------------------------------------------

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        onPointerMove
      );

      window.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cyber-ocean"
      aria-hidden="true"
    />
  );
}

export default CyberOcean;
