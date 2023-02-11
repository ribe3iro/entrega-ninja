import { REST, Collection, Routes, Client, GatewayIntentBits } from 'discord.js';
import path from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import { Command, Event } from './interfaces';

class Bot extends Client{
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();

  private config = process.env;

  public constructor(){
    super({ intents: [GatewayIntentBits.Guilds] })
  }

  public async init(){
    // Carregando comandos
    const pathCommands = path.join(__dirname, "commands");
    this.commands = await this.loadModules(pathCommands) as Collection<string, Command>;

    // Registrando os comandos com (/)
    this.registerSlashCommands();

    // Carregando eventos
    const pathEvents = path.join(__dirname, "events");
    this.events = await this.loadModules(pathEvents) as Collection<string, Event>;

    this.events.forEach((event) => {
      this.on(event.name, event.run.bind(null, this));
    });
    this.on("error", (err) => console.error("[#ERROR]", err));

    // Autenticando
    this.login(this.config.TOKEN);
  }

  private async loadModules(_path: string): Promise <Collection<string, object> >{
    const files = readdirSync(_path)
    .filter(file => file.endsWith(".ts"));
    
    console.log(`Carregando ${files.length} modulo(s) de '${_path}'`);
  
    const promises: Promise<any>[] = [];
    files.forEach(file => {
      promises.push(
        import(path.join(_path, file))
        .then(m => {
          return {
            key: file.split(".")[0],
            value: m.default
          };
        })
      );
    });

    return await Promise.all(promises)
    .then(files => {
      const modules: Collection<string, object> = new Collection();

      files.forEach(m => modules.set(m.key, m.value));

      return modules;
    });
  }

  private registerSlashCommands(){
    const rest = new REST({ version: '10' }).setToken(this.config.TOKEN);

    (async () => {
      try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(this.config.CLIENT_ID), { body: this.commands });

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

export default Bot;
