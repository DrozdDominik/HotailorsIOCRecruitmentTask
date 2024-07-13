import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "../../../ioc/commonTypes";
import {ILogger} from "../../../commonServices/ILogger";
import {PokemonApiService} from "../pokemon/PokemonApiService";
import {Message, ProcessedMessage} from "../../types/apiTypes";
import {PokemonData} from "../pokemon/PokemonApiServiceTypes";
import {FunctionService} from "./FunctionService";

describe("FunctionService", (): void => {
  let functionService: FunctionService;
  let mockLogger: ILogger;
  let mockPokemonApiService: PokemonApiService;

  beforeEach((): void => {
    const container: Container = new Container();
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      verbose: jest.fn(),
    };
    mockPokemonApiService = {
      fetchPokemonData: jest.fn(),
      _logger: mockLogger,
    } as unknown as PokemonApiService;

    container.bind<ILogger>(COMMON_TYPES.ILogger).toConstantValue(mockLogger);
    container.bind<PokemonApiService>(COMMON_TYPES.IPokemonApiService).toConstantValue(mockPokemonApiService);
    functionService = container.resolve(FunctionService);
  });

  it("should process message and return processed message", async (): Promise<void> => {
    const msg: Message = {
      ids: ["1", "2"],
      type: "fire",
    };

    const pokemons: (PokemonData | null)[] = [
      { name: "Charmander", types: [{ type: { name: "fire" } }] },
      null,
    ];

    (mockPokemonApiService.fetchPokemonData as jest.Mock).mockImplementation((id: string): Promise<PokemonData> => {
      return Promise.resolve(pokemons[parseInt(id, 10) - 1]);
    });

    const expected: ProcessedMessage = {
      pokemons: ["Charmander"],
    };

    await expect(functionService.processMessageAsync(msg)).resolves.toEqual(expected);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.info).toHaveBeenCalledWith("Processing message");
    
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.verbose).toHaveBeenCalledWith(JSON.stringify(msg));
    
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockPokemonApiService.fetchPokemonData).toHaveBeenCalledTimes(msg.ids.length);
  });
});