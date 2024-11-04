import { Router } from "express";
import mongoose from "mongoose";
import cartModel from "../dao/models/cart.model.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel
      .findOne({ cartId: parseInt(cid, 10) })
      .populate("products.productId");
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }
    res.status(200).send({ error: null, data: cart });
    console.log("Carrito devuelto con productos completos:", cart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const lastCart = await cartModel.findOne().sort({ cartId: -1 });
    const newCartId = lastCart ? lastCart.cartId + 1 : 1;

    const newCart = new cartModel({ cartId: newCartId, products: [] });
    await newCart.save();

    res.status(201).send({ error: null, data: newCart });
    console.log("Carrito creado:", newCart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).send({ error: "Cantidad no válida", data: null });
  }

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }

    const productInCart = cart.products.find((p) =>
      p.productId.equals(mongoose.Types.ObjectId(pid))
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ productId: mongoose.Types.ObjectId(pid), quantity });
    }

    await cart.save();
    res.status(200).send({ error: null, data: cart });
    console.log("Producto agregado/actualizado en el carrito:", cart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findOne({ cartId: parseInt(cid, 10) });
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }

    cart.products = cart.products.filter(
      (product) => !product.productId.equals(mongoose.Types.ObjectId(pid))
    );

    await cart.save();
    res.status(200).send({ status: "success", data: cart });
    console.log("Producto eliminado del carrito:", cart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findOne({ cartId: parseInt(cid, 10) });
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }

    cart.products = []; // Vacía el array de productos
    await cart.save();

    res.status(200).send({ status: "success", data: cart });
    console.log("Todos los productos eliminados del carrito:", cart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body.products;

  try {
    const cart = await cartModel.findOneAndUpdate(
      { cartId: parseInt(cid, 10) },
      { products },
      { new: true, runValidators: true }
    );
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }
    res.status(200).send({ status: "success", data: cart });
    console.log("Carrito actualizado:", cart);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findOne({ cartId: parseInt(cid, 10) });
    if (!cart) {
      return res
        .status(404)
        .send({ error: "Carrito no encontrado", data: null });
    }

    const productInCart = cart.products.find((p) =>
      p.productId.equals(new mongoose.Types.ObjectId(pid))
    );

    if (productInCart) {
      productInCart.quantity = quantity;
      await cart.save();
      res.status(200).send({ status: "success", data: cart });
      console.log("Cantidad del producto actualizada en el carrito:", cart);
    } else {
      res
        .status(404)
        .send({ error: "Producto no encontrado en el carrito", data: null });
    }
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default router;
