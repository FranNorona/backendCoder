import { Server } from "socket.io";

const initSocket = (httpServer, products) => {
  const io = new Server(httpServer);
  console.log("Servicio de Socket activado");

  io.on("connection", (client) => {
    console.log(`Cliente conectado, id: ${client.id}`);

    client.emit("productosActualizados", products);

    client.on("nuevoProducto", (producto) => {
      products.push(producto);
      io.emit("productosActualizados", products);
    });

    client.on("disconnect", () => {
      console.log(`Cliente desconectado, id: ${client.id}`);
    });
  });

  return io;
};

export default initSocket;
