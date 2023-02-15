export class GenericAPIErrors {
  static readonly InternalErrorCode = class {
    static readonly BAD_REQUEST = '1210002';
    static readonly INTERNAL_SERVER_ERROR = '1210001';
    static readonly UNAUTHORIZED = '1210003';
    static readonly FORBIDDEN = '1210004';
  };
}
