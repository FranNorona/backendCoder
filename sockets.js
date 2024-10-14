import { Server } from "socket.io";

const initSocket = (httpServer, products) => {
  const io = new Server(httpServer);
  console.log("Servicio de Socket activado");

  io.on("connection", (client) => {
    console.log(`Cliente conectado, id: ${client.id}`);

    client.emit("mensaje", products);

    client.on("nuevoProducto", (producto) => {
      products.push(producto);
      io.emit("mensaje", products);
    });

    client.on("disconnect", () => {
      console.log(`Cliente desconectado, id: ${client.id}`);
    });
  });
};

export default initSocket;
