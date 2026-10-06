import { NavLink, Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">Task<span>Flow</span></Link>
        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/tasks">All Tasks</NavLink>
          <NavLink to="/tasks/new">Create Task</NavLink>
        </nav>
        <div className="sidebar-footer">Plan. Focus. Finish.</div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
