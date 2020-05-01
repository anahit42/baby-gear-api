class CustomError extends Error {
  constructor(props) {
    const { message, status } = props;
    super();

    this.message = message;
    this.status = status;
    this.customError = true;
  }
}

module.exports = CustomError;
