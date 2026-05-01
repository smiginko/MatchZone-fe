import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {DefaultOAuthInterceptor, provideOAuthClient} from "angular-oauth2-oidc";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
    providers: [provideBrowserGlobalErrorListeners(),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes),
        provideOAuthClient({
            resourceServer: {
                allowedUrls: [environment.beUrl],
                sendAccessToken: true,
            },
        }),
        { provide: HTTP_INTERCEPTORS, useClass: DefaultOAuthInterceptor, multi: true },
        ],
};