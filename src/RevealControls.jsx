import React from "react";
import Button from "./LabButton.jsx";
export default function RevealControls({ id, p, onChange }) {
  if (id === "circle-area")
    return (
      <div className="motion-shortcuts" aria-label="等分对照">
        {[8, 24, 64].map((sectors) => (
          <Button
            key={sectors}
            aria-pressed={p.sectors === sectors}
            onClick={() => onChange({ ...p, sectors }, 6)}
          >
            {sectors} 等分
          </Button>
        ))}
      </div>
    );
  return (
    <div className="motion-shortcuts" aria-label="光源对照">
      {["白光", "红光", "绿光", "紫光", "红紫对照"].map((label, color) => (
        <Button
          key={label}
          aria-pressed={p.color === color}
          onClick={() => onChange({ ...p, color }, 6)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
