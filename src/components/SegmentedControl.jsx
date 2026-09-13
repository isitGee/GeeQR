/** Accessible segmented control (radio-group semantics). */
export function SegmentedControl({ label, options, value, onChange, labelId }) {
  return (
    <div className="option-group">
      <span className="field-label" id={labelId}>
        {label}
      </span>
      <div className="segmented" role="group" aria-labelledby={labelId}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="segmented-btn"
            aria-pressed={value === opt.value}
            title={opt.title}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
