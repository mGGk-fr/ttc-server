import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { encodeMessage } from '../utils/Message';
import PlayerEvents from '../utils/PlayerEvents';

export default class Player {
  uuid: string;
  name: string;
  ws: WebSocket;

  constructor(pseudo: string, ws: WebSocket, logout: (uuid: string) => unknown) {
    this.name = pseudo;
    this.uuid = uuidv4();
    this.ws = ws;
    ws.send(
      encodeMessage(PlayerEvents.PLAYER_REGISTRED, {
        uuid: this.uuid,
        pseudo: this.name,
      })
    );
    console.log(
      `Player ${this.name} has been registred with UUID ${this.uuid}`
    );
    ws.on('close', () => {
      logout(this.uuid);
    });
  }
}
