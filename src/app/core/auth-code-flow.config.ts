import {AuthConfig} from "angular-oauth2-oidc";
import {environment} from "../../environments/environment";

export const authCodeFlowConfig: AuthConfig = {
    issuer: environment.keyCloakUrl + '/realms/MatchZone',
    redirectUri: environment.appUrl + '/',
    clientId: 'matchzone-frontend',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    oidc: true,
    showDebugInformation: true,
    requireHttps: false,
};
