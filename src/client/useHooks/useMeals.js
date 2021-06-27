import React, { useEffect, useState } from "react";
import handleErrors from "../App";

export function useMeals() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/meals");
        handleErrors(response);
        const data = await response.json();
        const mealData = await data;
        setMeals(mealData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { meals, setMeals, isLoading, setIsLoading };
}
