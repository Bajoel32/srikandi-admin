import { QUANTITY_MAX, QUANTITY_MIN } from '../constants.js';

export default function QuantityStepper({ value, onChange, disabled }) {
  const dec = () => onChange(Math.max(QUANTITY_MIN, value - 1));
  const inc = () => onChange(Math.min(QUANTITY_MAX, value + 1));

  return (
    <div className="qty-stepper">
      <button type="button" className="btn" onClick={dec} disabled={disabled || value <= QUANTITY_MIN}>
        −
      </button>
      <span className="qty-value">{value}</span>
      <button type="button" className="btn" onClick={inc} disabled={disabled || value >= QUANTITY_MAX}>
        +
      </button>
    </div>
  );
}
