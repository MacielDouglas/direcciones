import PropTypes from "prop-types";

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  placeholder,
  isTextarea = false,
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm text-gray-600 mb-1 font-semibold"
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-b-secondary border-b p-3 focus:outline-none focus:border-b"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-b border-b-secondary p-3 focus:outline-none focus:border-b focus:border-orange-400 focus:bg-slate-50"
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default InputField;

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  maxLength: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  isTextarea: PropTypes.bool,
  type: PropTypes.oneOf([
    "casa",
    "apartamento",
    "loja",
    "pousada",
    "restaurante",
  ]),
};
