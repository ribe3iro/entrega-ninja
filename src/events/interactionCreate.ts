import { Interaction } from 'discord.js';
import Client from '../Client';
import { Event } from '../interfaces';

const event: Event = {
  name: "interactionCreate",
  run: async (client: Client, interaction: Interaction) => {
    if (!interaction.isChatInputCommand()){
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command){
      console.log("[#ERROR] Houve uma tentativa de executar um comando inexistente")
      return;
    }

    try {
      await command.run(client, interaction);
    } catch (error) {
      console.error("[#ERROR]", error);
      await interaction.reply({
        content: "Houve um erro durante a execução do comando!",
        ephemeral: true,
      });
    }
  },
}

export default event;
