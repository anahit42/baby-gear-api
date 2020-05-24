const FileType = require('file-type');

class FileManagerLib {
  static getFileType(file) {
    return FileType.fromBuffer(file.buffer);
  }
}

module.exports = FileManagerLib;
