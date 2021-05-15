import Player from './Player';
import PlayerEvents from '../utils/PlayerEvents';
import { decodeMessage, encodeMessage } from '../utils/Message';

export default class PlayerManager {
  players: Player[];

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
          ws.send(
            encodeMessage(PlayerEvents.GET_PLAYER_LIST, {
              list: this.getPlayerList(),
            })
          );
          break;
        default:
          console.log(`Got Unknown event ${data.type}`);
      }
    });
  }

  registerPlayer(pseudo: String, ws: any) {
    const newPlayer = new Player(pseudo, ws, this.handlePlayerLogout.bind(this));
    this.players.forEach((player) => {
      player.ws.send(encodeMessage(PlayerEvents.NEW_PLAYER, {
        name: newPlayer.name,
        uuid: newPlayer.uuid,
      }));
    });
    this.players.push(newPlayer);
  }

  handlePlayerLogout(uuid: string){
    this.players = this.players.filter(player => player.uuid !== uuid);
    this.players.forEach(player => {
      player.ws.send(encodeMessage(PlayerEvents.PLAYER_LEFT, {
        uuid
      }));
    })
  }

  getPlayerList() {
    return this.players.map((player) => {
      return {
        name: player.name,
        uuid: player.uuid,
      };
    });
  }
}
