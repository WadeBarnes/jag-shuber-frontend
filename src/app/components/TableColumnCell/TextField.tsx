import * as React from 'react';
import { Field } from 'redux-form';

import { Glyphicon } from 'react-bootstrap';

import * as Types from './types';

import TextField from '../../components/FormElements/TextField';

import LeaveTrainingSubCodeSelector from '../../containers/LeaveTrainingSubCodeSelector';
import LeaveSubCodeDisplay from '../../containers/LeaveSubCodeDisplay';

const TextFieldColumn = (label?: string, options?: Types.FieldColumnOptions): Types.TableColumnCell => {
    label = label || '';

    const displayInfo = (options && options.displayInfo) ? options.displayInfo : false;

    return {
        title: label,
        FormRenderer: ({ fieldInstanceName }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Field
                    name={`${fieldInstanceName}.leaveSubCode`}
                    component={(p) => <TextField
                        {...p}
                        showLabel={false}
                        // TODO: Provide this via props or something so we can use custom codes...
                    />}
                    label={label}
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
        CanceledRender: ({ leave }) => (<div>TextField Cancelled Display</div>)
    };
};

export default TextFieldColumn;