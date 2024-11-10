import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.services.js";
import mongoose from "mongoose";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const sort = req.query.sort || "";
  const category = req.query.category || "";
  const availability = req.query.status;
  const query = {};
  if (req.query.query) {
    query.title = { $regex: req.query.query, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (availability !== undefined) {
    query.status = availability === "true";
  }
  const options = {
    limit,
    page,
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
  };
  try {
    const result = await getAllProducts(query, options);
    const totalPages = result.totalPages;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `${baseUrl}?page=${prevPage}` : null,
      nextLink: nextPage ? `${baseUrl}?page=${nextPage}` : null,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ error: "ID de producto no válido" });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).send({
      error: "Todos los campos excepto 'thumbnails' son obligatorios",
      data: null,
    });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  try {
    const createdProduct = await addProduct(newProduct);
    req.app
      .get("socketio")
      .emit("productosActualizados", await getAllProducts());
    res.status(201).send({ error: null, data: createdProduct });
    console.log("Producto agregado:", createdProduct);
  } catch (error) {
    res.status(500).send({ error: error.message, data: null });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;

  try {
    const updatedProduct = await updateProduct(pid, updatedData);
    res.status(200).send({ error: null, data: updatedProduct });
    console.log("Producto actualizado:", updatedProduct);
  } catch (error) {
    res.status(404).send({ error: error.message, data: null });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const deletedProduct = await deleteProduct(pid);
    req.app
      .get("socketio")
      .emit("productosActualizados", await getAllProducts());
    res.status(200).send({ error: null, data: deletedProduct });
    console.log("Producto eliminado:", deletedProduct);
  } catch (error) {
    res.status(404).send({ error: error.message, data: null });
  }
});

export default router;
