function Dashboard({
  plan,
  goToPlanning
}) {

  return (

    <section className="dashboard">

      <div className="dashboard-heading">

        <p className="tagline">
          PLANORA DASHBOARD
        </p>

        <h1>
          Event Management Dashboard
        </h1>

      </div>


      {plan ? (

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <div className="dashboard-icon">
              🎉
            </div>

            <h3>
              {plan.event_details?.event_type}
            </h3>

            <p>
              {plan.event_details?.location}
            </p>

          </div>


          <div className="dashboard-card">

            <div className="dashboard-icon">
              👥
            </div>

            <h3>
              {plan.event_details?.guests}
            </h3>

            <p>
              Guests
            </p>

          </div>


          <div className="dashboard-card">

            <div className="dashboard-icon">
              💰
            </div>

            <h3>
              ₹{Number(
                plan.event_details?.budget || 0
              ).toLocaleString("en-IN")}
            </h3>

            <p>
              Total Budget
            </p>

          </div>

        </div>

      ) : (

        <div className="empty-dashboard">

          <h2>
            No event plan created yet.
          </h2>

          <p>
            Create your first event plan with PLANORA.
          </p>


          <button
            className="primary-button"
            onClick={() => goToPlanning("")}
          >

            Create Event Plan

          </button>

        </div>

      )}

    </section>

  );
}


export default Dashboard;