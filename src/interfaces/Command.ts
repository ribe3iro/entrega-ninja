import { CommandInteraction } from "discord.js";
import Client from '../Client';

export interface Command {
    name: string;
    description: string;
    run: (client: Client, interaction: CommandInteraction) => any;
};
