import React from 'react';
import {
    Table
} from 'react-bootstrap';
import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import {
    FrontendScope
} from '../../api';

import {
    getFrontendScopes,
    createOrUpdateFrontendScopes,
    deleteFrontendScopes
} from '../../modules/roles/actions';

import { RootState } from '../../store';

import {
    getAllFrontendScopes
} from '../../modules/roles/selectors';

import { IdType, Role } from '../../api';

import {
    FormContainerBase,
    FormContainerProps,
} from '../../components/Form/FormContainer';

import DataTable, { EmptyDetailRow } from '../../components/Table/DataTable';

import FrontendScopeSelector from './FrontendScopeSelector';
import AdminScopePermissionsModal from './AdminScopePermissionsModal';

export interface AdminFrontendScopesProps extends FormContainerProps {
    frontendScopes?: any[];
}

export interface AdminFrontendScopesDisplayProps extends FormContainerProps {

}

class AdminFrontendScopesDisplay extends React.PureComponent<AdminFrontendScopesDisplayProps, any> {
    render() {
        const { data = [] } = this.props;

        // TODO: Rip out dummy data
        const testData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
        return (
            <div>
                <Table responsive={true} striped={true} >
                    <thead>
                        <tr>
                            <th className="text-left">Role Name</th>
                            <th className="text-left">Role Code</th>
                            <th className="text-left">Description</th>
                            <th className="text-left">Date Created</th>
                            <th className="text-left">Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {testData.map(r => {
                            return (
                                <tr key={r.id}>
                                    <td>Test Role</td>
                                    <td>TEST_ROLE</td>
                                    <td>Ipsum Lorem Dolor</td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                    <td>
                                        Active
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </Table>
            </div>
        );
    }
}

export default class AdminFrontendScopesGrid extends FormContainerBase<AdminFrontendScopesProps> {
    name = 'admin-frontend-scopes-grid';
    reduxFormKey = 'roles';
    formFieldNames = {
        frontendScopes: 'roles.frontendScopes'
    };
    title: string = 'Register Components';

    FormComponent = (props: FormContainerProps<AdminFrontendScopesProps>) => {
        const onButtonClicked = (ev: React.SyntheticEvent<any>, context: any, model: any) => {
            // TODO: Check on this!
            // Executes in DataTable's context
            context.setActiveRow(model.id);
        };

        return (
            <div>
                <DataTable
                    fieldName={this.formFieldNames.frontendScopes}
                    title={''} // Leave this blank
                    buttonLabel={'Add Component'}
                    displayHeaderActions={true}
                    columns={[
                        DataTable.TextFieldColumn('Component', { fieldName: 'scopeName', displayInfo: true, filterable: true }),
                        DataTable.TextFieldColumn('Code', { fieldName: 'scopeCode', displayInfo: true, filterable: true }),
                        DataTable.TextFieldColumn('Description', { fieldName: 'description', colStyle: { width: '300px' }, displayInfo: false }),
                        DataTable.ButtonColumn('Define Permissions', 'list', { displayInfo: true }, onButtonClicked)
                    ]}
                    filterable={true}
                    rowComponent={EmptyDetailRow}
                    modalComponent={AdminScopePermissionsModal}
                />
            </div>
        );
    }

    // TODO: Figure out why Fragments aren't working...
    DisplayComponent = (props: FormContainerProps<AdminFrontendScopesDisplayProps>) => (
        <div>
            {/*<Alert>No roles exist</Alert>*/}
            <AdminFrontendScopesDisplay {...props} />
        </div>
    )

    validate(values: AdminFrontendScopesProps = {}): FormErrors | undefined {
        return undefined;
    }

    // TODO: Not sure if this should be roleId or what, I'm not there yet...
    fetchData(roleId: IdType, dispatch: Dispatch<{}>) {
        dispatch(getFrontendScopes()); // This data needs to always be available for select lists
    }

    getData(roleId: IdType, state: RootState) {
        const frontendScopes = getAllFrontendScopes(state) || undefined;

        return {
            frontendScopes
        };
    }

    getDataFromFormValues(formValues: {}, initialValues: {}): FormContainerProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }

    mapDeletesFromFormValues(map: any) {
        const deletedFrontendScopeIds: IdType[] = [];

        // TODO: This isn't going to work...
        if (map.frontendScopes) {
            const initialValues = map.frontendScopes.initialValues;
            const existingIds = map.frontendScopes.values.map((val: any) => val.id);

            const removeFrontendScopeIds = initialValues
                .filter((val: any) => (existingIds.indexOf(val.id) === -1))
                .map((val: any) => val.id);

            deletedFrontendScopeIds.push(...removeFrontendScopeIds);
        }

        return {
            frontendScopes: deletedFrontendScopeIds
        };
    }

    async onSubmit(formValues: any, initialValues: any, dispatch: Dispatch<any>): Promise<any[]> {
        const data: any = this.getDataFromFormValues(formValues, initialValues);
        const dataToDelete: any = this.getDataToDeleteFromFormValues(formValues, initialValues) || {};

        // Delete records before saving new ones!
        const deletedScopes: IdType[] = dataToDelete.frontendScopes as IdType[];

        const scopes: Partial<FrontendScope>[] = data.frontendScopes.map((s: FrontendScope) => ({
            ...s,
            // TODO: In some places there's a systemCodeInd which is a number... maybe a good idea to use the same type?
            systemScopeInd: false, // TODO: Ability to set this - we haven't implemented system codes yet but it will be needed
            // TODO: Need a way to set this stuff... createdBy, updated by fields should really be set in the backend using the current user
            // We're just going to set the fields here temporarily to quickly check if things are working in the meantime...
            createdBy: 'DEV - FRONTEND',
            updatedBy: 'DEV - FRONTEND',
            createdDtm: new Date().toISOString(),
            updatedDtm: new Date().toISOString(),
            revisionCount: 0 // TODO: Is there entity versioning anywhere in this project???
        }));

        return Promise.all([
            dispatch(deleteFrontendScopes(deletedScopes, { toasts: {} })),
            dispatch(createOrUpdateFrontendScopes(scopes, { toasts: {} }))
        ]);
    }
}
