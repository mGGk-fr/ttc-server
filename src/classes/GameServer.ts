import * as WebSocket from "ws"
import PlayerManager from "./PlayerManager";
import PlayerEvents from "../utils/PlayerEvents";

export default class GameServer{
    ws: WebSocket.Server;
    playerManager: PlayerManager;

    constructor() {
        console.log('Tic Tac Toe Server booted')
        this.ws = new WebSocket.Server({port: 8080})
        this.playerManager = new PlayerManager();
        this.initWebSocketListener();
    }

    initWebSocketListener() {
        this.ws.on('connection', (ws) => {
            this.initPlayerEvents(ws);
        });
    }
    initPlayerEvents(ws: any): void {
        this.playerManager.listenForPlayerManagerEvents(ws);
    }

    decodeMessage(message: string): any {
        return JSON.parse(message);
    }

    formatMessage(type: PlayerEvents, data: any) {
        return JSON.stringify({type, data});
    }
}