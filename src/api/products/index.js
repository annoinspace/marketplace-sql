import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import ProductsModel from "./model.js"
import ProductsCategoriesModel from "./productsCategoriesModel.js"
import CategoriesModel from "../categories/model.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body)

    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId
          }
        })
      )
    }
    res.status(201).send({ id: productId })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.findAll({
      include: [
        { model: CategoriesModel, attributes: ["name"], through: { attributes: [] } }
        // to exclude from the result the junction table rows --> through: { attributes: [] }
      ]
    })
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }
    })
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(req.body, {
      where: { productId: req.params.productId },
      returning: true
    })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId/category", async (req, res, next) => {
  try {
    const join = await ProductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId
    })
    res.status(201).send(join)
  } catch (error) {
    next(error)
  }
})

// usersRouter.post("/:productId/reviews", async (req, res, next) => {
//   try {
//     const user = await UsersModel.findByPk(req.params.userId)
//     if (user) {
//       const review = await ReviewsModel.create(req.body)

//       if (review) {
//         const join = await UserReviewsModel.create({
//           userId: req.params.userId,
//           reviewId: review.reviewId
//         })
//       }
//     }
//     res.status(201).send(join)
//   } catch (error) {
//     next(error)
//   }
// })

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({ where: { productId: req.params.productId } })
    if (numberOfDeletedRows === 1) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
