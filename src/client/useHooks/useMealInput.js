import React, { useEffect, useState } from "react";
import handleErrors from "../App";
import { useMeals } from "./useMeals";

export function useMealInput(userInput) {
  const { meals, isLoading } = useMeals();
  const [newMeals, setNewMeals] = useState([]);

  useEffect(() => {
    (async () => {
      if (!userInput) {
        setNewMeals(meals);
      } else {
        try {
          const response = await fetch(`/api/meals?title=${userInput}`);
          handleErrors(response);
          const data = await response.json();
          const mealData = await data;
          setNewMeals(mealData);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [meals]);

  return { newMeals, isLoading };
}
