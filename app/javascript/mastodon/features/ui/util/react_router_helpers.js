import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import ColumnLoading from '../components/column_loading';
import BundleColumnError from '../components/bundle_column_error';
import BundleContainer from '../containers/bundle_container';

// Small wrapper to pass multiColumn to the route components
export const WrappedSwitch = ({ multiColumn, children }) => (
  <Switch>
    {React.Children.map(children, child => React.cloneElement(child, { multiColumn }))}
  </Switch>
);

WrappedSwitch.propTypes = {
  multiColumn: PropTypes.bool,
  children: PropTypes.node,
};

// Small Wraper to extract the params from the route and pass
// them to the rendered component, together with the content to
// be rendered inside (the children)
export class WrappedRoute extends React.Component {

  static propTypes = {
    component: PropTypes.func.isRequired,
    content: PropTypes.node,
    multiColumn: PropTypes.bool,
  }

  renderComponent = ({ match }) => {
    this.match = match; // Needed for this.renderBundle

    const { component } = this.props;

    return (
      <BundleContainer fetchComponent={component} loading={this.renderLoading} error={this.renderError}>
        {this.renderBundle}
      </BundleContainer>
    );
  }

  renderLoading = () => {
    return <ColumnLoading />;
  }

  renderError = (props) => {
    return <BundleColumnError {...props} />;
  }

  renderBundle = (Component) => {
    const { match: { params }, props: { content, multiColumn } } = this;

    return <Component params={params} multiColumn={multiColumn}>{content}</Component>;
  }

  render () {
    const { component: Component, content, ...rest } = this.props;

    return <Route {...rest} render={this.renderComponent} />;
  }

}
