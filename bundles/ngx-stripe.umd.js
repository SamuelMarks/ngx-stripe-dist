(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/internal/BehaviorSubject'), require('rxjs/operators'), require('rxjs/internal-compatibility'), require('rxjs'), require('rxjs/internal/observable/combineLatest'), require('rxjs/add/observable/combineLatest'), require('rxjs/add/observable/fromPromise'), require('rxjs/add/observable/of'), require('rxjs/add/operator/switchMap'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/first'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define('ngx-stripe', ['exports', '@angular/core', '@angular/common', 'rxjs/internal/BehaviorSubject', 'rxjs/operators', 'rxjs/internal-compatibility', 'rxjs', 'rxjs/internal/observable/combineLatest', 'rxjs/add/observable/combineLatest', 'rxjs/add/observable/fromPromise', 'rxjs/add/observable/of', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/filter', 'rxjs/add/operator/first', 'rxjs/add/operator/map'], factory) :
	(factory((global['ngx-stripe'] = {}),global.ng.core,global.ng.common,global.BehaviorSubject,global.Rx.Observable.prototype,global.Rx,global.rxjs,global.combineLatest));
}(this, (function (exports,core,common,BehaviorSubject,operators,internalCompatibility,rxjs,combineLatest) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */










function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var WindowRef = /** @class */ (function () {
    function WindowRef(platformId) {
        this.platformId = platformId;
    }
    WindowRef.prototype.getNativeWindow = function () {
        if (common.isPlatformBrowser(this.platformId)) {
            return window;
        }
        return ({});
    };
    return WindowRef;
}());
WindowRef.decorators = [
    { type: core.Injectable },
];
WindowRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
var DocumentRef = /** @class */ (function () {
    function DocumentRef(platformId) {
        this.platformId = platformId;
    }
    DocumentRef.prototype.getNativeDocument = function () {
        if (common.isPlatformBrowser(this.platformId)) {
            return document;
        }
        return ({});
    };
    return DocumentRef;
}());
DocumentRef.decorators = [
    { type: core.Injectable },
];
DocumentRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
var LazyStripeAPILoader = /** @class */ (function () {
    function LazyStripeAPILoader(platformId, window, document) {
        this.platformId = platformId;
        this.window = window;
        this.document = document;
        this.status = new BehaviorSubject.BehaviorSubject({
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
        if (common.isPlatformServer(this.platformId)) {
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
    { type: core.Injectable },
];
LazyStripeAPILoader.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
    { type: WindowRef, },
    { type: DocumentRef, },
]; };
var STRIPE_PUBLISHABLE_KEY = new core.InjectionToken('Stripe Publishable Key');
var STRIPE_OPTIONS = new core.InjectionToken('Stripe Options');
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
        this.stripe$ = new BehaviorSubject.BehaviorSubject(undefined);
        this.loader
            .asStream()
            .pipe(operators.filter(function (status) { return status.loaded === true; }), operators.first(), operators.map(function () { return ((_this.window.getNativeWindow())).Stripe; }))
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
            .pipe(operators.filter(function (stripe) { return Boolean(stripe); }), operators.map(function (stripe) { return ((stripe)).elements(options); }), operators.first());
    };
    StripeInstance.prototype.createToken = function (a, b) {
        return this.stripe$
            .asObservable()
            .pipe(operators.filter(function (stripe) { return Boolean(stripe); }), operators.switchMap(function (s) {
            var stripe = (s);
            if (isBankAccount(a) && isBankAccountData(b)) {
                return internalCompatibility.fromPromise(stripe.createToken(a, b));
            }
            else if (isPii(a) && isPiiData(b)) {
                return internalCompatibility.fromPromise(stripe.createToken(a, b));
            }
            else {
                return internalCompatibility.fromPromise(stripe.createToken((a), (b)));
            }
        }), operators.first());
    };
    StripeInstance.prototype.createSource = function (a, b) {
        return this.stripe$
            .asObservable()
            .pipe(operators.filter(function (stripe) { return Boolean(stripe); }), operators.switchMap(function (s) {
            var stripe = (s);
            if (isSourceData(a)) {
                return internalCompatibility.fromPromise(stripe.createSource((a)));
            }
            return internalCompatibility.fromPromise(stripe.createSource((a), b));
        }), operators.first());
    };
    StripeInstance.prototype.retrieveSource = function (source) {
        return this.stripe$
            .asObservable()
            .pipe(operators.filter(function (stripe) { return Boolean(stripe); }), operators.switchMap(function (s) {
            var stripe = (s);
            return internalCompatibility.fromPromise(stripe.retrieveSource(source));
        }), operators.first());
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
            .pipe(operators.filter(function (status) { return status.loaded === true; }), operators.map(function () { return ((_this.window.getNativeWindow())).Stripe; }));
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
            return new rxjs.Observable();
        return this.stripe.elements(options);
    };
    StripeService.prototype.createToken = function (a, b) {
        if (this.stripe == null)
            return new rxjs.Observable();
        return this.stripe.createToken(a, b);
    };
    StripeService.prototype.createSource = function (a, b) {
        if (this.stripe == null)
            return new rxjs.Observable();
        return this.stripe.createSource(a, b);
    };
    StripeService.prototype.retrieveSource = function (source) {
        if (this.stripe == null)
            return new rxjs.Observable();
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
    { type: core.Injectable },
];
StripeService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: core.Inject, args: [STRIPE_OPTIONS,] },] },
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
    { type: core.Injectable },
];
StripeFactoryService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: core.Inject, args: [STRIPE_OPTIONS,] },] },
    { type: LazyStripeAPILoader, },
    { type: WindowRef, },
]; };
var StripeCardComponent = /** @class */ (function () {
    function StripeCardComponent(stripeService) {
        this.stripeService = stripeService;
        this.card = new core.EventEmitter();
        this.on = new core.EventEmitter();
        this.element = null;
        this.options$ = new BehaviorSubject.BehaviorSubject({});
        this.elementsOptions$ = new BehaviorSubject.BehaviorSubject({});
        this.stripe$ = new BehaviorSubject.BehaviorSubject(null);
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
        var elements$ = combineLatest.combineLatest(this.elementsOptions$.asObservable(), this.stripe$.asObservable()).pipe(operators.switchMap(function (_a) {
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
        combineLatest.combineLatest(elements$, this.options$.asObservable().pipe(operators.filter(function (options) { return Boolean(options); }))).subscribe(function (_a) {
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
    { type: core.Component, args: [{
                selector: 'ngx-stripe-card',
                template: "\n    <div class=\"field\" #stripeCard></div>\n  "
            },] },
];
StripeCardComponent.ctorParameters = function () { return [
    { type: StripeService, },
]; };
StripeCardComponent.propDecorators = {
    "card": [{ type: core.Output },],
    "on": [{ type: core.Output },],
    "stripeCard": [{ type: core.ViewChild, args: ['stripeCard',] },],
    "options": [{ type: core.Input },],
    "elementsOptions": [{ type: core.Input },],
    "stripe": [{ type: core.Input },],
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
    { type: core.NgModule, args: [{
                declarations: [StripeCardComponent],
                exports: [StripeCardComponent]
            },] },
];

exports.NgxStripeModule = NgxStripeModule;
exports.StripeCardComponent = StripeCardComponent;
exports.StripeService = StripeService;
exports.StripeFactoryService = StripeFactoryService;
exports.StripeInstance = StripeInstance;
exports.LazyStripeAPILoader = LazyStripeAPILoader;
exports.WindowRef = WindowRef;
exports.DocumentRef = DocumentRef;
exports.isSourceData = isSourceData;
exports.STRIPE_PUBLISHABLE_KEY = STRIPE_PUBLISHABLE_KEY;
exports.STRIPE_OPTIONS = STRIPE_OPTIONS;
exports.isBankAccount = isBankAccount;
exports.isBankAccountData = isBankAccountData;
exports.isPii = isPii;
exports.isPiiData = isPiiData;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-stripe.umd.js.map
