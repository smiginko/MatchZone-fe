import { inject, Injectable, signal } from '@angular/core';
import { UserModel } from './core/model/user-model';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './core/auth-code-flow.config';
import { UserRoleEnum } from './core/model/user-role-enum';

interface IdentityClaims {
    name?: string;
    email?: string;
    preferred_username?: string;
}

interface AccessTokenClaims {
    realm_access?: {
        roles?: string[];
    };
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private oauthService = inject(OAuthService);
    private user = signal<UserModel | undefined>(undefined);

    constructor() {
        this.oauthService.configure(authCodeFlowConfig);
        this.tryLogin();
    }

    getUser() {
        return this.user.asReadonly();
    }

    login() {
        this.oauthService.loadDiscoveryDocumentAndLogin().then(() => {
            this.user.set(this.mapUserFromClaims());
        });
    }

    logout() {
        this.oauthService.logOut();
        this.user.set(undefined);
    }

    tryLogin() {
        return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            this.user.set(this.mapUserFromClaims());
            return this.user();
        });
    }

    private mapUserFromClaims(): UserModel | undefined {
        const identityClaims = this.oauthService.getIdentityClaims() as IdentityClaims | null;
        const accessTokenClaims = this.getAccessTokenClaims();

        if (!identityClaims) {
            return undefined;
        }

        return {
            name: identityClaims.name ?? '',
            email: identityClaims.email,
            account: identityClaims.preferred_username,
            role: this.findAppRole(accessTokenClaims?.realm_access?.roles),
        };
    }

    private getAccessTokenClaims(): AccessTokenClaims | undefined {
        const accessToken = this.oauthService.getAccessToken();

        if (!accessToken) {
            return undefined;
        }

        const tokenParts = accessToken.split('.');
        if (tokenParts.length < 2) {
            return undefined;
        }

        try {
            const payload = tokenParts[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload) as AccessTokenClaims;
        } catch (error) {
            console.error('Failed to decode access token claims', error);
            return undefined;
        }
    }

    private findAppRole(roles: string[] | undefined): UserRoleEnum | undefined {
        if (!roles?.length) {
            return undefined;
        }

        if (roles.includes(UserRoleEnum.ADMIN)) {
            return UserRoleEnum.ADMIN;
        }

        if (roles.includes(UserRoleEnum.COACH)) {
            return UserRoleEnum.COACH;
        }

        if (roles.includes(UserRoleEnum.CUSTOMER)) {
            return UserRoleEnum.CUSTOMER;
        }

        return undefined;
    }
}