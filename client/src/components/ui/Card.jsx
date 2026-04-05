export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}