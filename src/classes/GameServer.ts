import * as WebSocket from 'ws';
import PlayerManager from './PlayerManager';

export default class GameServer {
  ws: WebSocket.Server;
  playerManager: PlayerManager;

  constructor() {
    console.log('Tic Tac Toe Server booted');
    this.ws = new WebSocket.Server({ port: 8080 });
    this.playerManager = new PlayerManager();
    this.initWebSocketListener();
  }

  initWebSocketListener(): void {
    this.ws.on('connection', (ws: WebSocket) => {
      this.initPlayerEvents(ws);
    });
  }
  initPlayerEvents(ws: WebSocket): void {
    this.playerManager.listenForPlayerManagerEvents(ws);
  }
}
