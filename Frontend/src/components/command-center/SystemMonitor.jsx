import { useEffect, useState } from "react";

function Gauge({ label, value, detail, unavailable = false }) {
  const clamped = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="cc-gauge">
      <span className="cc-gauge__ring" style={{ "--value": `${clamped}%` }} aria-hidden="true">
        <strong>{unavailable ? "—" : detail}</strong>
      </span>
      <b>{label}</b>
      <small>{unavailable ? "Not exposed by browser" : "Browser capability"}</small>
    </div>
  );
}

export default function SystemMonitor() {
  const [telemetry, setTelemetry] = useState({
    cores: navigator.hardwareConcurrency || null,
    memory: navigator.deviceMemory || null,
    storageUsed: null,
    storageQuota: null,
    downlink: navigator.connection?.downlink ?? null,
    rtt: navigator.connection?.rtt ?? null,
  });

  useEffect(() => {
    let current = true;
    const loadStorage = async () => {
      try {
        const estimate = await navigator.storage?.estimate?.();
        if (current && estimate) {
          setTelemetry((previous) => ({
            ...previous,
            storageUsed: estimate.usage ?? null,
            storageQuota: estimate.quota ?? null,
          }));
        }
      } catch {
        // Storage quota is an optional browser capability.
      }
    };
    loadStorage();
    return () => { current = false; };
  }, []);

  const storagePercent = telemetry.storageUsed && telemetry.storageQuota
    ? Math.round((telemetry.storageUsed / telemetry.storageQuota) * 100)
    : 0;
  const storageDetail = telemetry.storageUsed && telemetry.storageQuota
    ? `${Math.round(telemetry.storageUsed / 1024 / 1024)} MB`
    : "—";

  return (
    <div className="cc-system-monitor">
      <p className="cc-data-disclosure">Browser-accessible metrics only; this panel does not claim host CPU or GPU usage.</p>
      <div className="cc-gauges">
        <Gauge label="CPU threads" value={(telemetry.cores || 0) * 10} detail={telemetry.cores ? `${telemetry.cores} thr` : "—"} unavailable={!telemetry.cores} />
        <Gauge label="GPU" value={0} detail="—" unavailable />
        <Gauge label="Device RAM" value={(telemetry.memory || 0) * 12} detail={telemetry.memory ? `${telemetry.memory} GB` : "—"} unavailable={!telemetry.memory} />
        <Gauge label="Storage quota" value={storagePercent} detail={storageDetail} unavailable={!telemetry.storageQuota} />
      </div>
      <div className="cc-network-readout">
        <span><b>NETWORK</b> Browser connection</span>
        <span>Downlink <strong>{telemetry.downlink == null ? "Not exposed" : `${telemetry.downlink} Mbps`}</strong></span>
        <span>RTT <strong>{telemetry.rtt == null ? "Not exposed" : `${telemetry.rtt} ms`}</strong></span>
        <span>Upload <strong>Not exposed</strong></span>
      </div>
      <div className="cc-signal-chart" aria-label="Animated interface signal visualisation, not network throughput">
        {Array.from({ length: 30 }, (_, index) => <i key={index} style={{ "--height": `${25 + ((index * 17) % 62)}%`, "--delay": `${index * -0.11}s` }} />)}
      </div>
    </div>
  );
}
