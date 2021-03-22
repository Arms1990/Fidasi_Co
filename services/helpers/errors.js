class RuleException extends Error {
    constructor(statusCode, message) {
      super(statusCode, message);
      this.name = "Rule Error";
      this.message = message;
      this.code = statusCode;
    }
}

class PageNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "Page Not Found Error";
    this.message = message;
    this.code = 404;
  }
}

class PageDetailNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "Page Detail Not Found Error";
    this.message = message;
    this.code = 404;
  }
}


module.exports = {
    RuleException,
    PageNotFoundException,
    PageDetailNotFoundException
};