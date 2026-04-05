export default function ProviderCard({ provider, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(provider.id)}
      className={`p-4 rounded-xl border cursor-pointer ${
        selected ? "border-purple-500" : "border-gray-200"
      }`}
    >
      <h4>{provider.name}</h4>
      <p>⭐ {provider.rating}</p>
      <p>{provider.distance} • {provider.eta}</p>
      <p>{provider.price}</p>
    </div>
  );
}