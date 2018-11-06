export const enum HttpMethod {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    DELETE = 'delete'
}

export interface EndpointDefinition {
    method: HttpMethod;
    description?: string;
    path: string;
    schema: object;
    handler: ((ctx, next) => Promise<void>)[];
}

export const enum AuthErrorCode {
    INVALID_REQUEST = 'invalid_request',
    INVALID_CLIENT = 'invalid_client',
    INVALID_GRANT = 'invalid_grant',
    UNAUTHORIZED_CLIENT = 'unauthorized_client',
    UNSUPPORTED_GRANT_TYPE = 'unsupported_grant_type',
    INVALID_SCOPE = 'invalid_scope'
}
