import { SignOptions } from 'jsonwebtoken';
declare const _default: {
    node_env: string;
    port: number;
    database_url: string | undefined;
    frontend_url: string;
    jwt: {
        secret: string;
        expires_in: SignOptions["expiresIn"];
    };
};
export default _default;
