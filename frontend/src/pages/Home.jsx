function Home({ goToPlanning }) {

  return (

    <>

      <section className="hero">

        <div className="hero-content">

          <p className="tagline">
            AI-POWERED EVENT MANAGEMENT
          </p>


          <h1>
            Plan Your Perfect
            <br />

            <span>Event With AI</span>
          </h1>


          <p className="hero-description">

            PLANORA helps you plan events,
            manage budgets, discover venues,
            organize vendors and create
            complete event plans using AI.

          </p>


          <button
            className="primary-button hero-button"
            onClick={() => goToPlanning("")}
          >

            Start Planning ✨

          </button>

        </div>

      </section>


      <section className="features">

        <h2>
          Everything You Need for Your Event
        </h2>


        <div className="feature-grid">

          <div className="feature-card">
            <div>🤖</div>
            <h3>AI Planning</h3>
            <p>
              Generate an event plan using AI.
            </p>
          </div>


          <div className="feature-card">
            <div>💰</div>
            <h3>Budget Management</h3>
            <p>
              Get a clear estimated budget breakdown.
            </p>
          </div>


          <div className="feature-card">
            <div>🏛️</div>
            <h3>Venue Suggestions</h3>
            <p>
              Find suitable venues from the knowledge base.
            </p>
          </div>


          <div className="feature-card">
            <div>📋</div>
            <h3>Event Checklist</h3>
            <p>
              Organize your event tasks easily.
            </p>
          </div>

        </div>

      </section>


      <footer>

        <p>
          © 2026 PLANORA — AI Event Management Assistant
        </p>

      </footer>

    </>

  );
}


export default Home;