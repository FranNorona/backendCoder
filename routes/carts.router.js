import { Router } from "express";

const router = Router();

const carts = [
  { id: 1, products: [] },
  { id: 2, products: [] },
  { id: 3, products: [] },
];

router.get("/:cid", (req, res) => {
  const { cid } = req.params;

  const cart = carts.find((c) => c.id === parseInt(cid, 10));

  if (!cart) {
    return res.status(404).send({ error: "Carrito no encontrado", data: null });
  }

  res.status(200).send({ error: null, data: cart });
  console.log("Carrito devuelto:", cart);
});

router.post("/", (req, res) => {
  const newID = carts.length ? carts[carts.length - 1].id + 1 : 1;

  const newCart = {
    id: newID,
    products: [],
  };

  carts.push(newCart);

  res.status(201).send({ error: null, data: newCart });
  console.log("Carrito creado:", newCart);
});

router.post("/:cid/products/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; // Asegúrate de que la cantidad venga del cuerpo

  if (!quantity || quantity <= 0) {
    return res.status(400).send({ error: "Cantidad no válida", data: null });
  }

  const cart = carts.find((c) => c.id === parseInt(cid, 10));

  if (!cart) {
    return res.status(404).send({ error: "Carrito no encontrado", data: null });
  }

  const productInCart = cart.products.find(
    (p) => p.productId === parseInt(pid, 10)
  );

  if (productInCart) {
    productInCart.quantity += quantity;
  } else {
    cart.products.push({ productId: parseInt(pid, 10), quantity });
  }

  res.status(200).send({ error: null, data: cart });
  console.log("Producto agregado/actualizado en el carrito:", cart);
});

export default router;
