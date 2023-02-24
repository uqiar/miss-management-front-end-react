import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../../screens/dashboard";
import Login from "../../screens/login";
import DailyEntry from "../../screens/dailyEntry";
import ManageUser from "../../screens/manageUser";
import Protected from "./protected"
import MonthlyConfigure from "../../screens/monthly-configure";
import Reports from "../../screens/reports";

export default function RoutesWrapper() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          <Route
            path="/daily-entry"
            element={
              <Protected>
                <DailyEntry />
              </Protected>
            }
          />
            <Route
            path="/report"
            element={
              <Protected>
                <Reports />
              </Protected>
            }
          />
            <Route
            path="/monthly-configure"
            element={
              <Protected>
                <MonthlyConfigure />
              </Protected>
            }
          />
          <Route
            path="/manage-user"
            element={
              <Protected>
                <ManageUser />
              </Protected>
            }
          />

          <Route path="/login" element={<Login />} />
          {/* <Route
            path="/register"
            element={
                <Register />
            }
          /> */}
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="*"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
