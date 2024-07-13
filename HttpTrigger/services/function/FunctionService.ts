import _ from "lodash";
import {inject, injectable} from "inversify";
import {COMMON_TYPES} from "../../../ioc/commonTypes";
import { Message, ProcessedMessage } from "../../types/apiTypes";
import {ILogger} from "../../../commonServices/ILogger";
import {PokemonApiService} from "../pokemon/PokemonApiService";
import {PokemonData} from "../pokemon/PokemonApiServiceTypes";
import {IFunctionService} from "./IFunctionService";



@injectable()
export class FunctionService implements IFunctionService<any> {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    @inject(COMMON_TYPES.IPokemonApiService)
    private readonly _pokemonApiService: PokemonApiService;

    public async processMessageAsync(msg: Message): Promise<ProcessedMessage> {
        this._logger.info("Processing message");
        this._logger.verbose(`${JSON.stringify(msg)}`);

        const { ids, type } = msg;

        const pokemons: (PokemonData | null)[] = await Promise.all(ids.map((id): Promise<PokemonData | null> => this._pokemonApiService.fetchPokemonData(id)));
        const validPokemons: PokemonData[] = _.compact(pokemons);
        const filteredPokemons: PokemonData[] = _.filter(validPokemons, (pokemon): boolean => {
            return _.some(pokemon.types, { type: { name: type } });
        });

        const pokemonNames: string[] = _.map(filteredPokemons, 'name');

        return { pokemons: pokemonNames };
    }
}