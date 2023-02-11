import { Interaction, ActivityType } from 'discord.js';
import Client from '../Client';
import { Event } from '../interfaces';

const event: Event = {
  name: "ready",
  run: async (client: Client, interaction: Interaction) => {
    console.log(`==== 'entrega-ninja' está online! ====`);
    client.user?.setPresence({
      status: "online",
      activities: [
        {
          type: ActivityType.Listening,
          name: "/help",
        },
      ],
    })
  },
};

export default event;
