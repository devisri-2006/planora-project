function EventCard({
  title,
  icon,
  description,
  onClick
}) {

  return (
    <div
      className="event-card"
      onClick={onClick}
    >

      <div className="event-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button>
        Plan Event →
      </button>

    </div>
  );
}


export default EventCard;