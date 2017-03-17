'use strict';

module.exports = rawOpts => {
	const defaultOpts = {
		Escher: require('escher-auth')
	};

	const opts = Object.assign({}, defaultOpts, rawOpts);

	opts._instance = new opts.Escher({
		credentialScope: opts.credentialScope || ''
	});

	return (req, res, next) => {
		try {
			req.escher = req.escher || opts._instance;

			/**
			 * The following is a dirty little hack to make sure Escher validates
			 * the date signature against the request's actual date. Escher sets the
			 * date in its constructor, and does not expose a public method to update
			 * it, but I wanted to avoid having to reinstantiate Escher every single
			 * time a request is validated.
			 */
			req.escher._config = req.escher._config || {};
			req.escher._config.date = new Date();

			req.escher.authenticate(req, opts.keyDb);
			next();
		} catch (err) {
			res.status(401);
			next(err);
		}
	};
};
