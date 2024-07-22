import { WebSocketServer } from 'ws';

export const start = (): WebSocketServer => {
  const wss = new WebSocketServer({ port: 8070 });

  wss.on('close', () => {
    console.log(`Disconnected from WebSocket server ${wss.address()}`);
  });

  wss.on('connection', (ws) => {
    console.log(`Connected to WebSocket server`);

    ws.on('error', console.error);

    ws.on('message', function message(data) {
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    });

    ws.on('close', () => {
      console.log(`Client disconnected`);
    });

    ws.on('ping', () => {
      ws.pong();
    });
  });

  return wss;
};

export const stop = (ws: WebSocketServer): void => {
  ws.close();
};
