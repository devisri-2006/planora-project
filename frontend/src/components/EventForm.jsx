import { useState } from "react";


function EventForm({
  selectedEvent,
  onResult
}) {

  const [form, setForm] = useState({

    event_type: selectedEvent || "Wedding",

    location: "Hyderabad",

    guests: 100,

    budget: 100000,

    requirements: ""

  });


  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const generatePlan = async () => {

    setLoading(true);


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/ai/generate-plan",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            ...form,

            guests: Number(form.guests),

            budget: Number(form.budget)

          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error("Server error");

      }


      onResult(data);

    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to connect to PLANORA backend. Please make sure FastAPI is running."
      );

    }


    setLoading(false);
  };


  return (

    <div className="form-card">

      <h2>Create Your Event Plan</h2>

      <p className="subtitle">
        Enter your event details and PLANORA will create an AI-powered plan.
      </p>


      <label>
        Event Type
      </label>

      <select
        name="event_type"
        value={form.event_type}
        onChange={handleChange}
      >

        <option>Wedding</option>

        <option>Birthday</option>

        <option>Corporate Event</option>

        <option>Conference</option>

        <option>College Event</option>

        <option>Exhibition</option>

        <option>Seminar</option>

        <option>Cultural Program</option>

      </select>


      <label>
        Location
      </label>

      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Example: Hyderabad"
      />


      <div className="form-row">

        <div>

          <label>
            Guests
          </label>

          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
          />

        </div>


        <div>

          <label>
            Budget ₹
          </label>

          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
          />

        </div>

      </div>


      <label>
        Requirements
      </label>

      <textarea
        name="requirements"
        value={form.requirements}
        onChange={handleChange}
        placeholder="Example: vegetarian food, stage, photography..."
      />


      <button
        className="primary-button"
        onClick={generatePlan}
        disabled={loading}
      >

        {loading
          ? "Creating Your Plan..."
          : "✨ Generate Event Plan"
        }

      </button>

    </div>

  );
}


export default EventForm;