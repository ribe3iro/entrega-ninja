import Client from '../Client';

export interface Event{
    name: string;
    run: (client: Client, ...args: any[]) => any;
}
