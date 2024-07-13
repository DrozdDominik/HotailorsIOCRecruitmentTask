import {Container} from 'inversify';
import 'reflect-metadata';
import axios from 'axios';
import {describe, it, expect, beforeEach} from "@jest/globals";
import {ILogger} from '../../../commonServices/ILogger';
import {COMMON_TYPES} from '../../../ioc/commonTypes';
import {PokemonApiService} from './PokemonApiService';
import { IPokemonApiService } from './IPokemonApiService';
import { PokemonData } from './PokemonApiServiceTypes';

jest.mock('axios');
const mockedAxios: jest.Mocked<typeof axios> = axios as jest.Mocked<typeof axios>;

describe('PokemonApiService', (): void => {
	let service: PokemonApiService;
	let logger: ILogger;

	beforeEach((): void => {
		const container: Container = new Container();
		logger = {
			error: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			verbose: jest.fn(),
		};
		container.bind<ILogger>(COMMON_TYPES.ILogger).toConstantValue(logger);
		service = new PokemonApiService();
		container.bind<IPokemonApiService>(COMMON_TYPES.IPokemonApiService).toConstantValue(service);
	});

	it('should return pokemon data when the fetch is successful', async (): Promise<void> => {
		const pokemonData: PokemonData = { name: 'pikachu', types: [{type: {name: 'grass'}}]};
		mockedAxios.get.mockResolvedValue({ data: pokemonData });

		const result: PokemonData = await service.fetchPokemonData('25');

		expect(result).toEqual(pokemonData);
		
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
	});

	it('should throw an error for any other axios error', async (): Promise<void> => {
		const error: any = new Error('Network error');
		mockedAxios.get.mockRejectedValue(error);

		await expect(service.fetchPokemonData('invalid')).rejects.toThrow(error);
	});
});