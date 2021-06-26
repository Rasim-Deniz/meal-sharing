const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    const reservations = await knex("reservations");
    response.send(reservations);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.post("/", async (request, response) => {
  try {
    const reservation = await knex("reservations").insert(request.body);
    if (reservation) {
      response.status(201).json({
        message: "Reservation is successfully added",
      });
    } else {
      response.status(404).json({
        error: "Reservations are not found",
      });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const reservationId = parseInt(request.params.id);
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "IDs must be integers",
      });
      return;
    }
    const reservation = await knex("reservations").where("id", reservationId);
    if (reservation) {
      response.json(reservation);
    } else {
      response.status(404).json({
        error: "Reservations are not found",
      });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

router.put("/:id", async (request, response) => {
  try {
    const reservationId = parseInt(request.params.id);
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "IDs must be integers",
      });
      return;
    }
    const reservation = await knex("reservations")
      .where("id", reservationId)
      .update(request.body);
    if (reservation) {
      response.status(201).json({
        message: "Reservation is successfully updated",
      });
    } else {
      response.status(404).json({
        error: "Reservations are not found",
      });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const reservationId = parseInt(request.params.id);
    if (isNaN(reservationId)) {
      response.status(400).json({
        error: "IDs must be integers",
      });
      return;
    }
    const reservation = await knex("reservations")
      .where("id", reservationId)
      .del();
    if (reservation) {
      response.status(201).json({
        message: "Reservation is successfully deleted",
      });
    } else {
      response.status(404).json({
        error: "Reservations are not found",
      });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
