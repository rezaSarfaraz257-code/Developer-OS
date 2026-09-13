import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function seededNoise(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Draws a code-generated, textureless Earth. The land silhouette is composed
 * from deterministic polar noise, so no image, map, or remote asset is used.
 */
export default function EarthCore() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let time = 0;
    let reducedMotion = prefersReducedMotion();
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawContinent = (cx, cy, radius, phase, stretch, tone) => {
      context.beginPath();
      for (let index = 0; index <= 44; index += 1) {
        const angle = (index / 44) * TAU;
        const ridge =
          0.72 +
          seededNoise(index * 3.7 + phase) * 0.34 +
          Math.sin(index * 1.9 + phase) * 0.09;
        const x = cx + Math.cos(angle) * radius * ridge;
        const y = cy + Math.sin(angle) * radius * ridge * stretch;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fillStyle = tone;
      context.fill();
    };

    const draw = (stamp) => {
      const delta = lastFrame ? Math.min(stamp - lastFrame, 40) : 16;
      lastFrame = stamp;
      if (!reducedMotion) time += delta;

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.285;
      const rotation = time * 0.00016;
      context.clearRect(0, 0, width, height);

      const aura = context.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.72);
      aura.addColorStop(0, "rgba(2, 203, 255, .18)");
      aura.addColorStop(0.52, "rgba(30, 100, 255, .075)");
      aura.addColorStop(1, "rgba(5, 4, 26, 0)");
      context.fillStyle = aura;
      context.beginPath();
      context.arc(cx, cy, radius * 1.7, 0, TAU);
      context.fill();

      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, TAU);
      context.clip();

      const ocean = context.createRadialGradient(
        cx - radius * 0.32,
        cy - radius * 0.35,
        radius * 0.04,
        cx,
        cy,
        radius,
      );
      ocean.addColorStop(0, "#0c4780");
      ocean.addColorStop(0.52, "#052449");
      ocean.addColorStop(1, "#010917");
      context.fillStyle = ocean;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Latitude/longitude grid is projected as ellipses within the sphere.
      context.lineWidth = 0.7;
      for (let latitude = -4; latitude <= 4; latitude += 1) {
        const offset = (latitude / 5) * radius;
        const squash = Math.sqrt(Math.max(0.08, 1 - (offset / radius) ** 2));
        context.strokeStyle = "rgba(94, 224, 255, .2)";
        context.beginPath();
        context.ellipse(cx, cy + offset, radius, radius * squash * 0.28, 0, 0, TAU);
        context.stroke();
      }
      for (let longitude = 0; longitude < 11; longitude += 1) {
        const angle = rotation + (longitude / 11) * TAU;
        context.strokeStyle = "rgba(53, 194, 255, .19)";
        context.beginPath();
        context.ellipse(cx, cy, Math.abs(Math.cos(angle)) * radius, radius, 0, 0, TAU);
        context.stroke();
      }

      const continentOffset = Math.sin(rotation) * radius * 0.2;
      drawContinent(
        cx - radius * 0.25 + continentOffset,
        cy - radius * 0.18,
        radius * 0.34,
        8.1,
        0.62,
        "rgba(16, 138, 167, .58)",
      );
      drawContinent(
        cx + radius * 0.33 + continentOffset * 0.6,
        cy + radius * 0.2,
        radius * 0.24,
        31.7,
        0.8,
        "rgba(10, 111, 151, .62)",
      );
      drawContinent(
        cx - radius * 0.06 + continentOffset * 0.32,
        cy + radius * 0.47,
        radius * 0.18,
        19.4,
        0.58,
        "rgba(20, 123, 162, .48)",
      );

      const locations = [];
      for (let index = 0; index < 34; index += 1) {
        const phi = index * 2.399 + rotation * 1.35;
        const localRadius = radius * (0.22 + ((index * 31) % 55) / 100);
        const x = cx + Math.cos(phi) * localRadius;
        const y = cy + Math.sin(phi * 1.37) * localRadius * 0.67;
        if (Math.hypot(x - cx, y - cy) < radius * 0.91) locations.push({ x, y });
      }
      context.lineWidth = 0.55;
      for (let index = 0; index < locations.length - 3; index += 3) {
        const from = locations[index];
        const to = locations[(index * 7 + 5) % locations.length];
        context.strokeStyle = "rgba(0, 221, 255, .22)";
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.quadraticCurveTo(cx, cy - radius * 0.14, to.x, to.y);
        context.stroke();
      }
      locations.forEach((location, index) => {
        const pulse = 1 + Math.sin(time * 0.004 + index) * 0.35;
        context.fillStyle = index % 7 === 0 ? "#a878ff" : "#71efff";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 7;
        context.beginPath();
        context.arc(location.x, location.y, 1.15 * pulse, 0, TAU);
        context.fill();
      });
      context.shadowBlur = 0;

      const scanY = cy - radius + ((time * 0.052) % (radius * 2));
      const scan = context.createLinearGradient(0, scanY - 18, 0, scanY + 18);
      scan.addColorStop(0, "rgba(0, 220, 255, 0)");
      scan.addColorStop(0.5, "rgba(80, 236, 255, .16)");
      scan.addColorStop(1, "rgba(0, 220, 255, 0)");
      context.fillStyle = scan;
      context.fillRect(cx - radius, scanY - 18, radius * 2, 36);
      context.restore();

      const rim = context.createRadialGradient(cx - radius * 0.24, cy - radius * 0.27, radius * 0.6, cx, cy, radius * 1.06);
      rim.addColorStop(0, "rgba(0, 0, 0, 0)");
      rim.addColorStop(0.77, "rgba(0, 0, 0, .08)");
      rim.addColorStop(0.96, "rgba(20, 222, 255, .6)");
      rim.addColorStop(1, "rgba(116, 104, 255, .92)");
      context.strokeStyle = rim;
      context.lineWidth = 2;
      context.shadowColor = "rgba(0, 213, 255, .8)";
      context.shadowBlur = 17;
      context.beginPath();
      context.arc(cx, cy, radius, 0, TAU);
      context.stroke();
      context.shadowBlur = 0;

      // Orbit rings and data packets intentionally sit outside the clipped globe.
      for (let ring = 0; ring < 3; ring += 1) {
        const ringRotation = (ring - 1) * 0.31 + time * (ring % 2 ? 0.00012 : -0.0001);
        context.save();
        context.translate(cx, cy);
        context.rotate(ringRotation);
        context.scale(1, 0.28 + ring * 0.035);
        context.strokeStyle = ring === 2 ? "rgba(163, 104, 255, .48)" : "rgba(0, 216, 255, .45)";
        context.setLineDash([7 + ring * 4, 11 + ring * 3]);
        context.lineWidth = 0.9;
        context.beginPath();
        context.arc(0, 0, radius * (1.2 + ring * 0.18), 0, TAU);
        context.stroke();
        context.restore();
      }
      context.setLineDash([]);
      for (let packet = 0; packet < 5; packet += 1) {
        const a = time * 0.0011 * (packet % 2 ? 1 : -1) + packet * 1.26;
        const orbit = radius * (1.2 + (packet % 3) * 0.17);
        const x = cx + Math.cos(a) * orbit;
        const y = cy + Math.sin(a) * orbit * 0.32;
        context.fillStyle = packet === 3 ? "#aa7bff" : "#9bfbff";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 10;
        context.beginPath();
        context.arc(x, y, 2.1, 0, TAU);
        context.fill();
      }
      context.shadowBlur = 0;

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const onMotionChange = (event) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        window.cancelAnimationFrame(frame);
        draw(performance.now());
      } else {
        lastFrame = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };
    mediaQuery?.addEventListener?.("change", onMotionChange);
    resize();
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      mediaQuery?.removeEventListener?.("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="cc-earth-canvas" aria-label="Procedural digital Earth visualisation" />;
}
