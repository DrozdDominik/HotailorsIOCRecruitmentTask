import {PokemonData} from "./PokemonApiServiceTypes";

export interface IPokemonApiService {
    fetchPokemonData(id: string): Promise<PokemonData | null>
}