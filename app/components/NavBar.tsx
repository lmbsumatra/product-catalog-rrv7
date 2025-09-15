import { Form } from "react-router";
import { NavLink } from "react-router";

type NavBarProps = {
  user?: {
    userId: string;
    username: string;
  } | null;
};

export default function NavBar({ user }: NavBarProps) {
  return (
    <div className="navbar bg-base-100 shadow-sm mb-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">REINVENT</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/products/all">Products</NavLink>
          </li>
          {user ? (
            <li>
              <NavLink to="/products/new">Add Product</NavLink>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm font-medium hidden sm:inline">
                  Welcome, {user.username}
                </span>
              </div>
              <Form method="post" action="/logout">
                <button type="submit" className="btn">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
