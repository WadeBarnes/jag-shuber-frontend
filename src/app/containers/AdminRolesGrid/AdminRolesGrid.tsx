import React from 'react';
import {
    Alert, Table
} from 'react-bootstrap';
import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import { RootState } from '../../store';
import { IdType } from '../../api';

import {
    DataTableBase,
    DataTableProps,
    // DataTableSectionPlugin
} from '../../components/Table/DataTable';

import RolesFieldTable from './RolesFieldTable';

// import { fromTimeString } from 'jag-shuber-api';

export interface AdminRolesProps extends DataTableProps {}

export interface AdminRolesDisplayProps extends DataTableProps {
    data: any[];
}

class AdminRolesDisplay extends React.PureComponent<AdminRolesDisplayProps, any> {
    render() {
        const { data = [{ id: 1 }, { id: 2 }, { id: 3 }] } = this.props;
        return (
            <div>
                {/*<h3>Roles</h3>*/}
                <Table responsive={true} striped={true} >
                    <thead>
                        <tr>
                            <th className="text-left">Role Name</th>
                            <th className="text-left">Description</th>
                            <th className="text-left">Start Date</th>
                            <th className="text-left">End Date</th>
                            <th className="text-left">Type</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(r => {
                            return (
                                <tr key={r.id}>
                                    <td>Test Role</td>
                                    <td>Ipsum Lorem Dolor</td>
                                    <td>{new Date().toLocaleDateString()}</td>
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

export default class AdminRolesGrid extends DataTableBase<AdminRolesProps> {
    name = 'roles';
    formFieldNames = { default: 'roles'};
    title: string = 'User Roles';
    FormComponent = (props: DataTableProps<AdminRolesProps>) => (
        <div>
            <RolesFieldTable
                fieldName={this.formFieldNames.default}
                title={<h3>Assigned Roles</h3>}
                columns={[
                    RolesFieldTable.RoleCodeColumn(),
                    RolesFieldTable.DateColumn('Start Date', 'startDate'),
                    RolesFieldTable.DateColumn('End Date', 'endDate'),
                    RolesFieldTable.CancelColumn()
                ]}
            />
        </div>
    )

    // TODO: Figure out why Fragments aren't working...
    DisplayComponent = ({ data = {}}: DataTableProps<AdminRolesProps>) => (
        <div>
            <Alert>No roles exist</Alert>
            <AdminRolesDisplay objectId={'abcd-1234-abcd-1234'} data={[]} />
        </div>
    )

    validate(values: AdminRolesProps = {}): FormErrors | undefined {
        return undefined;
    }

    fetchData(sheriffId: IdType, dispatch: Dispatch<{}>) {
        // TODO: Implement getRoles
        // dispatch(getRoles());
    }

    getData(roleId: IdType, state: RootState) {
        return {
        };
    }

    getDataFromFormValues(formValues: {}): DataTableProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }
}