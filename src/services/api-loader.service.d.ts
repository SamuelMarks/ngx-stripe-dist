import { Observable } from 'rxjs';
import { WindowRef } from './window-ref.service';
import { DocumentRef } from './document-ref.service';
export interface Status {
    loaded: boolean;
    loading: boolean;
    error: boolean;
}
export declare class LazyStripeAPILoader {
    private platformId;
    private window;
    private document;
    private status;
    constructor(platformId: any, window: WindowRef, document: DocumentRef);
    asStream(): Observable<Status>;
    isReady(): boolean;
    load(): void;
}
