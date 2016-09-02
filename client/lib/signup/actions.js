/**
 * External dependencies
 */
import defer from 'lodash/defer';

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import analytics from 'lib/analytics';

const SignupActions = {
	fetchCachedSignup() {
		Dispatcher.handleViewAction( { type: 'FETCH_CACHED_SIGNUP' } );
	},

	saveSignupStep( step ) {
		analytics.tracks.recordEvent( 'calypso_signup_actions_save_step', { step: step.stepName } );

		// there are some conditions in which a step could be saved/processed in the same event loop
		// so we should defer the action
		defer( () => {
			Dispatcher.handleViewAction( {
				type: 'SAVE_SIGNUP_STEP',
				data: step
			} );
		} );
	},

	submitSignupStep( step, errors, providedDependencies ) {
		analytics.tracks.recordEvent( 'calypso_signup_actions_submit_step', { step: step.stepName } );

		Dispatcher.handleViewAction( {
			type: 'SUBMIT_SIGNUP_STEP',
			data: step,
			errors: undefined === errors ? [] : errors,
			providedDependencies: providedDependencies
		} );
	},

	processSignupStep( step, errors, providedDependencies ) {
		analytics.tracks.recordEvent( 'calypso_signup_actions_process_step', { step: step.stepName } );

		// deferred because a step can be processed as soon as it is submitted
		defer( () => {
			Dispatcher.handleViewAction( {
				type: 'PROCESS_SIGNUP_STEP',
				data: step,
				errors: undefined === errors ? [] : errors,
				providedDependencies: providedDependencies
			} );
		} );
	},

	processedSignupStep( step, errors, providedDependencies ) {
		const { stepName } = step;

		analytics.tracks.recordEvent( 'calypso_signup_actions_complete_step', { step: stepName } );

		if ( stepName === 'survey-user' ) {
			// Fire after a new user registers.
			analytics.tracks.recordEvent( 'calypso_user_registration_complete' );
			analytics.ga.recordEvent( 'Signup', 'calypso_user_registration_complete' );
		}

		Dispatcher.handleViewAction( {
			type: 'PROCESSED_SIGNUP_STEP',
			data: step,
			errors: undefined === errors ? [] : errors,
			providedDependencies: providedDependencies
		} );
	}
};

export default SignupActions;
