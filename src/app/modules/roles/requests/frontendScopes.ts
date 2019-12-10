import { ThunkExtra } from '../../../store';
import arrayToMap from '../../../infrastructure/arrayToMap';
import {
    STATE_KEY,
    RoleModuleState
} from '../common';
import {
    FrontendScopeMap,
    FrontendScope,
    MapType
} from '../../../api/Api';
import GetEntityMapRequest from '../../../infrastructure/Requests/GetEntityMapRequest';
import { RequestConfig } from '../../../infrastructure/Requests/RequestActionBase';
import CreateOrUpdateEntitiesRequest from '../../../infrastructure/Requests/CreateOrUpdateEntitiesRequest';
import CreateEntityRequest from '../../../infrastructure/Requests/CreateEntityRequest';
import UpdateEntityRequest from '../../../infrastructure/Requests/UpdateEntityRequest';
// import toTitleCase from '../../infrastructure/toTitleCase';

// Get the Map
class FrontendScopeMapRequest extends GetEntityMapRequest<void, FrontendScope, RoleModuleState> {
    constructor(config?: RequestConfig<MapType<FrontendScope>>) {
        super({
            namespace: STATE_KEY,
            actionName: 'roleMap',
            ...config
        });
    }
    public async doWork(request: void, { api }: ThunkExtra): Promise<FrontendScopeMap> {
        let data = await api.getFrontendScopes();
        return arrayToMap(data, t => t.id);
    }
}

export const frontendScopeMapRequest = new FrontendScopeMapRequest();

// Create FrontendScope
class CreateFrontendScopeRequest extends CreateEntityRequest<FrontendScope, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createFrontendScope',
                toasts: {
                    success: (s) => (
                        `Success`
                    ),
                    error: (err) => (
                        `Problem encountered while adding new role: ${err ? err.toString() : 'Unknown Error'}`
                    )
                }
            },
            frontendScopeMapRequest
        );
    }
    public async doWork(role: Partial<FrontendScope>, { api }: ThunkExtra): Promise<FrontendScope> {
        let newFrontendScope = await api.createFrontendScope(role as FrontendScope);
        return newFrontendScope;
    }
}

export const createFrontendScopeRequest = new CreateFrontendScopeRequest();

// FrontendScope Edit
class UpdateFrontendScopeRequest extends UpdateEntityRequest<FrontendScope, RoleModuleState> {
    constructor() {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'updateFrontendScope',
                toasts: {
                    success: (s) => `Success`,
                    // tslint:disable-next-line:max-line-length
                    error: (err) => `Problem encountered while updating role: ${err ? err.toString() : 'Unknown Error'}`
                }
            },
            frontendScopeMapRequest
        );
    }
    public async doWork(role: Partial<FrontendScope>, { api }: ThunkExtra): Promise<FrontendScope> {
        let newFrontendScope = await api.updateFrontendScope(role as FrontendScope);
        return newFrontendScope;
    }
}

export const updateFrontendScopeRequest = new UpdateFrontendScopeRequest();

class CreateOrUpdateFrontendScopeRequest extends CreateOrUpdateEntitiesRequest<FrontendScope, RoleModuleState>{
    createEntity(entity: Partial<FrontendScope>, { api }: ThunkExtra): Promise<FrontendScope> {
        return api.createFrontendScope(entity);
    }
    updateEntity(entity: Partial<FrontendScope>, { api }: ThunkExtra): Promise<FrontendScope> {
        return api.updateFrontendScope(entity as FrontendScope);
    }
    constructor(config?: RequestConfig<FrontendScope[]>) {
        super(
            {
                namespace: STATE_KEY,
                actionName: 'createOrUpdateFrontendScope',
                toasts: {
                    error: (err: any) => `Couldn't create/update roles: ${err.message}`
                },
                ...config
            },
            frontendScopeMapRequest
        );
    }
}

export const createOrUpdateFrontendScopeRequest = new CreateOrUpdateFrontendScopeRequest();
