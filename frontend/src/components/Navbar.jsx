function Navbar({ setPage }) {

  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => setPage("home")}
      >
        PLANORA
      </div>


      <div className="nav-links">

        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("selection")}>
          Plan Event
        </button>

        <button onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

      </div>

    </nav>
  );
}


export default Navbar;