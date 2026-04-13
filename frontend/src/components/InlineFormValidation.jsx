export function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export function hasErrorClass(message) {
  return message ? "input-error" : "";
}
