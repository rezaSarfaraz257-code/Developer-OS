import { useEffect, useState } from "react";

export default function Avatar({ imageUrl, initials = "D", className = "", label }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div className={`avatar ${className}`.trim()} role="img" aria-label={label}>
      {imageUrl && !imageFailed ? (
        <img src={imageUrl} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
