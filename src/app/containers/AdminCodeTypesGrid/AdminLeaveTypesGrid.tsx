import React from 'react';

import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import {
    getRoles
} from '../../modules/roles/actions';

import { RootState } from '../../store';

import {
    getAllRoles
} from '../../modules/roles/selectors';

import { IdType } from '../../api';

import {
    FormContainerBase,
    FormContainerProps,
} from '../../components/Form/FormContainer';

import DataTable, { DetailComponentProps, EmptyDetailRow } from '../../components/Table/DataTable';
import { AdminLeaveTypesProps } from './AdminLeaveTypesGrid';

export interface AdminLeaveTypesProps extends FormContainerProps {
    roles?: any[];
}

export interface AdminLeaveTypesDisplayProps extends FormContainerProps {

}

class AdminLeaveTypesDisplay extends React.PureComponent<AdminLeaveTypesDisplayProps, any> {
    render() {
        const { data = [] } = this.props;
        return (
            <div />
        );
    }
}

export default class AdminLeaveTypesGrid extends FormContainerBase<AdminLeaveTypesProps> {
    name = 'admin-leave-types-grid';
    reduxFormKey = 'roles';
    formFieldNames = {
        default: 'roles.roles'
    };
    title: string = ' Leave Types';

    FormComponent = (props: FormContainerProps<AdminLeaveTypesProps>) => {
        return (
            <div>
                <DataTable
                    fieldName={this.formFieldNames.default}
                    title={''} // Leave this blank
                    buttonLabel={'Add Leave Type'}
                    columns={[
                        DataTable.TextFieldColumn('Leave Type', { fieldName: 'default', displayInfo: true }),
                        DataTable.TextFieldColumn('Code', { fieldName: 'default', displayInfo: true }),
                        DataTable.TextFieldColumn('Description', { fieldName: 'default', displayInfo: true }),
                        // DataTable.DateColumn('Date Created', 'createdDtm'),
                        DataTable.SelectorFieldColumn('Status', { displayInfo: true }),

                    ]}
                    expandable={false}
                    // expandedRows={[1, 2]}
                    rowComponent={EmptyDetailRow}
                    modalComponent={EmptyDetailRow}
                    displayHeaderActions={true}
                />
            </div>
        );
    }

    // TODO: Figure out why Fragments aren't working...
    DisplayComponent = (props: FormContainerProps<AdminLeaveTypesDisplayProps>) => (
        <div>
            {/*<Alert>No roles exist</Alert>*/}
            <AdminLeaveTypesDisplay {...props} />
        </div>
    )

    validate(values: AdminLeaveTypesProps = {}): FormErrors | undefined {
        return undefined;
    }

    // TODO: Not sure if this should be typeId or what, I'm not there yet...
    fetchData(typeId: IdType, dispatch: Dispatch<{}>) {
        dispatch(getRoles()); // This data needs to always be available for select lists
    }

    getData(typeId: IdType, state: RootState) {
        // TODO: Depending on component state, some of these calls will need to be filtered!
        const roles = getAllRoles(state) || undefined;

        return {
            roles
        };
    }

    getDataFromFormValues(formValues: {}): FormContainerProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }
}
