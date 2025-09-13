import { Outlet } from "react-router";

export default function ProductLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Outlet />
    </div>
  );
}