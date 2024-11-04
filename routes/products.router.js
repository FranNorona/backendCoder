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
    const prevPage = result.hasPrevPage ? result.prevPage : null;
    const nextPage = result.hasNextPage ? result.nextPage : null;
    const prevLink = result.hasPrevPage
      ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${
          req.query.query || ""
        }&category=${category}&status=${availability}`
      : null;
    const nextLink = result.hasNextPage
      ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${
          req.query.query || ""
        }&category=${category}&status=${availability}`
      : null;
    res.status(200).send({
      status: "success",
      payload: result.docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
    console.log("Get realizado");
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  console.log("Recibiendo solicitud para pid:", pid);

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    console.log("Valor de pid no válido:", pid);
    return res.status(400).send({ error: "Invalid ObjectId", data: null });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(pid); // Uso de 'new'
    const product = await productModel.findById(objectId);
    if (product) {
      res.status(200).send({ error: null, data: product });
    } else {
      res.status(404).send({ error: "Producto no encontrado", data: null });
    }
  } catch (error) {
    res.status(500).send({ error: error.message, data: null });
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
