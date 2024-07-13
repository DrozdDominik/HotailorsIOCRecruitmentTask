import "reflect-metadata";
import {Container} from "inversify";
import {Logger} from "../commonServices/Logger";
import {ILogger} from "../commonServices/ILogger";
import {IFunctionService} from "../HttpTrigger/services/function/IFunctionService";
import {FunctionService} from "../HttpTrigger/services/function/FunctionService";
import {IPokemonApiService} from "../HttpTrigger/services/pokemon/IPokemonApiService";
import {PokemonApiService} from "../HttpTrigger/services/pokemon/PokemonApiService";
import {COMMON_TYPES} from "./commonTypes";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();

    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();

    container
        .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
        .to(FunctionService);

    container
        .bind<IPokemonApiService>(COMMON_TYPES.IPokemonApiService)
        .to(PokemonApiService);

    return container;
};

export default getContainer;
