import * as React from 'react';
import { Field } from 'redux-form';

import { Glyphicon } from 'react-bootstrap';

import * as Types from './types';

const StaticTextColumn = (label?: string, options?: Types.FieldColumnOptions): Types.TableColumnCell => {
    label = label || '';

    const displayInfo = (options && options.displayInfo) ? options.displayInfo : false;
    const fieldName = (options && options.fieldName) ? options.fieldName : 'textField';

    return {
        title: label,
        FormRenderer: ({ fieldInstanceName }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Field
                    // TODO: Pass in field name as prop or whatever
                    name={`${fieldInstanceName}.${fieldName}`}
                    component={(p) => <h6 className="table-cell-text">{p.input.value}</h6>}
                />
                {/* This wrapper just adds equal spacing to the previous form group */}
                {/* TODO: We need spacing utils */}
                {displayInfo && (
                    <div className="form-group" style={{ marginLeft: '0.5rem' }}>
                        <Glyphicon glyph="info-sign" />
                    </div>
                )}
            </div>
        ),
        CanceledRender: ({ model }) => (<div>StaticText Cancelled Display</div>)
    };
};

export default StaticTextColumn;
