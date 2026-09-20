function VenueCard({ venue }) {

  if (!venue) {
    return null;
  }


  return (

    <div className="small-card">

      <h3>🏛️ {venue.name}</h3>

      <p>
        <strong>City:</strong> {venue.city}
      </p>

      <p>
        <strong>Capacity:</strong> {venue.capacity}
      </p>

      <p>
        <strong>Estimated Price:</strong>{" "}
        ₹{Number(venue.estimated_price).toLocaleString("en-IN")}
      </p>

      <p>
        <strong>Facilities:</strong>{" "}
        {venue.facilities?.join(", ")}
      </p>

    </div>

  );
}


export default VenueCard;