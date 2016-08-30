/**
 * External dependencies
 */
import debugFactory from 'debug';
import React, { PropTypes, Component } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Button from 'components/button';
import { recordTracksEvent } from 'state/analytics/actions';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSite, isCurrentSitePlan } from 'state/sites/selectors';
import { plansList, PLAN_FREE, PLAN_PERSONAL } from 'lib/plans/constants';
import { storedCardPayment } from 'lib/store-transactions';
import { getStoredCards } from 'state/stored-cards/selectors';
import QueryStoredCards from 'components/data/query-stored-cards';
import { emptyCart } from 'lib/cart-values';
import { add } from 'lib/cart-values/cart-items';
import { submitTransaction } from 'lib/upgrades/actions/checkout';
import PlanPrice from 'my-sites/plan-price';
import PlanIcon from 'components/plans/plan-icon';

const debug = debugFactory( 'calypso:domain-to-plan-nudge' );

class DomainToPlanNudge extends Component {

	constructor() {
		super( ...arguments );
		this.oneClickUpgrade = this.oneClickUpgrade.bind( this );
		this.handleTransactionComplete = this.handleTransactionComplete.bind( this );
	}

	static propTypes = {
		hasFreePlan: PropTypes.bool,
		site: PropTypes.object,
		siteId: PropTypes.number,
		translate: PropTypes.func
	};

	isVisible() {
		const { site, hasFreePlan } = this.props;
		return site &&			//site exists
			site.wpcom_url &&   //has a mapped domain
			hasFreePlan;        //has a free wpcom plan
	}

	handleTransactionComplete( error ) {
		//TODO: match expected analytics calls
		debug( 'transaction complete', error );
	}

	oneClickUpgrade() {
		const { siteId, storedCard } = this.props;
		const newPayment = storedCardPayment( storedCard );
		const transaction = {
			payment: newPayment
		};

		// set this to temporary so we don't clear the existing user cart on the server
		let cart = emptyCart( siteId, { temporary: true } );

		const personalCartItem = {
			free_trial: false,
			is_domain_registration: false,
			product_id: plansList[ PLAN_PERSONAL ].getProductId(),
			product_slug: PLAN_PERSONAL
		};
		cart = add( personalCartItem )( cart );

		debug( 'purchasing with', cart, transaction );

		submitTransaction( { cart, transaction }, this.handleTransactionComplete );
	}

	render() {
		if ( ! this.isVisible() ) {
			return null;
		}

		const { translate, storedCard } = this.props;
		return (
			<Card className="domain-to-plan-nudge">
				<QueryStoredCards />

				<div className="domain-to-plan-nudge__header">
					<div className="domain-to-plan-nudge__header-icon">
						<PlanIcon plan="personal-bundle" />
					</div>
					<div className="domain-to-plan-nudge__header-copy">
						<h3 className="domain-to-plan-nudge__header-title">
							{ translate( 'Upgrade to a Personal Plan and Save!' ) }
						</h3>
						<ul className="domain-to-plan-nudge__header-features">
							<li>
								{ translate( 'Remove all WordPress.com advertising from your website' ) }
							</li>
							<li>
								{ translate( 'Get high quality live chat and priority email support' ) }
							</li>
							<li>
								{ translate( 'Upload up to 3GB of photos and videos' ) }
							</li>
							<li>
								{ translate( 'Bundled with your domain for the best value!' ) }
							</li>
						</ul>
					</div>
				</div>
				<Card className="domain-to-plan-nudge__actions-group">
					<div className="domain-to-plan-nudge__discount-percentage">
						Save 25%
					</div>
					<div className="domain-to-plan-nudge__plan-price-group">
						<PlanPrice rawPrice="35.88" original />
						<PlanPrice rawPrice="29.88" discounted />
					</div>
					<div className="domain-to-plan-nudge__plan-price-timeframe">
						{ translate( 'for one year subscription' ) }
					</div>
					<div className="domain-to-plan-nudge__upgrade-group">
						<Button
							onClick={ this.oneClickUpgrade }
							disabled={ ! storedCard } >
							{ translate( 'Upgrade Now for xx.xx' ) }
						</Button>
						<div className="domain-to-plan-nudge__credit-card-info">
							{ translate( 'Using credit card xxxx' ) }
						</div>
					</div>
				</Card>
			</Card>
		);
	}
}

export default connect(
	( state, props ) => {
		const siteId = props.siteId || getSelectedSiteId( state );
		return {
			hasFreePlan: isCurrentSitePlan(
				state,
				siteId,
				plansList[ PLAN_FREE ].getProductId()
			),
			storedCard: get( getStoredCards( state ), '0' ),
			site: getSite( state, siteId ),
			siteId
		};
	},
	{
		recordTracksEvent
	}
)( localize( DomainToPlanNudge ) );
