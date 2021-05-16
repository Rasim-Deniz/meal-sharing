const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    if ('maxPrice' in request.query) {
      const maxPrice = parseFloat(request.query.maxPrice);
      if (isNaN(maxPrice)) {
        response.status(400).json({
          error: "maxPrice must be an integer"
        });
        return;
      }
      const meals = await knex("meal").where("price", "<", maxPrice);
      response.json(meals);
    }

    if ("availableReservations" in request.query) {
      const availableReservations = request.query.availableReservations;

      function checkBool(bool) {
        if (bool === "true") {
          return ">";
        } else {
          return "<=";
        }
      }
      const meals = await knex("meal")
        .select('meal.id', 'meal.title', 'meal.max_reservations', knex.raw('coalesce(reservation.number_of_guests, 0) as reserved'), 'reservation.created_date')
        .leftJoin('reservation', 'meal.id', 'reservation.meal_id')
        .having('meal.max_reservations', `${checkBool(availableReservations)}`, knex.raw('reserved'));
      response.json(meals);
    }

    if ("title" in request.query) {
      const title = request.query.title;
      const meals = await knex("meal").where("title", "like", "%" + title + "%");
      response.json(meals);
    }

    if ("createdAfter" in request.query) {
      const createdAfter = request.query.createdAfter;
      const meals = await knex("meal").where("created_date", ">", createdAfter);
      response.json(meals);
    }

    if ("limit" in request.query) {
      const limit = parseInt(request.query.limit);
      if (isNaN(limit)) {
        response.status(400).json({
          error: "Limit must be an integer"
        })
        return;
      }
      const meals = await knex("meal").limit(limit);
      response.json(meals);
    }
    const meals = await knex("meal");
    response.send(meals);
  } catch (error) {
    throw error;
  }
});

router.post("/", async (request, response) => {
  try {
    const meal = await knex("meal").insert(request.body);
    if (meal) {
      response.status(201).json({
        message: "Meal is successfully added"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    throw error;
  }
});

router.get("/:id", async (request, response) => {
  try {
    const mealId = parseInt(request.params.id);
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "IDs must be integers"
      });
      return;
    }
    const meal = await knex("meal").where("id", mealId);
    if (meal) {
      response.json(meal);
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    throw error;
  }
});

router.put("/:id", async (request, response) => {
  try {
    const mealId = parseInt(request.params.id);
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "IDs must be integers"
      });
      return;
    }
    const meal = await knex("meal").where("id", mealId).update(request.body);
    if (meal) {
      response.status(201).json({
        message: "Meal is successfully updated"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    throw error;
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const mealId = parseInt(request.params.id);
    if (isNaN(mealId)) {
      response.status(400).json({
        error: "IDs must be integers"
      });
      return;
    };
    const meal = await knex("meal").where("id", mealId).del();
    if (meal) {
      response.status(201).json({
        message: "Meal is successfully deleted"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;