import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMealInput } from "../useHooks/useMealInput";

export default function MealsDisplay() {
  const [userInput, setUserInput] = useState("");
  const { newMeals, isLoading } = useMealInput(userInput);

  async function onDelete(id) {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="meals-container">
      <div className="search-bar">
        <h1 className="mealsection-title">Meals</h1>
        <input
          placeholder="Search for meal"
          className="mealsearch-input"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />
      </div>
      {newMeals.length === 0 || !newMeals ? (
        <h2 className="showups">No results</h2>
      ) : (
        newMeals.map((meal) => (
          <div className="meal-box">
            <ul>
              <li key={meal.id}>
                <h2 className="meal-title">{meal.title}</h2>
                <ul className="meal-info">
                  <li>
                    Origin
                    <strong>{meal.location}</strong>
                  </li>
                  <li>
                    Max. Reservations
                    <strong>{meal.max_reservations}</strong>
                  </li>
                  <li>
                    Price
                    <strong>{meal.price}</strong>
                  </li>
                  <a className="close" onClick={() => onDelete(meal.id)}></a>
                </ul>
                <Link to={`/meals/${meal.id}`}>
                  <button className="btn" type="button">
                    View Recipe
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

function Loading() {
  return <div>Loading... </div>;
}
