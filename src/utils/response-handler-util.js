const HttpStatus = require('http-status-codes');

class ResponseHandlerUtil {
  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleGet(res, data) {
    return res.status(HttpStatus.OK).json({ success: true, data });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   * @param {number} [total]
   */
  static handleList(res, data, total) {
    return res.status(HttpStatus.OK).json({ success: true, data, total });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleCreate(res, data) {
    return res.status(HttpStatus.CREATED).json({ success: true, data });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleUpdate(res, data) {
    return res.status(HttpStatus.OK).json({ success: true, data });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleDelete(res, data) {
    return res.status(HttpStatus.OK).json({ success: true, data });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleSuccess(res, data) {
    return res.status(HttpStatus.OK).json({ success: true, data });
  }

  /**
   * @param {Object} res
   * @param {Object} data
   */
  static handleError(res, data) {
    return res.status(data.status).json({ success: false, ...data });
  }
}

module.exports = ResponseHandlerUtil;
