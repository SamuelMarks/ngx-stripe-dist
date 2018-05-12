import { Observable } from 'rxjs';
import { Options, StripeJS } from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { SourceData, SourceParams, SourceResult } from '../interfaces/sources';
import { BankAccount, BankAccountData, CardDataOptions, Pii, PiiData, TokenResult } from '../interfaces/token';
import { PaymentRequestOptions } from '../interfaces/payment-request';
import { StripeServiceInterface } from './stripe-instance.interface';
import { StripeInstance } from './stripe-instance.class';
import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader } from './api-loader.service';
export declare class StripeService implements StripeServiceInterface {
    private key;
    private options;
    private loader;
    private window;
    private stripe;
    constructor(key: string, options: Options, loader: LazyStripeAPILoader, window: WindowRef);
    getStripeReference(): Observable<any>;
    getInstance(): StripeJS;
    setKey(key: string, options?: Options): StripeInstance;
    changeKey(key: string, options?: Options): StripeInstance;
    elements(options?: ElementsOptions): Observable<Elements>;
    createToken(a: Element | BankAccount | Pii, b: CardDataOptions | BankAccountData | PiiData | undefined): Observable<TokenResult>;
    createSource(a: Element | SourceData, b?: SourceData | undefined): Observable<SourceResult>;
    retrieveSource(source: SourceParams): Observable<SourceResult>;
    paymentRequest(options: PaymentRequestOptions): any;
}
