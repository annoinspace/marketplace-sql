import express from "express"
import CategoriesModel from "./model.js"

const categoriesRouter = express.Router()

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body)
    res.status(201).send({ id: categoryId })
  } catch (error) {
    next(error)
  }
})

categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([
      { name: "Snacks" },
      { name: "Dessert" },
      { name: "Condiments" },
      { name: "Seasoning" }
    ])
    res.send(categories.map((c) => c.categoryId))
  } catch (error) {
    next(error)
  }
})

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll()
    res.send(categories)
  } catch (error) {
    next(error)
  }
})

categoriesRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await CategoriesModel.update(req.body, {
      where: { categoryId: req.params.categoryId },
      returning: true
    })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Category with id ${req.params.categoryId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await CategoriesModel.destroy({ where: { categoryId: req.params.categoryId } })
    if (numberOfDeletedRows === 1) {
      res.status(200).send({ message: `Category with id ${req.params.categoryId} deleted` })
    } else {
      next(createHttpError(404, `Category with id ${req.params.categoryId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default categoriesRouter
