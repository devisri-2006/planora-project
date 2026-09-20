import EventForm from "../components/EventForm";

import BudgetCard from "../components/BudgetCard";

import Chatbot from "../components/Chatbot";


function EventPlanning({
  selectedEvent,
  plan,
  setPlan
}) {

  return (

    <section className="planning-section">

      <div className="planning-container">

        <div className="planning-heading">

          <p className="tagline">
            PLANORA AI PLANNER
          </p>

          <h1>
            Create Your Event Plan
          </h1>

          <p>
            Enter your requirements and let PLANORA
            generate your event plan.
          </p>

        </div>


        <EventForm
          selectedEvent={selectedEvent}
          onResult={setPlan}
        />


        {plan && (

          <div className="results">

            <h2>
              🎉 Your Event Plan
            </h2>


            <div className="result-grid">

              <div className="result-card">

                <h3>
                  📋 Event Details
                </h3>

                <p>
                  <strong>Event:</strong>{" "}
                  {plan.event_details?.event_type}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {plan.event_details?.location}
                </p>

                <p>
                  <strong>Guests:</strong>{" "}
                  {plan.event_details?.guests}
                </p>

                <p>
                  <strong>Budget:</strong>{" "}
                  ₹{Number(
                    plan.event_details?.budget || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>


              <BudgetCard
                budget={plan.budget}
              />

            </div>


            <div className="ai-result">

              <h3>
                🤖 AI Generated Event Plan
              </h3>


              {plan.ai_plan?.response ? (

                <pre>
                  {plan.ai_plan.response}
                </pre>

              ) : (

                <p>
                  {plan.ai_plan?.error ||
                    "AI plan is not available."}
                </p>

              )}

            </div>


            <Chatbot />

          </div>

        )}

      </div>

    </section>

  );
}


export default EventPlanning;