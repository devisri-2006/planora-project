import EventCard from "../components/EventCard";


function EventSelection({ goToPlanning }) {

  const events = [

    {
      title: "Wedding",
      icon: "💍",
      description:
        "Plan your wedding venue, food, decoration and photography."
    },

    {
      title: "Birthday",
      icon: "🎂",
      description:
        "Create a fun birthday plan with food, cake and decoration."
    },

    {
      title: "Corporate Event",
      icon: "💼",
      description:
        "Plan professional corporate meetings and events."
    },

    {
      title: "Conference",
      icon: "🎤",
      description:
        "Organize speakers, venue, registration and equipment."
    },

    {
      title: "College Event",
      icon: "🎓",
      description:
        "Plan college cultural events, stages and activities."
    },

    {
      title: "Exhibition",
      icon: "🏢",
      description:
        "Plan exhibition spaces, stalls and visitor management."
    },

    {
      title: "Seminar",
      icon: "📚",
      description:
        "Organize seminars with speakers and presentations."
    },

    {
      title: "Cultural Program",
      icon: "🎭",
      description:
        "Plan performances, stage setup and audience management."
    }

  ];


  return (

    <section className="selection-section">

      <div className="section-heading">

        <p className="tagline">
          PLANORA
        </p>

        <h1>
          What Event Are You Planning?
        </h1>

        <p>
          Select an event type to start planning.
        </p>

      </div>


      <div className="event-grid">

        {events.map((event) => (

          <EventCard

            key={event.title}

            title={event.title}

            icon={event.icon}

            description={event.description}

            onClick={() =>
              goToPlanning(event.title)
            }

          />

        ))}

      </div>

    </section>

  );
}


export default EventSelection;