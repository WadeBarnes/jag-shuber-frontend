import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { AlternateAssignment } from '../api';
import {
    allEffectiveAlternateAssignmentTypes,
    allAlternateAssignmentTypes
} from '../modules/assignments/selectors';
import Selector, { SelectorProps } from '../components/FormElements/Selector';

interface AlternateAssignmentTypeListStateProps {
    alternateAssignmentTypes: AlternateAssignment[];
}

class AlternateAssignmentTypeList extends React.PureComponent<
    SelectorProps &
    AlternateAssignmentTypeListStateProps> {

    render() {
        const { alternateAssignmentTypes = [], ...rest } = this.props;
        const selectorValues = alternateAssignmentTypes.map(type => ({ key: type.id as string, value: type.description as string }));
        return (
            <Selector
                data={selectorValues}
                {...rest}
            />
        );
    }

}

const mapStateToProps = (state: RootState) => {
    return {
        alternateAssignmentTypes: allEffectiveAlternateAssignmentTypes()(state)
    };
};

// tslint:disable-next-line:max-line-length
export default connect<AlternateAssignmentTypeListStateProps, {}, SelectorProps>(
    mapStateToProps
)(AlternateAssignmentTypeList);
