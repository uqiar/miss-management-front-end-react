
import React,{useEffect, useState} from "react";
import AppRoute from "./components/routes/routes";
import MyProvider from "./context/provider";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div>
     <MyProvider>
        <AppRoute />
      </MyProvider>
      <ToastContainer />
    </div>
  );
}
