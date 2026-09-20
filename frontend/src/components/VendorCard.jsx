function VendorCard({ vendor }) {

  if (!vendor) {
    return null;
  }


  return (

    <div className="small-card">

      <h3>🧑‍💼 {vendor.name}</h3>

      <p>
        <strong>City:</strong> {vendor.city}
      </p>

      <p>
        <strong>Service:</strong> {vendor.service}
      </p>

      {vendor.estimated_price && (

        <p>
          <strong>Estimated Price:</strong>{" "}
          ₹{Number(
            vendor.estimated_price
          ).toLocaleString("en-IN")}
        </p>

      )}

      {vendor.price_per_person && (

        <p>
          <strong>Price / Person:</strong>{" "}
          ₹{vendor.price_per_person}
        </p>

      )}

    </div>

  );
}


export default VendorCard;