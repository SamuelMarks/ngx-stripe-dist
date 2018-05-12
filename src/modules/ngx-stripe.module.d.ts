import { ModuleWithProviders } from '@angular/core';
import { Options } from '../interfaces/stripe';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
export declare class NgxStripeModule {
    static forRoot(publishableKey?: string, options?: Options): ModuleWithProviders;
}
