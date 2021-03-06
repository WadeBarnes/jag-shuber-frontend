import React from 'react';
import {
    FieldArray
} from 'redux-form';

import { Table, FormGroup, Button, Glyphicon, Well, OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as CellTypes from '../../components/TableColumnCell';
// TODO: Move this into a common location with AdminForm
import DataTableHeaderRow from './DataTableHeaderRow';
import DataTableFilterRow from './DataTableFilterRow';
import DataTableGroupBy from './DataTableGroupBy';

export interface DetailComponentProps {
    parentModel?: any;
    parentModelId?: any;
}

export interface ModalComponentProps {}

export const EmptyDetailRow: React.SFC<DetailComponentProps> = () => (<div />);

// TODO: This is the same as LeavesFieldTableProps... make the other one use a generic?
export interface DataTableProps {
    title: React.ReactNode;
    buttonLabel?: React.ReactNode; // TODO... a hash of values maybe :)
    fieldName: string;
    filterFieldName?: string;
    columns: CellTypes.Types.TableColumnCell[];
    actionsColumn?: CellTypes.Types.TableColumnCell;
    displayHeaderActions?: boolean;
    displayHeaderSave?: boolean;
    // TODO: It would be preferable to supply header actions the same way we use actionsColumn...
    onResetClicked?: Function;
    displayActionsColumn?: boolean;
    expandable?: boolean;
    expandedRows?: Set<number>;
    modalProps?: any;
    modalComponent: React.ReactType<ModalComponentProps>;
    rowComponent: React.ReactType<DetailComponentProps>;
    shouldRenderRow?: (model: any) => boolean;
    shouldDisableRow?: (model: any) => boolean;
    initialValue?: any;
    filterable?: boolean;
    filterRows?: Function;
    groupBy?: any; // TODO: Not sure what this should be yet, just trying something out, see if it works
}

// let RENDER_COUNT = 0;
// let ARR_RENDER_COUNT = 0;

export default class DataTable<T> extends React.Component<DataTableProps> {
    static defaultProps = {
        displayHeaderActions: false,
        displayHeaderSave: true,
        // TODO: It would be preferable to supply header actions the same way we use actionsColumn...
        onResetClicked: () => {},
        displayActionsColumn: true,
        expandable: false,
        // expandedRows: false,
        // TODO: What is up with default props?
        rowComponent: <div />,
        shouldRenderRow: (model: any) => true,
        shouldDisableRow: (model: any) => false,
        modalProps: {},
        modalComponent: <div />,
        actionsColumn: null,
        buttonLabel: 'Create',
        initialValue: {},
        filterable: false,
        filterRows: () => true
    };

    // TODO: It would be cool if we could dynamically supply at least some of these types...
    static MappedTextColumn = CellTypes.MappedText;
    static StaticTextColumn = CellTypes.StaticText;
    static StaticDateColumn = CellTypes.StaticDate;
    static TextFieldColumn = CellTypes.TextField;
    static TextAreaColumn = CellTypes.TextArea;
    static SelectorFieldColumn = CellTypes.SelectorField;
    static CheckboxColumn = CellTypes.Checkbox;
    static DateColumn = CellTypes.Date;
    static TimeColumn = CellTypes.Time;
    static SortOrderColumn = CellTypes.SortOrder;
    static RoleCodeColumn = CellTypes.RoleCode;
    static LeaveSubCodeColumn = CellTypes.LeaveSubCode;
    static ButtonColumn = CellTypes.Button;
    static CancelColumn = CellTypes.Cancel;

    static ActionsColumn = CellTypes.Actions;

    state = {
        expandedRows: new Set(),
        activeRowId: null,
        isModalOpen: false
    };

    constructor(props: DataTableProps) {
        super(props);
    }

    onExpandRowClicked(rowIdx: number) {
        const { expandedRows } = this.state;

        if (!expandedRows.has(rowIdx)) {
            expandedRows.add(rowIdx);
        } else {
            expandedRows.delete(rowIdx);
        }

        this.setState({
            expandedRows: expandedRows
        });
    }

    setActiveRow(id: any) {
        this.setState({
            activeRowId: id
        });
    }

    getModalState(fieldModel: any) {
        const { activeRowId } = this.state;
        return activeRowId && (activeRowId === fieldModel.id);
    }

    // @ts-ignore
    render() {
        const componentInstance = this;

        const {
            fieldName,
            filterFieldName,
            title,
            buttonLabel,
            columns = [],
            actionsColumn,
            displayHeaderActions = false,
            displayHeaderSave = true,
            onResetClicked,
            displayActionsColumn = true,
            expandable = false,
            rowComponent,
            shouldRenderRow,
            shouldDisableRow,
            modalProps,
            modalComponent,
            initialValue,
            filterable,
            filterRows,
            groupBy,

        } = this.props;

        const {
            expandedRows,
            isModalOpen
        } = this.state;

        // return (<div>This would be the Table</div>);

        // TODO: Rename as detail component, cause that's what this really is...
        const RowComponent = rowComponent;
        const ModalComponent = modalComponent;

        // RENDER_COUNT++;
        // console.log('DATATABLE RENDER COUNT: ' + RENDER_COUNT);

        return (
            <div className="data-table">
                {title}
                {filterable && filterFieldName && (
                    <div className="data-table-filter-row">
                        <Table striped={true}>
                            {/* We're doing the filter row as a separate table because nesting it in the FieldArray causes
                            binding issues or issues with initialValues or something...
                            basically, redux-form doesn't like it so we're not gonna force it. */}
                            <thead>
                                <DataTableFilterRow<Partial<any & T>>
                                    onResetClicked={onResetClicked}
                                    fieldName={filterFieldName}
                                    columns={columns}
                                    expandable={expandable}
                                    filterable={filterable}
                                    groupBy={!!groupBy}
                                    displayActionsColumn={displayActionsColumn}
                                />
                            </thead>
                        </Table>
                    </div>
                )}
                <FieldArray<Partial<any & T>>
                    name={fieldName}
                    component={(props) => {
                        // ARR_RENDER_COUNT++;
                        // console.log('DATATABLE FieldArray COMPONENT RENDER COUNT: ' + ARR_RENDER_COUNT);
                        const { fields } = props;

                        const { groupByKey, valueMapLabels } = groupBy || { groupByKey: null, valueMapLabels: {} };

                        // This can be undefined, especially when things are just loading up...
                        // Make sure we use an empty array a a fallback!
                        const rows = fields.getAll() || [];

                        const aggregates = rows.reduce((acc: any , cur: any, idx) => {
                            const value = cur[groupByKey];
                            if (value === undefined || value === null) return acc;
                            if (!acc.hasOwnProperty(value)) {
                                acc[value] = { count: 1 };
                            } else if (acc.hasOwnProperty(value)) {
                                acc[value].count++;
                            }
                            return acc;
                        }, {});

                        /* if (Object.keys(aggregates).length > 0) {
                            console.log(`Group [${fieldName}] by [${groupByKey}]: ${JSON.stringify(aggregates)}`);
                        } */

                        const groupByParams = (groupBy) ? {
                            groupByField: groupByKey,
                            valueMapLabels: valueMapLabels,
                            values: { ...aggregates }
                        } : {};

                        let newRowCount = 0;

                        return (
                            <div className="data-table-header-row">
                                <Table striped={true} >
                                    <thead>
                                        <DataTableHeaderRow
                                            fields={fields}
                                            columns={columns}
                                            expandable={expandable}
                                            filterable={filterable}
                                            groupBy={!!groupBy}
                                            displayHeaderActions={displayHeaderActions}
                                            displayHeaderSave={displayHeaderSave}
                                            displayActionsColumn={displayActionsColumn}
                                            // TODO: Rename this, what kind of button is it :)
                                            buttonLabel={buttonLabel}
                                        />
                                    </thead>

                                    <tbody>
                                    {fields.length === 0 && (
                                        <tr>
                                            <td colSpan={(expandable ? columns.length + 2 : columns.length + 1) + (!!groupBy ? 1 : 0)}>
                                                <Well style={{textAlign: 'center'}}>No records found.</Well>
                                            </td>
                                        </tr>
                                    )}
                                    {fields.length > 0 && fields.map((fieldInstanceName, index) => {
                                        const fieldModel: Partial<any & T> = fields.get(index);
                                        const { id = null, cancelDate = undefined } = fieldModel || {};

                                        if (shouldRenderRow && !shouldRenderRow(fieldModel)) return null;
                                        const disableRow = (shouldDisableRow && shouldDisableRow(fieldModel));

                                        // We can do this because new rows are always at the top of the list
                                        if (!id) newRowCount++;

                                        return (
                                            <>
                                                <tr key={index}>
                                                    {groupBy && (
                                                        <>
                                                        {/* <DataTableGroupBy fieldName={fieldName} newRowCount={newRowCount} rowIndex={index} params={groupByParams} /> */}
                                                        {/* Add fieldName prop to enable debugging logs */}
                                                        <DataTableGroupBy newRowCount={newRowCount} rowIndex={index} params={groupByParams} />
                                                        </>
                                                    )}
                                                    {expandable && (
                                                        <td>
                                                            <FormGroup>
                                                                <Button
                                                                    bsStyle="link"
                                                                    onClick={() => this.onExpandRowClicked(index)}
                                                                    style={{color: '#666666'}}
                                                                >
                                                                    {id && expandedRows && !expandedRows.has(index) && (
                                                                        <Glyphicon glyph="triangle-right"/>
                                                                    )}
                                                                    {id && expandedRows && expandedRows.has(index) && (
                                                                        <Glyphicon glyph="triangle-bottom"/>
                                                                    )}
                                                                </Button>
                                                            </FormGroup>
                                                        </td>
                                                    )}
                                                    {
                                                        columns
                                                            .map((col, colIndex) => {
                                                                const Column = cancelDate !== undefined
                                                                    ? col.CanceledRender
                                                                    : col.FormRenderer;

                                                                return (
                                                                    <td key={colIndex}>
                                                                        <Column
                                                                            disabled={disableRow}
                                                                            model={fieldModel}
                                                                            fieldInstanceName={fieldInstanceName}
                                                                            fields={fields}
                                                                            index={index}
                                                                            callbackContext={componentInstance}
                                                                        />
                                                                    </td>
                                                                );
                                                            })
                                                    }
                                                    {displayActionsColumn && (() => {
                                                        const rowActionsColumn = actionsColumn || CellTypes.Actions();

                                                        const Column = cancelDate !== undefined
                                                            ? rowActionsColumn.CanceledRender
                                                            : rowActionsColumn.FormRenderer;

                                                        // TODO: Make this use a class?
                                                        // Flex align end to make sure buttons are right-aligned
                                                        return (
                                                            <td style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }}>
                                                                <Column
                                                                    disabled={disableRow}
                                                                    model={fieldModel}
                                                                    fieldInstanceName={fieldInstanceName}
                                                                    fields={fields}
                                                                    index={index}
                                                                    callbackContext={componentInstance}
                                                                />
                                                            </td>
                                                        );
                                                    })()}
                                                </tr>
                                                {expandable && expandedRows && expandedRows.has(index) && (
                                                    <tr key={index * 2}>
                                                        <td>{/* Nest the Table for sub-rows */}</td>
                                                        {/* tslint:disable-next-line:max-line-length */}
                                                        <td style={{margin: '0', padding: '0'}}
                                                            colSpan={expandable ? columns.length + 1 : columns.length}>
                                                            <RowComponent
                                                                parentModel={fieldModel}
                                                                parentModelId={fieldModel.id}
                                                            />
                                                        </td>
                                                    </tr>
                                                )}
                                                <ModalComponent
                                                    isOpen={this.getModalState(fieldModel)}
                                                    onClose={() => this.setActiveRow(null)}
                                                    {...modalProps}
                                                    parentModel={fieldModel}
                                                    parentModelId={fieldModel.id}
                                                />
                                            </>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }

}
