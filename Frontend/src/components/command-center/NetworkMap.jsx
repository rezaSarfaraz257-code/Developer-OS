import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

/** A lightweight, code-drawn application topology; it has no map texture. */
export default function NetworkMap({ activeNodes, network }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    let last = 0;
    let reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from({ length: 28 }, (_, index) => ({
      x: 0.08 + ((index * 37) % 84) / 100,
      y: 0.13 + ((index * 61) % 72) / 100,
      phase: index * 0.87,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (stamp) => {
      const delta = last ? Math.min(stamp - last, 40) : 16;
      last = stamp;
      if (!reduced) time += delta;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(41, 186, 255, .08)";
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += 28) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = 0; y <= height; y += 28) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }
      const projected = nodes.map((node) => ({
        x: node.x * width + Math.sin(time * 0.00035 + node.phase) * 6,
        y: node.y * height + Math.cos(time * 0.00028 + node.phase) * 4,
        phase: node.phase,
      }));
      projected.forEach((node, index) => {
        const target = projected[(index * 7 + 4) % projected.length];
        context.strokeStyle = "rgba(0, 205, 255, .2)";
        context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(target.x, target.y); context.stroke();
      });
      projected.forEach((node, index) => {
        const pulse = 1 + Math.sin(time * 0.004 + node.phase) * 0.45;
        context.fillStyle = index % 8 === 0 ? "#aa82ff" : "#52e7ff";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 7;
        context.beginPath(); context.arc(node.x, node.y, 1.5 * pulse, 0, TAU); context.fill();
      });
      context.shadowBlur = 0;
      if (!reduced) frame = window.requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onMotion = (event) => {
      reduced = event.matches;
      window.cancelAnimationFrame(frame);
      if (reduced) draw(performance.now());
      else { last = 0; frame = window.requestAnimationFrame(draw); }
    };
    motion?.addEventListener?.("change", onMotion);
    resize(); frame = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); motion?.removeEventListener?.("change", onMotion); };
  }, []);

  const latency = network.rtt == null ? "Not exposed" : `${network.rtt} ms`;
  return (
    <div className="cc-network-map">
      <canvas ref={canvasRef} aria-label="Procedural application network topology" />
      <p className="cc-map-note">Application topology visualisation · not external network telemetry</p>
      <dl className="cc-map-stats">
        <div><dt>Active nodes</dt><dd>{activeNodes}</dd></div>
        <div><dt>Browser RTT</dt><dd>{latency}</dd></div>
        <div><dt>Downlink</dt><dd>{network.downlink == null ? "Not exposed" : `${network.downlink} Mbps`}</dd></div>
        <div><dt>API modules</dt><dd>{activeNodes}/7</dd></div>
      </dl>
    </div>
  );
}
