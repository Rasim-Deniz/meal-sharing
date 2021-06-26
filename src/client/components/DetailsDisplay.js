import React, { useEffect, useState } from "react";
import handleErrors from "../App";
import { useParams } from "react-router-dom";

export default function DetailsDisplay() {
  const [meal, setMeal] = useState([]);
  const [availableMeal, setAvailableMeal] = useState([]);
  let [reservationForm, setReservationForm] = useState("");
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState(false);
  const [message, setMessage] = useState("");
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  let { id } = useParams();

  let handleChange = (e) => {
    let { name, value } = e.target;

    setReservationForm({
      ...reservationForm,
      [name]: value,
      meal_id: meal.id,
      created_date: date,
    });
  };

  let save = (e) => {
    setSaveState(true);
    e.preventDefault();
    postNewReservation();
    const timerId = setTimeout(async () => {
      setSaveState(false);
    }, 2000);
    return () => clearTimeout(timerId);
  };

  function postNewReservation() {
    (async () => {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(reservationForm), // body data type must match "Content-Type" header
        });
        handleErrors(response);
        const data = await response.json();
        const { message } = data;
        setMessage(message);
      } catch (err) {
        setError(err);
      }
    })();
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/meals/${id}`);
        handleErrors(response);
        const data = await response.json();
        const mealData = await data;
        setMeal(mealData[0]);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/meals?availableReservations=true`);
        handleErrors(response);
        const data = await response.json();
        const availableMealData = await data;
        const filteredMeal = availableMealData.find((meals) => meals.id == id);
        setAvailableMeal(filteredMeal);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="details-big-container">
      {saveState ? (
        <h3 className="message">{message}</h3>
      ) : (
        <div className="details-container">
          <div className="meal-details">
            <h2>{meal.title}</h2>
            <p>{meal.description}</p>
          </div>
          {availableMeal ? (
            <form method="post" className="details-form" onSubmit={save}>
              <h1 className="centered">Book a seat for this meal</h1>
              <div className="col-2">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="contact_name"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone number</label>
                  <input
                    type="text"
                    name="contact_phonenumber"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    name="number_of_guests"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="centered">
                <button type="submit" className="btn">
                  Book a seat
                </button>
              </div>
            </form>
          ) : (
            <h3 className="reservation-message">Reservations are full</h3>
          )}
        </div>
      )}
    </div>
  );
}
