export type Message = {
    ids: string[]
    type: string
};

export type ProcessedMessage = {
    pokemons: string[]
};


export type HttpResponse = {
    body: any
    status: number
    headers: { [key: string]: string }
};