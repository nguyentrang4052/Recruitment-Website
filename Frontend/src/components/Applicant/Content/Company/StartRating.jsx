import './StartRating.css'
const Star = ({ filled, half }) => {
  return (
    <div className="star-wrapper">
      <svg width="16" height="16" viewBox="0 0 24 24">
        {/* Nền sao (màu xám) */}
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill="#ccc"
        />

        {/* Phần được tô màu */}
        {(filled || half) && (
          <defs>
            <clipPath id={`clip-${filled ? 'full' : 'half'}`}>
              <rect x="0" y="0" width={filled ? 24 : 12} height="24" />
            </clipPath>
          </defs>
        )}

        {(filled || half) && (
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="#ffc107"
            clipPath={`url(#clip-${filled ? 'full' : 'half'})`}
          />
        )}
      </svg>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="stars">
      {[...Array(full)].map((_, i) => (
        <Star key={`full-${i}`} filled />
      ))}
      {half && <Star key="half" half />}
      {[...Array(empty)].map((_, i) => (
        <Star key={`empty-${i}`} />
      ))}
    </div>
  );
};
export {StarRating};