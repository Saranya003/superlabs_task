const RequestHandler = require("../utils/requestHandler");
const requestHandler = new RequestHandler();
const BaseController = require('../database/baseController');
const Joi = require("joi");

class ProductController extends BaseController {
  // Public search API
  static async searchProducts(req, res) {
    try {
      console.log(req.query);
      const { q = "", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const query = `
        SELECT p.id, name, description, price, sku, availability, pi.image_url
        FROM products p
        inner join product_images pi on pi.product_id = p.id
        WHERE name ILIKE $1 OR description ILIKE $1 
        ORDER BY created_at DESC;
      `;
      const inputs = [`%${q}%`];
      const result = await BaseController.executeSelectQuery(query, inputs);

      requestHandler.sendSuccess(req, res, "Products fetched")(result.rows);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }
  static async getProductDetail(req, res) {
    try {
      const { searchWord } = req.params;
  
      const query = `
        SELECT id, name, description, price, sku, availability,
               (SELECT json_agg(image_url) 
                FROM product_images 
                WHERE product_id = products.id) AS image_url
        FROM products
        WHERE id::text = $1 OR name ILIKE $2 OR sku ILIKE $2
        LIMIT 1
      `;
      const inputs = [searchWord, `%${searchWord}%`];
      const result = await BaseController.executeSelectQuery(query, inputs);
  
      if (result.rows.length === 0) {
        return requestHandler.sendError(req, res, "Product not found");
      }
  
      requestHandler.sendSuccess(req, res, "Product detail")(result.rows[0]);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }
}

module.exports = ProductController;
