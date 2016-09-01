/**
 * External dependencies
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import Button from 'components/button';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteThemeShowcasePath } from 'state/sites/selectors';

class EditorThemeHelp extends PureComponent {
	static propTypes = {
		themeHelpPath: PropTypes.string,
		classname: PropTypes.string,
	};

	render() {
		const { translate, themeHelpPath, className } = this.props;

		if ( ! themeHelpPath ) {
			return null;
		}

		return (
			<Button className={ className } compact borderless href={ themeHelpPath }>
				<Gridicon icon="help-outline" /> { translate( 'Need help setting up your site?' ) }
			</Button>
		);
	}
}

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );

		return {
			themeHelpPath: getSiteThemeShowcasePath( state, siteId )
		};
	}
)( localize( EditorThemeHelp ) );
