import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { JailRoleCode } from '../api';
import {
    allEffectiveJailRoles,
    allJailRoles
} from '../modules/assignments/selectors';
import Selector, { SelectorProps } from '../components/FormElements/Selector';

interface JailRoleListStateProps {
    jailRoles: JailRoleCode[];
}

class JailRoleList extends React.PureComponent<
    SelectorProps & JailRoleListStateProps> {

    render() {
        const { jailRoles = [], ...restProps } = this.props;
        const selectorValues = jailRoles.map(role => ({ key: role.id as string, value: role.description as string }));
        return (
            <Selector {...restProps} data={selectorValues} />
        );
    }

}

const mapStateToProps = (state: RootState) => {
    return {
        jailRoles: allEffectiveJailRoles()(state)
    };
};

// tslint:disable-next-line:max-line-length
export default connect<JailRoleListStateProps, {}, SelectorProps>(
    mapStateToProps
)(JailRoleList);
