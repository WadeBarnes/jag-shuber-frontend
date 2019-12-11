import React from 'react';
import { connect } from 'react-redux';

import { SelectorProps } from '../../components/FormElements/Selector';

import { FrontendScope } from '../../api';

import { RootState } from '../../store';
import { getAllFrontendScopes } from '../../modules/roles/selectors';

interface FrontendScopeCodeDisplayStateProps {
    frontendScopes?: FrontendScope[];
}

class FrontendScopeCodeDisplay extends React.PureComponent<
    FrontendScopeCodeDisplayStateProps & SelectorProps> {

    render() {
        const {
            frontendScopes = [],
            ...restProps
        } = this.props;
        const values = frontendScopes.map(frontendScope => ({ key: frontendScope.id as string, value: frontendScope.scopeCode as string }));
        if (values.length < 1) return null;
        return (
            <h6 className="table-cell-text">{values[0].value}</h6>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        frontendScopes: getAllFrontendScopes(state)
    };
};

// tslint:disable-next-line:max-line-length
export default connect<FrontendScopeCodeDisplayStateProps, {}, SelectorProps>(
    mapStateToProps
)(FrontendScopeCodeDisplay);
