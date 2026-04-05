class RequestHandler {
    sendSuccess(req, res, message) {
      return (data) => res.json({ success: true, message, data });
    }
    sendError(req, res, error) {
      return res.status(400).json({ success: false, message: error.message || error });
    }
    validateJoi(err, errorMessage) {
      if (err) {
        console.log(`error in validating request : ${errorMessage}`, 'warn');
        throw new Error("Payload validation failed: " + errorMessage);
      }
    }
  }
  module.exports = RequestHandler;
  