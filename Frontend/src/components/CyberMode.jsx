import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const BITS = ["0", "1"];

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
    let time = 0;

    const particles = [];
    const nodes = [];
    const connections = [];
    const dataPackets = [];
    const rings = [];
    const stars = [];

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    const distance = (a, b) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    /*
     * =====================================================
     * PARTICLES
     * =====================================================
     */

    function createParticle(initial = false) {
      return {
        x: random(-1.5, 1.5),
        y: random(-1, 1),
        z: initial ? random(0.04, 1) : 1,
        speed: random(0.0012, 0.0045),
        size: random(0.7, 2),
        alpha: random(0.25, 0.9),
        phase: random(0, TAU),
        cyan: Math.random() > 0.25,
      };
    }

    /*
     * =====================================================
     * NEURAL NODES
     * =====================================================
     */

    function createNode() {
      const angle = random(0, TAU);
      const radius = random(0.18, 1.15);

      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.62,
        z: random(0.3, 1),
        size: random(1.2, 3),
        phase: random(0, TAU),
        pulse: random(0, 1),
      };
    }

    /*
     * =====================================================
     * ENERGY RINGS
     * =====================================================
     */

    function createRing(index) {
      return {
        radius: 0.12 + index * 0.09,
        rotation: random(0, TAU),
        speed: random(-0.0015, 0.0015),
        tilt: random(-0.35, 0.35),
        alpha: random(0.08, 0.2),
      };
    }

    /*
     * =====================================================
     * STAR FIELD
     * =====================================================
     */

    function createStar() {
      return {
        x: random(0, 1),
        y: random(0, 0.72),
        size: random(0.4, 1.4),
        alpha: random(0.15, 0.7),
        phase: random(0, TAU),
      };
    }

    /*
     * =====================================================
     * SCENE
     * =====================================================
     */

    function rebuildScene() {
      particles.length = 0;
      nodes.length = 0;
      connections.length = 0;
      dataPackets.length = 0;
      rings.length = 0;
      stars.length = 0;

      const particleCount = Math.min(
        380,
        Math.max(
          170,
          Math.floor((width * height) / 5600),
        ),
      );

      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
      }

      for (let i = 0; i < 46; i++) {
        nodes.push(createNode());
      }

      /*
       * Connect nearby neural nodes.
       */

      for (let i = 0; i < nodes.length; i++) {
        for (
          let j = i + 1;
          j < nodes.length;
          j++
        ) {
          const a = nodes[i];
          const b = nodes[j];

          if (
            distance(a, b) < 0.42 &&
            Math.random() > 0.35
          ) {
            connections.push({
              a,
              b,
              pulse: random(0, 1),
              speed: random(0.002, 0.006),
            });
          }
        }
      }

      /*
       * Data packets.
       * Only create them when connections exist.
       */

      if (connections.length > 0) {
        for (let i = 0; i < 8; i++) {
          dataPackets.push({
            path:
              connections[
                Math.floor(
                  Math.random() *
                    connections.length,
                )
              ],
            progress: random(0, 1),
            speed: random(0.002, 0.006),
          });
        }
      }

      for (let i = 0; i < 8; i++) {
        rings.push(createRing(i));
      }

      for (let i = 0; i < 90; i++) {
        stars.push(createStar());
      }
    }

    /*
     * =====================================================
     * RESIZE
     * =====================================================
     */

    function resize() {
      dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5,
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(
        width * dpr,
      );

      canvas.height = Math.floor(
        height * dpr,
      );

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

      rebuildScene();
    }

    /*
     * =====================================================
     * PROJECTION
     * =====================================================
     */

    function project(x, y, z) {
      const safeZ = Math.max(z, 0.045);

      const focal =
        Math.min(width, height) * 0.72;

      return {
        x:
          width / 2 +
          (x / safeZ) * focal,

        y:
          height * 0.47 +
          (y / safeZ) * focal,

        scale: 1 / safeZ,
      };
    }

    /*
     * =====================================================
     * BACKGROUND
     * =====================================================
     */

    function drawBackground() {
      const gradient =
        ctx.createLinearGradient(
          0,
          0,
          0,
          height,
        );

      gradient.addColorStop(
        0,
        "#01040c",
      );

      gradient.addColorStop(
        0.3,
        "#021225",
      );

      gradient.addColorStop(
        0.52,
        "#031d30",
      );

      gradient.addColorStop(
        0.75,
        "#020e1d",
      );

      gradient.addColorStop(
        1,
        "#010309",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      /*
       * Cyan core atmosphere
       */

      const cyan =
        ctx.createRadialGradient(
          width * 0.5,
          height * 0.47,
          0,
          width * 0.5,
          height * 0.47,
          Math.max(width, height) * 0.7,
        );

      cyan.addColorStop(
        0,
        "rgba(0,235,255,0.18)",
      );

      cyan.addColorStop(
        0.2,
        "rgba(0,170,255,0.09)",
      );

      cyan.addColorStop(
        0.5,
        "rgba(0,90,220,0.035)",
      );

      cyan.addColorStop(
        1,
        "rgba(0,0,0,0)",
      );

      ctx.fillStyle = cyan;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      /*
       * Violet atmosphere
       */

      const violet =
        ctx.createRadialGradient(
          width * 0.82,
          height * 0.28,
          0,
          width * 0.82,
          height * 0.28,
          width * 0.5,
        );

      violet.addColorStop(
        0,
        "rgba(120,70,255,0.09)",
      );

      violet.addColorStop(
        0.45,
        "rgba(100,50,255,0.025)",
      );

      violet.addColorStop(
        1,
        "rgba(0,0,0,0)",
      );

      ctx.fillStyle = violet;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );
    }

    /*
     * =====================================================
     * STARS
     * =====================================================
     */

    function drawStars() {
      for (const star of stars) {
        const alpha =
          star.alpha +
          Math.sin(
            time * 0.0015 +
              star.phase,
          ) *
            0.15;

        ctx.fillStyle = `rgba(
          120,
          225,
          255,
          ${Math.max(0.03, alpha)}
        )`;

        ctx.beginPath();

        ctx.arc(
          star.x * width,
          star.y * height,
          star.size,
          0,
          TAU,
        );

        ctx.fill();
      }
    }

    /*
     * =====================================================
     * GRID
     * =====================================================
     */

    function drawGrid() {
      const horizon =
        height * 0.47;

      ctx.save();

      /*
       * Vertical lines
       */

      for (let i = -24; i <= 24; i++) {
        const bottom =
          width / 2 +
          i * (width / 19);

        ctx.beginPath();

        ctx.moveTo(
          width / 2,
          horizon,
        );

        ctx.lineTo(
          bottom,
          height * 1.2,
        );

        ctx.strokeStyle =
          i % 6 === 0
            ? "rgba(0,220,255,0.13)"
            : "rgba(60,160,210,0.035)";

        ctx.lineWidth =
          i % 6 === 0 ? 1 : 0.5;

        ctx.stroke();
      }

      /*
       * Horizontal lines
       */

      for (let i = 0; i < 28; i++) {
        const p = i / 27;

        const y =
          horizon +
          Math.pow(p, 2.2) *
            height *
            0.65;

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        ctx.strokeStyle =
          i % 6 === 0
            ? "rgba(0,220,255,0.08)"
            : "rgba(50,140,190,0.03)";

        ctx.stroke();
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * NEURAL NETWORK
     * =====================================================
     */

    function drawNetwork() {
      /*
       * Connections
       */

      for (const connection of connections) {
        const a = project(
          connection.a.x,
          connection.a.y,
          connection.a.z,
        );

        const b = project(
          connection.b.x,
          connection.b.y,
          connection.b.z,
        );

        ctx.beginPath();

        /*
         * Angular connection.
         */

        const midX =
          (a.x + b.x) / 2;

        ctx.moveTo(a.x, a.y);

        ctx.lineTo(
          midX,
          a.y,
        );

        ctx.lineTo(
          midX,
          b.y,
        );

        ctx.lineTo(
          b.x,
          b.y,
        );

        ctx.strokeStyle =
          "rgba(0,210,255,0.09)";

        ctx.lineWidth = 1;

        ctx.stroke();

        /*
         * Moving energy packet
         */

        connection.pulse +=
          connection.speed;

        if (connection.pulse > 1) {
          connection.pulse = 0;
        }

        const p =
          connection.pulse;

        let px;
        let py;

        if (p < 0.33) {
          const t =
            p / 0.33;

          px =
            a.x +
            (midX - a.x) * t;

          py = a.y;
        } else if (p < 0.66) {
          const t =
            (p - 0.33) /
            0.33;

          px = midX;

          py =
            a.y +
            (b.y - a.y) * t;
        } else {
          const t =
            (p - 0.66) /
            0.34;

          px =
            midX +
            (b.x - midX) * t;

          py = b.y;
        }

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          2,
          0,
          TAU,
        );

        ctx.fillStyle =
          "rgba(100,240,255,0.9)";

        ctx.shadowBlur = 14;

        ctx.shadowColor =
          "rgba(0,230,255,0.95)";

        ctx.fill();

        ctx.shadowBlur = 0;
      }

      /*
       * Nodes
       */

      for (const node of nodes) {
        const point = project(
          node.x,
          node.y,
          node.z,
        );

        const pulse =
          1 +
          Math.sin(
            time * 0.002 +
              node.phase,
          ) *
            0.35;

        const size =
          node.size *
          Math.min(
            point.scale,
            5,
          ) *
          pulse;

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          Math.max(1, size),
          0,
          TAU,
        );

        ctx.fillStyle =
          "rgba(82,235,255,0.8)";

        ctx.shadowBlur = 15;

        ctx.shadowColor =
          "rgba(0,220,255,0.9)";

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    /*
     * =====================================================
     * DATA PARTICLES
     * =====================================================
     */

    function drawParticles() {
      for (const particle of particles) {
        particle.z -=
          particle.speed;

        particle.x +=
          Math.sin(
            time * 0.0007 +
              particle.phase,
          ) *
          0.00035;

        if (particle.z < 0.035) {
          Object.assign(
            particle,
            createParticle(false),
          );
        }

        const point = project(
          particle.x,
          particle.y,
          particle.z,
        );

        const depth = Math.min(
          point.scale,
          10,
        );

        const radius = Math.min(
          particle.size *
            (0.5 + depth * 0.13),
          6,
        );

        const alpha = Math.min(
          0.9,
          particle.alpha *
            (0.12 + depth * 0.08),
        );

        /*
         * Trail
         */

        if (depth > 2.5) {
          ctx.beginPath();

          ctx.moveTo(
            point.x,
            point.y,
          );

          ctx.lineTo(
            point.x -
              particle.x * 12,
            point.y -
              particle.y * 12,
          );

          ctx.strokeStyle =
            particle.cyan
              ? `rgba(0,220,255,${
                  alpha * 0.2
                })`
              : `rgba(150,90,255,${
                  alpha * 0.2
                })`;

          ctx.lineWidth = 1;

          ctx.stroke();
        }

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          radius,
          0,
          TAU,
        );

        ctx.fillStyle =
          particle.cyan
            ? `rgba(100,240,255,${alpha})`
            : `rgba(170,120,255,${alpha})`;

        ctx.shadowBlur =
          Math.min(
            20,
            depth * 2,
          );

        ctx.shadowColor =
          particle.cyan
            ? "rgba(0,230,255,0.9)"
            : "rgba(140,80,255,0.9)";

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    /*
     * =====================================================
     * DIGITAL STREAMS
     * =====================================================
     */

    function drawDigitalStreams() {
      ctx.save();

      ctx.font =
        '600 9px "Segoe UI Mono", Consolas, monospace';

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < 34; i++) {
        const baseX =
          ((i * 173) % width) /
          width;

        const phase =
          time * 0.0002 +
          i * 1.7;

        const y =
          (Math.sin(phase) *
            0.5 +
            0.5) *
          height;

        const x =
          baseX * width +
          Math.sin(
            phase * 1.7,
          ) *
            60;

        const length =
          3 + (i % 7);

        for (
          let j = 0;
          j < length;
          j++
        ) {
          const yy =
            y - j * 15;

          if (
            yy < -20 ||
            yy > height + 20
          ) {
            continue;
          }

          const alpha =
            0.035 +
            (1 - j / length) *
              0.11;

          ctx.fillStyle =
            i % 5 === 0
              ? `rgba(170,120,255,${alpha})`
              : `rgba(80,225,255,${alpha})`;

          ctx.fillText(
            BITS[
              (i + j) % 2
            ],
            x +
              Math.sin(
                time * 0.001 +
                  j,
              ) *
                2,
            yy,
          );
        }
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * ENERGY WAVES
     * =====================================================
     */

    function drawEnergyWaves() {
      const cx = width / 2;
      const cy = height * 0.47;

      ctx.save();

      for (let i = 0; i < 5; i++) {
        const cycle =
          (time * 0.00035 +
            i * 0.2) %
          1;

        const radius =
          Math.min(
            width,
            height,
          ) *
          (0.04 +
            cycle * 0.48);

        const alpha =
          (1 - cycle) * 0.16;

        ctx.beginPath();

        ctx.ellipse(
          cx,
          cy,
          radius,
          radius * 0.42,
          0,
          0,
          TAU,
        );

        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(0,230,255,${alpha})`
            : `rgba(139,92,246,${alpha})`;

        ctx.lineWidth =
          i === 0 ? 1.8 : 1;

        ctx.shadowBlur = 20;

        ctx.shadowColor =
          i % 2 === 0
            ? "rgba(0,230,255,0.8)"
            : "rgba(139,92,246,0.8)";

        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * REACTOR RINGS
     * =====================================================
     */

    function drawRings() {
      const cx = width / 2;
      const cy = height * 0.47;

      ctx.save();

      ctx.translate(cx, cy);

      for (
        let i = 0;
        i < rings.length;
        i++
      ) {
        const ring = rings[i];

        ring.rotation +=
          ring.speed;

        const radius =
          Math.min(
            width,
            height,
          ) *
          ring.radius;

        ctx.save();

        ctx.rotate(
          ring.rotation,
        );

        ctx.scale(1, 0.42);

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          radius,
          0,
          TAU,
        );

        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(0,225,255,${ring.alpha})`
            : `rgba(150,90,255,${ring.alpha})`;

        ctx.lineWidth =
          i % 3 === 0
            ? 1.5
            : 0.7;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
          i % 2 === 0
            ? "rgba(0,225,255,0.7)"
            : "rgba(140,80,255,0.7)";

        ctx.stroke();

        /*
         * Segments
         */

        for (
          let s = 0;
          s < 8;
          s++
        ) {
          const start =
            (s / 8) * TAU +
            ring.rotation;

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            radius,
            start,
            start + 0.12,
          );

          ctx.strokeStyle =
            "rgba(110,240,255,0.55)";

          ctx.lineWidth = 2;

          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * ENERGY BEAMS
     * =====================================================
     */

    function drawBeams() {
      const cx = width / 2;
      const cy = height * 0.47;

      ctx.save();

      for (let i = 0; i < 18; i++) {
        const angle =
          (i / 18) * TAU +
          time * 0.00015;

        const length =
          Math.max(
            width,
            height,
          ) *
          (0.18 +
            Math.sin(
              time * 0.001 +
                i,
            ) *
              0.05);

        const x =
          cx +
          Math.cos(angle) *
            length;

        const y =
          cy +
          Math.sin(angle) *
            length *
            0.48;

        const gradient =
          ctx.createLinearGradient(
            cx,
            cy,
            x,
            y,
          );

        gradient.addColorStop(
          0,
          "rgba(80,240,255,0.16)",
        );

        gradient.addColorStop(
          0.35,
          "rgba(0,170,255,0.035)",
        );

        gradient.addColorStop(
          1,
          "rgba(0,0,0,0)",
        );

        ctx.beginPath();

        ctx.moveTo(cx, cy);

        ctx.lineTo(x, y);

        ctx.strokeStyle =
          gradient;

        ctx.lineWidth =
          i % 4 === 0
            ? 1.5
            : 0.5;

        ctx.stroke();
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * CORE
     * =====================================================
     */

    function drawCore() {
      const cx = width / 2;
      const cy = height * 0.47;

      const pulse =
        1 +
        Math.sin(
          time * 0.0024,
        ) *
          0.08;

      const base =
        Math.min(
          width,
          height,
        ) * 0.045;

      /*
       * Massive glow
       */

      const glow =
        ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          base * 7,
        );

      glow.addColorStop(
        0,
        "rgba(180,255,255,0.3)",
      );

      glow.addColorStop(
        0.12,
        "rgba(0,235,255,0.2)",
      );

      glow.addColorStop(
        0.35,
        "rgba(0,150,255,0.08)",
      );

      glow.addColorStop(
        0.7,
        "rgba(100,50,255,0.025)",
      );

      glow.addColorStop(
        1,
        "rgba(0,0,0,0)",
      );

      ctx.fillStyle = glow;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        base * 7,
        0,
        TAU,
      );

      ctx.fill();

      /*
       * Core body
       */

      const core =
        ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          base * pulse,
        );

      core.addColorStop(
        0,
        "rgba(245,255,255,1)",
      );

      core.addColorStop(
        0.16,
        "rgba(100,245,255,1)",
      );

      core.addColorStop(
        0.45,
        "rgba(0,190,255,0.8)",
      );

      core.addColorStop(
        1,
        "rgba(20,80,200,0)",
      );

      ctx.fillStyle = core;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        base * pulse,
        0,
        TAU,
      );

      ctx.shadowBlur = 35;

      ctx.shadowColor =
        "rgba(0,235,255,1)";

      ctx.fill();

      ctx.shadowBlur = 0;

      /*
       * Reactor frame
       */

      ctx.save();

      ctx.translate(cx, cy);

      ctx.rotate(
        time * 0.00035,
      );

      for (let i = 0; i < 3; i++) {
        const radius =
          base *
          (1.8 + i * 0.9);

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          radius,
          i * 1.2,
          Math.PI * 1.35 +
            i * 1.2,
        );

        ctx.strokeStyle =
          i % 2 === 0
            ? "rgba(80,240,255,0.7)"
            : "rgba(160,100,255,0.65)";

        ctx.lineWidth =
          i === 0 ? 2 : 1;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
          i % 2 === 0
            ? "rgba(0,225,255,0.8)"
            : "rgba(150,80,255,0.8)";

        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      /*
       * Reactor crosshair
       */

      ctx.strokeStyle =
        "rgba(130,245,255,0.5)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(
        -base * 2.8,
        0,
      );

      ctx.lineTo(
        base * 2.8,
        0,
      );

      ctx.moveTo(
        0,
        -base * 2.8,
      );

      ctx.lineTo(
        0,
        base * 2.8,
      );

      ctx.stroke();

      ctx.restore();
    }

    /*
     * =====================================================
     * HUD
     * =====================================================
     */

    function drawHUD() {
      const cx = width / 2;
      const cy = height * 0.47;

      ctx.save();

      ctx.font =
        '500 8px "Segoe UI Mono", Consolas, monospace';

      ctx.textAlign = "center";

      const labels = [
        "CORE",
        "SYS",
        "NODE",
        "SYNC",
        "NET",
        "DATA",
      ];

      for (
        let i = 0;
        i < labels.length;
        i++
      ) {
        const angle =
          (i / labels.length) *
            TAU +
          time * 0.00005;

        const radius =
          Math.min(
            width,
            height,
          ) * 0.23;

        const x =
          cx +
          Math.cos(angle) *
            radius;

        const y =
          cy +
          Math.sin(angle) *
            radius *
            0.5;

        ctx.fillStyle =
          "rgba(100,225,255,0.28)";

        ctx.fillText(
          labels[i],
          x,
          y,
        );

        ctx.beginPath();

        ctx.arc(
          x,
          y + 8,
          1.2,
          0,
          TAU,
        );

        ctx.fillStyle =
          "rgba(100,240,255,0.65)";

        ctx.fill();
      }

      ctx.restore();
    }

    /*
     * =====================================================
     * SCAN
     * =====================================================
     */

    function drawScan() {
      const y =
        ((time * 0.045) %
          (height + 160)) -
        80;

      const gradient =
        ctx.createLinearGradient(
          0,
          y - 45,
          0,
          y + 45,
        );

      gradient.addColorStop(
        0,
        "rgba(0,220,255,0)",
      );

      gradient.addColorStop(
        0.5,
        "rgba(0,220,255,0.035)",
      );

      gradient.addColorStop(
        1,
        "rgba(0,220,255,0)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        y - 45,
        width,
        90,
      );
    }

    /*
     * =====================================================
     * VIGNETTE
     * =====================================================
     */

    function drawVignette() {
      const gradient =
        ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(
            width,
            height,
          ) * 0.22,
          width / 2,
          height / 2,
          Math.max(
            width,
            height,
          ) * 0.78,
        );

      gradient.addColorStop(
        0,
        "rgba(0,0,0,0)",
      );

      gradient.addColorStop(
        0.65,
        "rgba(0,0,0,0.05)",
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0.62)",
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height,
      );
    }

    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    function render() {
      time += 16;

      drawBackground();
      drawStars();
      drawGrid();
      drawDigitalStreams();
      drawEnergyWaves();
      drawBeams();
      drawNetwork();
      drawParticles();
      drawRings();
      drawHUD();
      drawCore();
      drawScan();
      drawVignette();

      animationId =
        requestAnimationFrame(
          render,
        );
    }

    /*
     * =====================================================
     * START
     * =====================================================
     */

    resize();
    render();

    window.addEventListener(
      "resize",
      resize,
    );

    const visibilityHandler = () => {
      cancelAnimationFrame(
        animationId,
      );

      if (!document.hidden) {
        animationId =
          requestAnimationFrame(
            render,
          );
      }
    };

    document.addEventListener(
      "visibilitychange",
      visibilityHandler,
    );

    return () => {
      cancelAnimationFrame(
        animationId,
      );

      window.removeEventListener(
        "resize",
        resize,
      );

      document.removeEventListener(
        "visibilitychange",
        visibilityHandler,
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