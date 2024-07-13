import axios, {AxiosResponse} from "axios";
import {inject, injectable} from "inversify";
import {COMMON_TYPES} from "../../../ioc/commonTypes";
import {ILogger} from "../../../commonServices/ILogger";
import {PokemonData} from "./PokemonApiServiceTypes";
import {IPokemonApiService} from "./IPokemonApiService";

@injectable()
export class PokemonApiService implements IPokemonApiService {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async fetchPokemonData(id: string): Promise<PokemonData | null> {
        try {
            const response: AxiosResponse<PokemonData> = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                this._logger.error(`Pokemon with ID ${id} not found.`);
                return null;
            } else {
                throw error;
            }
        }
    }
}