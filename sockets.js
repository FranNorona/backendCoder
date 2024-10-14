import { Server } from "socket.io";

const initSocket = (httpServer) => {
  const messages = [];

  const io = new Server(httpServer);
  console.log("Servicio de Socket activado");

  io.on("connection", (client) => {
    console.log(
      `Cliente conectado, id${client.id} desde ${client.handshake.address}`
    );

    client.on("mensaje", (msg) => {
      messages.push(msg);
      io.emit("mensaje", msg);
    });

    client.on("disconnect", () => {
      console.log(`Cliente desconectado, id ${client.id}`);
    });
  });
};

export default initSocket;
