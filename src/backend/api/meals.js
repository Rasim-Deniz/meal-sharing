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
      const meals = await knex("meals").where("price", "<", maxPrice);
      response.json(meals);
    } else if ("availableReservations" in request.query) {
      const availableReservations = request.query.availableReservations;

      function checkBool(bool) {
        if (bool === "true") {
          return ">";
        } else {
          return "<=";
        }
      }
      const meals = await knex("meals")
        .select('meals.id', 'meals.title', 'meals.max_reservations', knex.raw('coalesce(reservations.number_of_guests, 0) as reserved'), 'reservations.created_date')
        .leftJoin('reservations', 'meals.id', 'reservations.meal_id')
        .having('meals.max_reservations', `${checkBool(availableReservations)}`, knex.raw('reserved'));
      response.json(meals);
    } else if ("title" in request.query) {
      const title = request.query.title;
      const meals = await knex("meals").where("title", "like", "%" + title + "%");
      response.json(meals);
    } else if ("createdAfter" in request.query) {
      const createdAfter = request.query.createdAfter;
      const meals = await knex("meals").where("created_date", ">", createdAfter);
      response.json(meals);
    } else if ("limit" in request.query) {
      const limit = parseInt(request.query.limit);
      if (isNaN(limit)) {
        response.status(400).json({
          error: "Limit must be an integer"
        })
        return;
      }
      const meals = await knex("meals").limit(limit);
      response.json(meals);
    } else {
      const meals = await knex("meals");
      response.send(meals);
    }

  } catch (error) {
    response.status(500).json(error);
  }
});

router.post("/", async (request, response) => {
  try {
    const meals = await knex("meals").insert(request.body);
    if (meals) {
      response.status(201).json({
        message: "meal is successfully added"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    response.status(500).json(error);
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
    const meals = await knex("meals").where("id", mealId);
    if (meals) {
      response.json(meals);
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    response.status(500).json(error);
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
    const meals = await knex("meals").where("id", mealId).update(request.body);
    if (meals) {
      response.status(201).json({
        message: "meal is successfully updated"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    response.status(500).json(error);
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
    const meals = await knex("meals").where("id", mealId).del();
    if (meals) {
      response.status(201).json({
        message: "meal is successfully deleted"
      });
    } else {
      response.status(404).json({
        error: "Meals are not found"
      });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;