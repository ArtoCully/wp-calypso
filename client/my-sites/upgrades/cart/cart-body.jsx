/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var CartItems = require( './cart-items' ),
	CartCoupon = require( './cart-coupon' ),
	CartTotal = require( './cart-total' );

var CartBody = React.createClass( {
	propTypes: {
		collapse: React.PropTypes.bool
	},
	getDefaultProps: function() {
		return {
			collapse: false,
			showCoupon: false
		};
	},

	render: function() {
		return (
			<div className="cart-body">
				<CartItems
					collapse={ this.props.collapse }
					cart={ this.props.cart }
					selectedSite={ this.props.selectedSite } />
				<CartTotal cart={ this.props.cart } />
				{ this.optionalCoupon() }
			</div>
		);
	},

	optionalCoupon: function() {
		if ( ! this.props.showCoupon ) {
			return;
		}

		return <CartCoupon cart={ this.props.cart } />;
	}
} );

module.exports = CartBody;
