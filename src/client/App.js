import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import MealsDisplay from "./components/MealsDisplay";
import CreateMealForm from "./components/CreateMealForm";
import DetailsDisplay from "./components/DetailsDisplay";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/meals">
        <CreateMealForm />
        <MealsDisplay />
      </Route>
      <Route exact path="/meals/:id">
        <DetailsDisplay />
      </Route>
      <Footer />
    </Router>
  );
}

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export default App;
