"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["PUT"] = "put";
    HttpMethod["POST"] = "post";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["INVALID_REQUEST"] = "invalid_request";
    AuthErrorCode["INVALID_CLIENT"] = "invalid_client";
    AuthErrorCode["INVALID_GRANT"] = "invalid_grant";
    AuthErrorCode["UNAUTHORIZED_CLIENT"] = "unauthorized_client";
    AuthErrorCode["UNSUPPORTED_GRANT_TYPE"] = "unsupported_grant_type";
    AuthErrorCode["INVALID_SCOPE"] = "invalid_scope";
})(AuthErrorCode = exports.AuthErrorCode || (exports.AuthErrorCode = {}));
