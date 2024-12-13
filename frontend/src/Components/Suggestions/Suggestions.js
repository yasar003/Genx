import "./Suggestions.css";

const Suggestions = ({ suggestions, onSelect }) => {
  return (
    <ul className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onSelect(suggestion)}
          className="suggestion-item"
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  );
};

export default Suggestions;
