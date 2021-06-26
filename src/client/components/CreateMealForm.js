import React, { useState } from "react";
import handleErrors from "../App";

export default function CreateMealForm() {
  let [mealForm, setMealForm] = useState("");
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState(false);
  const [message, setMessage] = useState("");
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  let handleChange = (e) => {
    let { name, value } = e.target;

    setMealForm({
      ...mealForm,
      [name]: value,
      when: date,
      created_date: date,
    });
  };

  let save = (e) => {
    setSaveState(true);
    e.preventDefault();
    postNewMeal();
    const timerId = setTimeout(async () => {
      setSaveState(false);
    }, 2000);
    return () => clearTimeout(timerId);
  };

  function postNewMeal() {
    (async () => {
      try {
        const response = await fetch("/api/meals", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(mealForm), // body data type must match "Content-Type" header
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
  return (
    <>
      {saveState ? (
        <h3 className="mealform-container">{message}</h3>
      ) : (
        <form method="post" className="mealform-container" onSubmit={save}>
          <h1 className="formsection-title">Add a meal</h1>
          <div className="col">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max. Reservations</label>
              <input
                type="number"
                name="max_reservations"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                cols="22"
                rows="5"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="form-group">
            <button type="submit">Save</button>
          </div>
        </form>
      )}
    </>
  );
}
