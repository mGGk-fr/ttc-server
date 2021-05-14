import Player from "./Player";
import PlayerEvents from "../utils/PlayerEvents";
import {decodeMessage, encodeMessage} from "../utils/Message";

export default class PlayerManager{
    players: Player[]

    constructor() {
        this.players = [];
    }

    listenForPlayerManagerEvents(ws: any) {
        ws.on('message', (message: string) => {
            const data = decodeMessage(message);
            switch (data.type) {
                case PlayerEvents.REGISTR_PLAYER:
                    this.registerPlayer(data.data.pseudo, ws);
                    break;
                case PlayerEvents.GET_PLAYER_LIST:
                    console.log('gpl')
                    break;
                default:
                    console.log(`Got Unknown event ${data.type}`)
            }
        })
    }

    registerPlayer(pseudo: String, ws: any) {
        const newPlayer = new Player(pseudo, ws);
        this.players.push(newPlayer);
    }

}