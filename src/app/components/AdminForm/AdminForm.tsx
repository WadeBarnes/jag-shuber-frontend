import React from 'react';
import { IdType } from '../../api';
import { FormContainer, FormContainerProps, FormContainerBase } from '../Form/FormContainer';
import { InjectedFormProps } from 'redux-form';

import Form from '../FormElements/Form';
import AdminFormTabs from './AdminFormTabs';
import './AdminForm.css';

export interface AdminFormProps {
    sheriffId?: IdType; // TODO: This doesn't need to be in here any more... only in user roles
    isEditing?: boolean;
    plugins?: FormContainerBase[];
    text?: string;
    pluginsWithErrors?: { [key: string]: boolean };
    selectedSection?: string;
    onSelectSection?: (sectionName: string) => any;
    // onSelectSection?: (sectionName: string) => void;
    setPluginFilters?: Function;
    showSheriffProfileModal?: (sheriffId: IdType, isEditing: boolean, sectionName?: string) => {};
    onSubmitSuccess?: () => void;
    initialValues?: any;
    currentLocation?: string;
    showTabs?: boolean;
    templateComponent?: any;
}

export default class AdminForm extends React.PureComponent<InjectedFormProps<any, AdminFormProps> & AdminFormProps>{
    private handleSelectSection(sectionName: string) {
        const { onSelectSection } = this.props;
        if (onSelectSection) {
            onSelectSection(sectionName);
        }
    }

    /*shouldComponentUpdate(nextProps: any, nextState: any){
        return true;
    }*/

    renderPlugin(plugin: FormContainer) {
        const { initialValues = {}, isEditing = false, setPluginFilters, showSheriffProfileModal, currentLocation } = this.props;

        const pluginProps: FormContainerProps = {
            // sheriffId,
            currentLocation: currentLocation,
            data: initialValues[plugin.reduxFormKey],
            setPluginFilters,
            showSheriffProfileModal
        };

        return isEditing
            ? plugin.renderFormFields(pluginProps)
            : plugin.renderDisplay(pluginProps);
    }

    renderPlugins() {
        const {
            plugins = [],
            pluginsWithErrors = {},
            showTabs = true,
            templateComponent = AdminFormTabs
        } = this.props;

        const TemplateComponent = templateComponent;

        let { selectedSection } = this.props;

        const nonSectionPlugins = plugins.filter(p => !(p instanceof FormContainerBase));
        // tslint:disable-next-line:max-line-length
        const sectionPlugins = plugins.filter(p => p instanceof FormContainerBase) as FormContainerBase<any>[];
        selectedSection = selectedSection ? selectedSection : sectionPlugins[0] ? sectionPlugins[0].name : '';

        const handleSelectSection = this.handleSelectSection.bind(this);
        const renderPlugin = this.renderPlugin.bind(this);

        return (
            <div>
                {nonSectionPlugins.map((p) => this.renderPlugin(p))}
                <TemplateComponent
                    selectedSection={selectedSection}
                    sectionPlugins={sectionPlugins}
                    pluginsWithErrors={pluginsWithErrors}
                    handleSelectSection={handleSelectSection}
                    renderPlugin={renderPlugin}
                />
            </div>
        );
    }

    renderForm() {
        return (
            <Form {...this.props}>
                {this.renderPlugins()}
            </Form>
        );
    }

    renderDisplay() {
        return this.renderPlugins();
    }

    render() {
        const { isEditing = false } = this.props;
        return (
            <div className="sheriff-profile">
                {isEditing ? this.renderForm() : this.renderDisplay()}
            </div>
        );
    }
}
