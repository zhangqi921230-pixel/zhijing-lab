import React, { useId, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function InquiryPrompt({ question, explanation }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  return (
    <div>
      <h3>先想一想</h3>
      <p>{question}</p>
      <button
        className="text-button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen(!open)}
      >
        {open ? "收起解释" : "观察后，查看解释"} <ChevronRight size={14} />
      </button>
      <p id={answerId} className="answer" hidden={!open}>
        {explanation}
      </p>
    </div>
  );
}
