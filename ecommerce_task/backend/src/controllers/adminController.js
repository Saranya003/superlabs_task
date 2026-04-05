const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../database/baseController");
const RequestHandler = require("../utils/requestHandler");
const requestHandler = new RequestHandler();
const BaseController = require('../database/baseController');
const Joi = require("joi");

class AdminController extends BaseController {
  static async login(req, res) {
    try {
      const payload = req.body;

      console.log(payload);

      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const { error } = schema.validate(payload);
      requestHandler.validateJoi(error, error ? error.message : "");
      // Check user in DB
      const query = `SELECT * FROM admin_login($1,$2)`;
      const inputs = [payload.email, payload.password];
      const result = await BaseController.executeSelectQuery(query, inputs);

      const user = result.rows[0];
        console.log(user);
      // Generate JWT
      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET || "superlabs_secret",
        { expiresIn: "1h" }
      );

      requestHandler.sendSuccess(req, res, "Login successful")({ token });
    } catch (error) {
      console.log(error);
      requestHandler.sendError(req, res, error);
    }
  }

  static async viewProducts(req, res) {
    try {
      console.log('feddddddddddd');
      const query = `SELECT * FROM products ORDER BY created_at DESC`;
      const inputs = [];
      const result = await BaseController.executeSelectQuery(query, inputs);

      requestHandler.sendSuccess(req, res, "Products fetched")(result.rows);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }
  static async createProduct(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(""),
        price: Joi.number().positive().required(),
        sku: Joi.string().required(),
        availability: Joi.boolean().default(true),
        images: Joi.array().items(Joi.string().uri()).optional() // for URL uploads
      });
  
      const { error } = schema.validate(req.body);
      requestHandler.validateJoi(error, error ? error.message : "");
  
      const { name, description, price, sku, availability, images } = req.body;
  
      // Insert product
      const query = `SELECT admin_create_product($1,$2,$3,$4,$5,$6) AS response`;
      const inputs = ["session123", name, description, price, sku, availability];
      const result = await BaseController.executeSelectQuery(query, inputs);
      const response = result.rows[0].response;
  
      // Handle uploaded files
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {

          const filePath = `/uploads/products/${file.filename}`;
          await BaseController.executeSelectQuery(
            `SELECT admin_add_product_image($1,$2,$3)`,
            ["session123", response.product_id, filePath]
          );
        }
      }
  
      // Handle image URLs
      if (images && images.length > 0) {
        for (const img of images) {
          await BaseController.executeSelectQuery(
            `SELECT admin_add_product_image($1,$2,$3)`,
            ["session123", response.product_id, img]
          );
        }
      }
  
      requestHandler.sendSuccess(req, res, "Product created")(response);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }
  
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, availability } = req.body;

      const query = `SELECT admin_update_product($1,$2,$3,$4,$5,$6) AS response`;
      const inputs = ["session123", id, name, description, price, availability];
      const result = await BaseController.executeSelectQuery(query, inputs);

      requestHandler.sendSuccess(req, res, "Product updated")(result.rows[0].response);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const query = `SELECT admin_delete_product($1,$2) AS response`;
      const inputs = ["session123", id];
      const result = await BaseController.executeSelectQuery(query, inputs);


      requestHandler.sendSuccess(req, res, "Product deleted")(result.rows[0].response);
    } catch (error) {
      requestHandler.sendError(req, res, error);
    }
  }
}


module.exports = AdminController;
