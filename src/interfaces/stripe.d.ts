import { InjectionToken } from '@angular/core';
import { Elements, ElementsOptions } from './elements';
import { Element } from './element';
import { BankAccount, BankAccountData, CardDataOptions, Pii, PiiData, TokenResult } from './token';
import { SourceData, SourceParams, SourceResult } from './sources';
import { PaymentRequestOptions } from './payment-request';
export declare const STRIPE_PUBLISHABLE_KEY: InjectionToken<string>;
export declare const STRIPE_OPTIONS: InjectionToken<Options>;
export interface StripeJS {
    elements(options?: ElementsOptions): Elements;
    createToken(el: Element, cardData?: CardDataOptions): Promise<TokenResult>;
    createToken(account: BankAccount, bankAccountData: BankAccountData): Promise<TokenResult>;
    createToken(pii: Pii, piiData: PiiData): Promise<TokenResult>;
    createSource(el: Element, sourceData?: SourceData): Promise<SourceResult>;
    createSource(sourceData: SourceData): Promise<SourceResult>;
    retrieveSource(source: SourceParams): Promise<SourceResult>;
    paymentRequest(options: PaymentRequestOptions): any;
}
export interface Options {
    stripeAccount?: string;
}
