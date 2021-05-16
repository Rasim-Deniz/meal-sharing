const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
    try {
        const reviews = await knex("review");
        response.send(reviews);
    } catch (error) {
        throw error
    }
});

router.post("/", async (request, response) => {
    try {
        const review = await knex("review").insert(request.body);
        if (review) {
            response.status(201).json({
                message: "Review is successfully added"
            });
        } else {
            response.status(404).json({
                error: "Reviews are not found"
            });
        }
    } catch (error) {
        throw error;
    }
});

router.get("/:id", async (request, response) => {
    try {
        const reviewId = parseInt(request.params.id);
        if (isNaN(reviewId)) {
            response.status(400).json({
                error: "IDs must be integers"
            });
            return;
        }
        const review = await knex("review").where("id", reviewId);
        if (review) {
            response.json(review);
        } else {
            response.status(404).json({
                error: "Reviews are not found"
            });
        }
    } catch (error) {
        throw error;
    }
});

router.put("/:id", async (request, response) => {
    try {
        const reviewId = parseInt(request.params.id);
        if (isNaN(reviewId)) {
            response.status(400).json({
                error: "IDs must be integers"
            });
            return;
        }
        const review = await knex("review").where("id", reviewId).update(request.body);
        if (review) {
            response.status(201).json({
                message: "Review is successfully updated"
            });
        } else {
            response.status(404).json({
                error: "Reviews are not found"
            });
        }
    } catch (error) {
        throw error;
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const reviewId = parseInt(request.params.id);
        if (isNaN(reviewId)) {
            response.status(400).json({
                error: "IDs must be integers"
            });
            return;
        }
        const review = await knex("review").where("id", reviewId).del();
        if (review) {
            response.status(201).json({
                message: "Review is successfully deleted"
            });
        } else {
            response.status(404).json({
                error: "Reviews are not found"
            });
        }
    } catch (error) {
        throw error;
    }
});

module.exports = router;