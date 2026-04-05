export default function Button({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        ...style,
      }}
    >
      {children}
    </button>
  );
}