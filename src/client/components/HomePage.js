import React from "react";
import { Link } from "react-router-dom";
import { useMeals } from "../useHooks/useMeals";

function HomePage() {
  const { meals, isLoading } = useMeals();

  function onDelete(id) {
    (async () => {
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
    })();
  }

  return (
    <section className="main-container">
      <div className="heading-container">
        <h1 className="heading">Check Our Meals</h1>
      </div>
      <div className="card-container">
        {meals.length === 0 || !meals ? (
          <h2 className="showups">No results</h2>
        ) : (
          meals.map((meal) => (
            <ul>
              <li key={meal.id} className="card">
                <p className="card__exit">
                  <i
                    className="fas fa-times"
                    onClick={() => onDelete(meal.id)}
                  ></i>
                </p>
                <h2 className="card__title">{meal.title}</h2>
                <p className="card__apply">
                  <Link to={`/meals/${meal.id}`}>
                    View Recipe <i className="fas fa-arrow-right"></i>
                  </Link>
                </p>
              </li>
            </ul>
          ))
        )}
      </div>
    </section>
  );
}

export default HomePage;
