import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.services.js";

const router = Router();

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  const products = getAllProducts();
  const result =
    !isNaN(limit) && limit > 0 ? products.slice(0, limit) : products;

  res.status(200).send({ error: null, data: result });
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = getAllProducts().find((p) => p.id === parseInt(pid, 10));

  if (product) {
    res.status(200).send({ error: null, data: product });
  } else {
    res.status(404).send({ error: "Producto no encontrado", data: null });
  }
});

router.post("/", (req, res) => {
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

  const createdProduct = addProduct(newProduct);
  req.app.get("socketio").emit("productosActualizados", getAllProducts());
  res.status(201).send({ error: null, data: createdProduct });
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;

  const updatedProduct = updateProduct(parseInt(pid, 10), updatedData);
  if (updatedProduct) {
    res.status(200).send({ error: null, data: updatedProduct });
  } else {
    res.status(404).send({ error: "Producto no encontrado", data: null });
  }
});

router.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  const deletedProduct = deleteProduct(parseInt(pid, 10));
  if (deletedProduct) {
    req.app.get("socketio").emit("productosActualizados", getAllProducts());
    res.status(200).send({ error: null, data: deletedProduct });
  } else {
    res.status(404).send({ error: "Producto no encontrado", data: null });
  }
});

export default router;

