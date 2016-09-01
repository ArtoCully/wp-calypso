/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import identity from 'lodash/identity';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';
import VideoPressUpgradeNudge from 'blocks/upgrade-nudge-expanded';
import { PLAN_PREMIUM, FEATURE_VIDEO_UPLOADS } from 'lib/plans/constants';

export const MediaLibraryListPlanPromo = ( { translate } ) => (
	<div className="media-library__videopress-nudge-container">
		<VideoPressUpgradeNudge
			plan={ PLAN_PREMIUM }
			title={ translate( 'Upgrade to a Premium Plan and Enable VideoPress' ) }
			subtitle={ translate( 'By upgrading to a Premium Plan you\'ll enable VideoPress support on your site.' ) }
			highlightedFeature={ FEATURE_VIDEO_UPLOADS }
			eventName="calypso_video_uploads_upgrade_nudge_impression"
			benefits={ [
				translate( 'Upload videos to your site with an interface designed specifically for WordPress.' ),
				translate( 'Present videos using a lightweight and responsive player that is ad-free and unbranded.' ),
				translate( 'See where your videos have been shared as well as stats for individual and overall video plays.' )
			] }
		/>
	</div>
);

MediaLibraryListPlanPromo.propTypes = {
	translate: PropTypes.func
};

MediaLibraryListPlanPromo.defaultProps = {
	translate: identity
};

export default localize( MediaLibraryListPlanPromo );
