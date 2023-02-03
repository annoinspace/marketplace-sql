import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import CategoriesModel from "../categories/model.js"
import ProductsCategoriesModel from "./productsCategoriesModel.js"
import ReviewsModel from "../reviews/model.js"

const ProductsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 1),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

// 1 to many relationship with reviews
// ProductsModel.hasMany(ReviewsModel, { foreignKey: { allowNull: false } })
// ReviewsModel.belongsTo(ProductsModel)

// each product can belong to many categories and vice versa
ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false }
})
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false }
})

export default ProductsModel
