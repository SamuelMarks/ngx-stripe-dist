import { __read } from 'tslib';
import { Inject, Injectable, PLATFORM_ID, InjectionToken, Component, EventEmitter, Input, Output, ViewChild, NgModule } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

var WindowRef = /** @class */ (function () {
    function WindowRef(platformId) {
        this.platformId = platformId;
    }
    WindowRef.prototype.getNativeWindow = function () {
        if (isPlatformBrowser(this.platformId)) {
            return window;
        }
        return ({});
    };
    return WindowRef;
}());
WindowRef.decorators = [
    { type: Injectable },
];
WindowRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
]; };
var DocumentRef = /** @class */ (function () {
    function DocumentRef(platformId) {
        this.platformId = platformId;
    }
    DocumentRef.prototype.getNativeDocument = function () {
        if (isPlatformBrowser(this.platformId)) {
            return document;
        }
        return ({});
    };
    return DocumentRef;
}());
DocumentRef.decorators = [
    { type: Injectable },
];
DocumentRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
]; };
var LazyStripeAPILoader = /** @class */ (function () {
    function LazyStripeAPILoader(platformId, window, document) {
        this.platformId = platformId;
        this.window = window;
        this.document = document;
        this.status = new BehaviorSubject({
            error: false,
            loaded: false,
            loading: false
        });
    }
    LazyStripeAPILoader.prototype.asStream = function () {
        this.load();
        return this.status.asObservable();
    };
    LazyStripeAPILoader.prototype.isReady = function () {
        return this.status.getValue().loaded;
    };
    LazyStripeAPILoader.prototype.load = function () {
        var _this = this;
        if (isPlatformServer(this.platformId)) {
            return;
        }
        var status = this.status.getValue();
        if (this.window.getNativeWindow().hasOwnProperty('Stripe')) {
            this.status.next({
                error: false,
                loaded: true,
                loading: false
            });
        }
        else if (!status.loaded && !status.loading) {
            this.status.next(Object.assign({}, status, { loading: true }));
            var script = this.document.getNativeDocument().createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = 'https://js.stripe.com/v3/';
            script.onload = function () {
                _this.status.next({
                    error: false,
                    loaded: true,
                    loading: false
                });
            };
            script.onerror = function () {
                _this.status.next({
                    error: true,
                    loaded: false,
                    loading: false
                });
            };
            this.document.getNativeDocument().body.appendChild(script);
        }
    };
    return LazyStripeAPILoader;
}());
LazyStripeAPILoader.decorators = [
    { type: Injectable },
];
LazyStripeAPILoader.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: WindowRef, },
    { type: DocumentRef, },
]; };
var STRIPE_PUBLISHABLE_KEY = new InjectionToken('Stripe Publishable Key');
var STRIPE_OPTIONS = new InjectionToken('Stripe Options');
function isSourceData(sourceData) {
    return 'type' in sourceData;
}
function isBankAccount(account) {
    return account === 'bank_account';
}
function isBankAccountData(bankAccountData) {
    return ('country' in bankAccountData &&
        'currency' in bankAccountData &&
        'routing_number' in bankAccountData &&
        'account_number' in bankAccountData &&
        'account_holder_name' in bankAccountData &&
        'account_holder_type' in bankAccountData &&
        (bankAccountData.account_holder_type === 'individual' ||
            bankAccountData.account_holder_type === 'company'));
}
function isPii(pii) {
    return pii === 'pii';
}
function isPiiData(piiData) {
    return 'personal_id_number' in piiData;
}
var StripeInstance = /** @class */ (function () {
    function StripeInstance(loader, window, key, options) {
        var _this = this;
        this.loader = loader;
        this.window = window;
        this.key = key;
        this.options = options;
        this.stripe$ = new BehaviorSubject(undefined);
        this.loader
            .asStream()
            .pipe(filter(function (status) { return status.loaded === true; }), first(), map(function () { return ((_this.window.getNativeWindow())).Stripe; }))
            .subscribe(function (Stripe) {
            var stripe = _this.options
                ? ((Stripe(_this.key, _this.options)))
                : ((Stripe(_this.key)));
            _this.stripe$.next(stripe);
        });
    }
    StripeInstance.prototype.getInstance = function () {
        return (this.stripe$.getValue());
    };
    StripeInstance.prototype.elements = function (options) {
        return this.stripe$
            .asObservable()
            .pipe(filter(function (stripe) { return Boolean(stripe); }), map(function (stripe) { return ((stripe)).elements(options); }), first());
    };
    StripeInstance.prototype.createToken = function (a, b) {
        return this.stripe$
            .asObservable()
            .pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var stripe = (s);
            if (isBankAccount(a) && isBankAccountData(b)) {
                return fromPromise(stripe.createToken(a, b));
            }
            else if (isPii(a) && isPiiData(b)) {
                return fromPromise(stripe.createToken(a, b));
            }
            else {
                return fromPromise(stripe.createToken((a), (b)));
            }
        }), first());
    };
    StripeInstance.prototype.createSource = function (a, b) {
        return this.stripe$
            .asObservable()
            .pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var stripe = (s);
            if (isSourceData(a)) {
                return fromPromise(stripe.createSource((a)));
            }
            return fromPromise(stripe.createSource((a), b));
        }), first());
    };
    StripeInstance.prototype.retrieveSource = function (source) {
        return this.stripe$
            .asObservable()
            .pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var stripe = (s);
            return fromPromise(stripe.retrieveSource(source));
        }), first());
    };
    StripeInstance.prototype.paymentRequest = function (options) {
        var stripe = this.getInstance();
        if (stripe) {
            return stripe.paymentRequest(options);
        }
        return undefined;
    };
    return StripeInstance;
}());
var StripeService = /** @class */ (function () {
    function StripeService(key, options, loader, window) {
        this.key = key;
        this.options = options;
        this.loader = loader;
        this.window = window;
        this.stripe = null;
        if (key) {
            this.stripe = new StripeInstance(this.loader, this.window, key, options);
        }
    }
    StripeService.prototype.getStripeReference = function () {
        var _this = this;
        return this.loader
            .asStream()
            .pipe(filter(function (status) { return status.loaded === true; }), map(function () { return ((_this.window.getNativeWindow())).Stripe; }));
    };
    StripeService.prototype.getInstance = function () {
        return this.stripe == null ? (this.stripe) : (this.stripe.getInstance());
    };
    StripeService.prototype.setKey = function (key, options) {
        return this.changeKey(key, options);
    };
    StripeService.prototype.changeKey = function (key, options) {
        this.stripe = new StripeInstance(this.loader, this.window, key, options);
        return this.stripe;
    };
    StripeService.prototype.elements = function (options) {
        if (this.stripe == null)
            return new Observable();
        return this.stripe.elements(options);
    };
    StripeService.prototype.createToken = function (a, b) {
        if (this.stripe == null)
            return new Observable();
        return this.stripe.createToken(a, b);
    };
    StripeService.prototype.createSource = function (a, b) {
        if (this.stripe == null)
            return new Observable();
        return this.stripe.createSource(a, b);
    };
    StripeService.prototype.retrieveSource = function (source) {
        if (this.stripe == null)
            return new Observable();
        return this.stripe.retrieveSource(source);
    };
    StripeService.prototype.paymentRequest = function (options) {
        if (this.stripe == null)
            return;
        return this.stripe.paymentRequest(options);
    };
    return StripeService;
}());
StripeService.decorators = [
    { type: Injectable },
];
StripeService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_OPTIONS,] },] },
    { type: LazyStripeAPILoader, },
    { type: WindowRef, },
]; };
var StripeFactoryService = /** @class */ (function () {
    function StripeFactoryService(baseKey, baseOptions, loader, window) {
        this.baseKey = baseKey;
        this.baseOptions = baseOptions;
        this.loader = loader;
        this.window = window;
    }
    StripeFactoryService.prototype.create = function (key, options) {
        return new StripeInstance(this.loader, this.window, key, options);
    };
    return StripeFactoryService;
}());
StripeFactoryService.decorators = [
    { type: Injectable },
];
StripeFactoryService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_OPTIONS,] },] },
    { type: LazyStripeAPILoader, },
    { type: WindowRef, },
]; };
var StripeCardComponent = /** @class */ (function () {
    function StripeCardComponent(stripeService) {
        this.stripeService = stripeService;
        this.card = new EventEmitter();
        this.on = new EventEmitter();
        this.element = null;
        this.options$ = new BehaviorSubject({});
        this.elementsOptions$ = new BehaviorSubject({});
        this.stripe$ = new BehaviorSubject(null);
    }
    Object.defineProperty(StripeCardComponent.prototype, "options", {
        set: function (optionsIn) {
            this.options$.next(optionsIn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StripeCardComponent.prototype, "elementsOptions", {
        set: function (optionsIn) {
            this.elementsOptions$.next(optionsIn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StripeCardComponent.prototype, "stripe", {
        set: function (stripeIn) {
            this.stripe$.next(stripeIn);
        },
        enumerable: true,
        configurable: true
    });
    StripeCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        var elements$ = combineLatest(this.elementsOptions$.asObservable(), this.stripe$.asObservable()).pipe(switchMap(function (_a) {
            var _b = __read(_a, 2), options = _b[0], stripe = _b[1];
            if (stripe) {
                if (Object.keys(options).length > 0) {
                    return stripe.elements(options);
                }
                return stripe.elements();
            }
            else {
                if (Object.keys(options).length > 0) {
                    return _this.stripeService.elements(options);
                }
                return _this.stripeService.elements();
            }
        }));
        combineLatest(elements$, this.options$.asObservable().pipe(filter(function (options) { return Boolean(options); }))).subscribe(function (_a) {
            var _b = __read(_a, 2), elements = _b[0], options = _b[1];
            _this.element = elements.create('card', options);
            _this.element.on('blur', function (ev) { return _this.on.emit({
                event: ev,
                type: 'blur'
            }); });
            _this.element.on('change', function (ev) { return _this.on.emit({
                event: ev,
                type: 'change'
            }); });
            _this.element.on('click', function (ev) { return _this.on.emit({
                event: ev,
                type: 'click'
            }); });
            _this.element.on('focus', function (ev) { return _this.on.emit({
                event: ev,
                type: 'focus'
            }); });
            _this.element.on('ready', function (ev) { return _this.on.emit({
                event: ev,
                type: 'ready'
            }); });
            if (_this.stripeCard != null)
                _this.element.mount(_this.stripeCard.nativeElement);
            _this.card.emit(_this.element);
        });
    };
    StripeCardComponent.prototype.getCard = function () {
        return this.element;
    };
    return StripeCardComponent;
}());
StripeCardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-stripe-card',
                template: "\n    <div class=\"field\" #stripeCard></div>\n  "
            },] },
];
StripeCardComponent.ctorParameters = function () { return [
    { type: StripeService, },
]; };
StripeCardComponent.propDecorators = {
    "card": [{ type: Output },],
    "on": [{ type: Output },],
    "stripeCard": [{ type: ViewChild, args: ['stripeCard',] },],
    "options": [{ type: Input },],
    "elementsOptions": [{ type: Input },],
    "stripe": [{ type: Input },],
};
var NgxStripeModule = /** @class */ (function () {
    function NgxStripeModule() {
    }
    NgxStripeModule.forRoot = function (publishableKey, options) {
        return {
            ngModule: NgxStripeModule,
            providers: [
                LazyStripeAPILoader,
                StripeService,
                StripeFactoryService,
                WindowRef,
                DocumentRef,
                {
                    provide: STRIPE_PUBLISHABLE_KEY,
                    useValue: publishableKey
                },
                {
                    provide: STRIPE_OPTIONS,
                    useValue: options
                }
            ]
        };
    };
    return NgxStripeModule;
}());
NgxStripeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [StripeCardComponent],
                exports: [StripeCardComponent]
            },] },
];

export { NgxStripeModule, StripeCardComponent, StripeService, StripeFactoryService, StripeInstance, LazyStripeAPILoader, WindowRef, DocumentRef, isSourceData, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, isBankAccount, isBankAccountData, isPii, isPiiData };
//# sourceMappingURL=ngx-stripe.js.map
