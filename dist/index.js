require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 479:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PullRequestValidator = void 0;
class PullRequestValidator {
    constructor(title, body, titleRegex, bodyRegex) {
        this.title = title;
        this.body = body;
        this.titleRegex = titleRegex;
        this.bodyRegex = bodyRegex;
    }
    validate() {
        const titleRegex = new RegExp(this.titleRegex);
        const bodyRegex = new RegExp(this.bodyRegex);
        const match = titleRegex.test(this.title);
        const matchBody = bodyRegex.test(this.body);
        if (!match) {
            return {
                status: 'fail',
                message: 'Title failed',
            };
        }
        if (!matchBody) {
            return {
                status: 'fail',
                message: 'Body failed',
            };
        }
        return {
            status: 'success',
            message: 'Title and Body Validated',
        };
    }
}
exports.PullRequestValidator = PullRequestValidator;


/***/ }),

/***/ 305:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__webpack_require__(953));
const github = __importStar(__webpack_require__(548));
const PullRequestValidator_1 = __webpack_require__(479);
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            titleRegex: '^(.+)(?:(([^)s]+)))?: (.+)',
            bodyRegex: '(.*\n)+(.*)'
        };
        const pullRequest = github.context.payload.pull_request;
        if (pullRequest != null) {
            const validationCheck = new PullRequestValidator_1.PullRequestValidator(pullRequest.title, (_a = pullRequest.body) !== null && _a !== void 0 ? _a : '', options.titleRegex, options.bodyRegex).validate();
            // if validation is success then update the status
            if (validationCheck.status === 'success') {
                core.setOutput('success', true);
            }
            else {
                core.setOutput('success', false);
            }
        }
    });
}
run();


/***/ }),

/***/ 953:
/***/ ((module) => {

module.exports = require("@actions/core");

/***/ }),

/***/ 548:
/***/ ((module) => {

module.exports = require("@actions/github");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(305);
/******/ })()
;
//# sourceMappingURL=index.js.map