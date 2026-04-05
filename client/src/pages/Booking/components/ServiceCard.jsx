export default function ServiceCard({ service, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(service.id)}
      className={`p-4 rounded-xl border ${
        selected ? "border-purple-500" : "border-gray-200"
      }`}
    >
      <div>{service.icon}</div>
      <h4>{service.name}</h4>
      <p>{service.price}</p>
    </button>
  );
}