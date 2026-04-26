import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/cognito";

export function DashboardLayout() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  if (authed === null) return null;
  if (!authed) return <Navigate to="/" replace />;
  return <Outlet />;
}
