import { CommandInteraction } from 'discord.js';
import Client from '../Client';
import { Command } from './../interfaces/Command';

const command: Command = {
  name: "ping",
  description: "Responde com 'Pong!'",
  run: async (client: Client, interaction: CommandInteraction) => {
    return interaction.reply("Pong!");
  },
};

export default command;
