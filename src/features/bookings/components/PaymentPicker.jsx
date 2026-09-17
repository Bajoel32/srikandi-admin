import { PAYMENT_OPTIONS } from '../constants.js';

export default function PaymentPicker({ value, onChange, disabled }) {
  return (
    <div className="payment-picker">
      {PAYMENT_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={'btn payment-option' + (value === option ? ' active' : '')}
          onClick={() => onChange(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
