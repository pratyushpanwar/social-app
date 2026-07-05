import React from 'react'

function Input({ ref, label, error, ...props },) {

  return (
    <div className="form-control mb-4">
      {label && (
        <label className="label py-1">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <input
        ref={ref}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && (
        <label className="label py-1">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default Input