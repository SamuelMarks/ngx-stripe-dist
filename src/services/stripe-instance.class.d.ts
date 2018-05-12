import { Observable } from 'rxjs';
import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader } from './api-loader.service';
import { Options, StripeJS } from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { SourceData, SourceParams, SourceResult } from '../interfaces/sources';
import { BankAccount, BankAccountData, CardDataOptions, Pii, PiiData, TokenResult } from '../interfaces/token';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';
export declare class StripeInstance implements StripeServiceInterface {
    private loader;
    private window;
    private key;
    private options;
    private stripe$;
    constructor(loader: LazyStripeAPILoader, window: WindowRef, key: string, options?: Options);
    getInstance(): StripeJS | null | undefined;
    elements(options?: ElementsOptions): Observable<Elements>;
    createToken(a: Element | BankAccount | Pii, b: CardDataOptions | BankAccountData | PiiData | undefined): Observable<TokenResult>;
    createSource(a: Element | SourceData, b?: SourceData | undefined): Observable<SourceResult>;
    retrieveSource(source: SourceParams): Observable<SourceResult>;
    paymentRequest(options: PaymentRequestOptions): any;
}
