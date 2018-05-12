import { EventEmitter, OnInit } from '@angular/core';
import { Element as StripeElement, ElementEventType } from '../interfaces/element';
import { StripeService } from '../services/stripe.service';
export declare class StripeCardComponent implements OnInit {
    private stripeService;
    card: EventEmitter<StripeElement>;
    on: EventEmitter<{
        type: ElementEventType;
        event: any;
    }>;
    private stripeCard;
    private element;
    private options$;
    private elementsOptions$;
    private stripe$;
    constructor(stripeService: StripeService);
    private options;
    private elementsOptions;
    private stripe;
    ngOnInit(): void;
    getCard(): StripeElement | null;
}
