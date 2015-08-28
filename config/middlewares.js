
/**
 * Expose
 */

exports.jsend = function(req, res, next) {
	res.success = function(data) {
		this.status(200)
			.send({
				status: 'success',
				data: data
			});
	}

	res.error = function(message, code) {
		code = code || 400;
		this.status(code)
			.send({
				status: 'error',
				code: code,
				message: message
			});
	}

	next();
}


