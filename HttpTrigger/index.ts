import {AzureFunction, Context, HttpRequest} from "@azure/functions";
import {Container} from "inversify";
import getContainer from "../ioc/inversify.config";
import {COMMON_TYPES} from "../ioc/commonTypes";
import {Logger} from "../commonServices/Logger";
import {ILogger} from "../commonServices/ILogger";
import {IFunctionService} from "./services/function/IFunctionService";
import {HttpResponse, ProcessedMessage} from "./types/apiTypes";

const httpTrigger: AzureFunction = async (ctx: Context, req: HttpRequest): Promise<HttpResponse> => {
    const container: Container = getContainer();
    const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
    logger.init(ctx, "1");

    const functionService: IFunctionService<any> =
        container.get<IFunctionService<any>>(COMMON_TYPES.IFunctionService);

    const ids: string[] = req.query.id ? req.query.id.split(',') : [];
    const type: string = req.query.type;

    const response: ProcessedMessage = await functionService.processMessageAsync({ ids, type }) as ProcessedMessage;

    ctx.res = {
        body: response,
        status: 200,
        headers: { "Content-Type": "application/json" },
    };
    return ctx.res as HttpResponse;
};

export default httpTrigger;