/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/highlight_replacement.js":
/*!**************************************!*\
  !*** ./src/highlight_replacement.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHighlightOptions: () => (/* binding */ DefaultHighlightOptions),
/* harmony export */   HighlightReplacement: () => (/* binding */ HighlightReplacement)
/* harmony export */ });
/** Options interface for styling highlighted text. */
const DefaultHighlightOptions = {
    color: "white",
    backgroundColor: "green",
}

/** Class name for <a> elements containing matched text. */
const NON_MATCH_CLASS = "re-search_non_matching";
/** Class name for <a> elmenets containing matched text. */
const MATCH_CLASS = "re-search_matching";

/**
 * Helper function for {@link HighlightReplacement}. Creates an element holding slices of a given string, divided according to a sorted, two-dimensional array of index ranges.
 * @param {string} str 
 * @param {Array} segmentRanges Two-dimensional array of the form [[x, y],...]. Follows the same index semantics of {@link String.prototype.substring}.
 * @param {string} textColor Color string compatible with {@link CSSStyleDeclaration}.
 * @param {string} backgroundColor Color string compatible with {@link CSSStyleDeclaration}.
 * @returns Returns an element that may contain multiple text segments contained in their own <a> elements.
 */
function SeparateString(str, segmentRanges, textColor = "", backgroundColor = "") {
    let stringPointer = 0;
    let container = document.createElement('span');
    let rightBound = segmentRanges[segmentRanges.length - 1][1];

    for (let pair of segmentRanges) {
        let enc = CreateTextElement(str.substring(pair[0], pair[1]));
        enc.style.color = textColor;
        enc.style.backgroundColor = backgroundColor;
        enc.className = MATCH_CLASS;
        if (pair[0] > stringPointer) {
            let nonmatch = CreateTextElement(str.substring(stringPointer, pair[0]));
            nonmatch.className = NON_MATCH_CLASS;
            container.appendChild(nonmatch);
        }
        stringPointer = pair[1];
        container.appendChild(enc);
    }
    if (rightBound < str.length) {
        container.appendChild(CreateTextElement(str.substring(rightBound, str.length)));
    }
    return container;
}

/**
 * For every Text node that has a match, we'll need to separate the matches into their own element so that we can apply highlightning. This needs to be a reversible process so our replacement will
 * be kept as one entity and carry a reference to the Text it just replaced.
 */
class HighlightReplacement {
    constructor(matchRanges = [[0, 0]], textnode = null, colorOptions = DefaultHighlightOptions) {
        let text = (textnode)? textnode.data: "";
        /**@type HTMLSpanElement */
        this.wrapper = SeparateString(text, matchRanges, colorOptions.color, colorOptions.backgroundColor);
        /**@type Node */
        this.swap = textnode;
    }
    /** Swaps the wrapper element with the Text node it originally replaced. This also reassigns all fields to null to avoid potential memory leaks. */
    Unswap() {
        this.wrapper.replaceWith(this.swap);
        this.wrapper = null;
        this.swap = null;
    }
    /** Swaps the Text node with the wrapper it is meant to replace. */
    Swap() {
        if (this.swap)
            this.swap.parentElement.replaceChild(this.wrapper, this.swap);
    }
    /** Changes the highlight color scheme. */
    ChangeColor(colorObj = DefaultHighlightOptions) {
        for (let el of this.wrapper.children) {
            if (el.className == MATCH_CLASS) {
                el.style.color = colorObj.color;
                el.style.backgroundColor = colorObj.backgroundColor
            }
        }
    }
}

/***/ }),

/***/ "./src/message_protocol.js":
/*!*********************************!*\
  !*** ./src/message_protocol.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Message: () => (/* binding */ Message),
/* harmony export */   MessageType: () => (/* binding */ MessageType),
/* harmony export */   MessageTypeInverse: () => (/* binding */ MessageTypeInverse)
/* harmony export */ });

const MessageType = {
    "SEARCH": 1,
    "JUMP_TO": 2,
    "CLEAR": 3,
    "CHANGE_COLOR": 4,
    "GET_NUM": 5,
    "SENT_NUM": 6,
    "GET_MAX": 7,
    "SENT_MAX": 8
};

/**
 * Invert key-value of MessageType so we have a two-way association
 */
const MessageTypeInverse = InvertEnumKeyValue(MessageType);

function InvertEnumKeyValue(obj) {
    let o = {};
    for (let key of Object.keys(obj)) {
        o[obj[key]] = key;
    }
    return o;
}

class Message {
    constructor(msgtype, params) {
        if (!MessageType.hasOwnKeys(msgtype)) throw new Error('Invalid message type');
        this.command = msgtype;
        this.params = params;
    }
    /**
     * For debugging purposes.
     * @returns Name of the code corresponding to {@link MessageType}.
     */
    GetTypeString() {
        return MessageTypeInverse[this.command];
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/re_search.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message_protocol.js */ "./src/message_protocol.js");
/* harmony import */ var _highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highlight_replacement.js */ "./src/highlight_replacement.js");



(() => {

const TAGNAME_EXCLUDE = {
    "SCRIPT": true,
    "STYLE": true,
}

if (window.hasRun) return;
window.hasRun = true;

/**
 * Retrieve an array containing all Text {@link Node}s within the given element including its children.
 * @param parentNode
 */
function AggregateTextNodes(parentNode) {
    let list = [];
    let subqueue = [];
    subqueue.push(parentNode);

    while (subqueue.length > 0) {
        let parent = subqueue.shift();
        // push subnodes into the queue
        for (let child of parent.children) {
            subqueue.push(child);
        }

        for (let node of parent.childNodes) {
            // The contents of script elements will show up as text nodes so filter them here
            if (node.nodeType == Node.TEXT_NODE && node.parentElement && !TAGNAME_EXCLUDE[node.parentElement.tagName]) {
                list.push(node);
            }
        }

    }
    return list;
}
/**
 * Returns a simple object with the same property names as a default object. If a given object shares a property name, use the given object's property value instead. Note this function does not expected nested objects in either parameter.
 * @param {object} defaultOptions An options object. The returned object will have indentical property names to this object.
 * @param {object} givenOptions An options object. Any property name shared with defaultOptions will use this object's value in the returned object.
 * @returns 
 */
function SafeConfigParse(defaultOptions, givenOptions) {
    let finalSettings = {};
    for (let setting of Object.keys(defaultOptions)) {
        if (givenOptions.hasOwnProperty(setting)) {
            finalSettings[setting] = givenOptions[setting];
        } else {
            finalSettings[setting] = defaultOptions[setting];
        }
    }
    return finalSettings;
}

/** 
 * Utility function to make an inline element containing only our text.
 * @param {string} text The text to appear in the created element.
 * @returns An <a> element with the given text, set to display as an inline block.
 */
function CreateTextElement(text) {
    let e = document.createElement('span');
    let t = document.createTextNode(text);
    e.appendChild(t);
    return e;
}

/**
 * This class should be the container for state information.
 */
class Searcher {
    constructor(root = document.body, colorOptions = _highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__.DefaultHighlightOptions) {
        /** The first node to start searching from. */
        this.RootNode = root;
        /** List of all Text nodes present in the DOM body. */
        this.TextNodes = AggregateTextNodes(root);
        /** List of all {@link HighlightReplacement} created by the last search call. */
        this.ReplacedText = [];
        this.colors = SafeConfigParse(_highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__.DefaultHighlightOptions, colorOptions);

        console.log(`Processed ${this.TextNodes.length} Text node(s)`);
        
    }
    UpdateRoot(newRoot) {
        this.RootNode = newRoot;
    }
    /**
     * Call this if text on the DOM has changed.
     */
    Update() {
        this.Revert();
        this.TextNodes = AggregateTextNodes(this.RootNode);
    }
    /**
     * Call to restore the original document.
     */
    Revert() {
        for (let swapped of this.ReplacedText) {
            swapped.Unswap();
        }
        this.ReplacedText = [];
    }
    /**
     * Carry out a search of all strings within {@link TextNodes} and highlight matched text in the DOM.
     * @param {string} searchstr 
     */
    Search(searchstr, multiFlag = true, caseFlag = false) {
        debugger;
        if (this.ReplacedText.length > 1) this.Revert();
        if (searchstr.length === 0) return;

        let flags = "g";
        if (multiFlag) flags += "m";
        if (caseFlag) flags += "i"
        let searchExpression = new RegExp(searchstr, flags);

        for (let tnode of this.TextNodes) {
            let matches = [...tnode.data.matchAll(searchExpression)];
            // Observed some that some text nodes have a null parentElement/parentNode
            if (matches.length > 0 && tnode.parentElement) {
                let ranges = matches.map(
                    (result) => [result.index, result.index + result[0].length]
                );
                let swappedElement = new _highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__.HighlightReplacement(ranges, tnode);
                this.ReplacedText.push(swappedElement);
                swappedElement.Swap();
            }
        }
    }

    ChangeHighlightColor(options = _highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__.DefaultHighlightOptions) {
        this.colors = SafeConfigParse(_highlight_replacement_js__WEBPACK_IMPORTED_MODULE_1__.DefaultHighlightOptions, options);
        for (let matchedElement of this.ReplacedText) {
            matchedElement.ChangeColor(this.colors);
        }
    }
    /**
     * Function to scroll the matched element into view.
     * @param {*} index 
     * @returns 
     */
    JumpTo(index) {
        if (this.ReplacedText.length == 0) return;
        else {
            this.ReplacedText[index].wrapper.scrollIntoView();
        }
    }
    /**
     * 
     * @returns Number of regex matches.
     */
    GetNumMatches() {
        return this.ReplacedText.length;
    }
    /**
     * 
     * @param {number} index The index of the desired match.
     * @returns Returns null if index is invalid, otherwise returns a {@link HighlightReplacement}.
     */
    GetMatchInfo(index) {
        if (index >= this.ReplacedText.length || index < 0) return null;
        return this.ReplacedText[index];
    }
}

let searchInstance = new Searcher(document.body);

/**
 * Event handler to handle search requests from our browser action.
 * @param message 
 */
function SearchEventHandler(message) {
    if (!message) return;
    switch(message.command) {
        case _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.SEARCH:
            searchInstance.Revert();
            searchInstance.Search(message.params[0]);
            let sentNumMessage = new _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.Message(_message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.SENT_NUM, null);
            let sentMaxMessage = new _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.Message(_message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.SENT_MAX, [0]);
            if (searchInstance.GetNumMatches() != 0) {
                sentNumMessage.params = [0, searchInstance.GetMatchInfo(0)];
                sentMaxMessage.params[0] = searchinstance.GetNumMatches();
                browser.runtime.sendMessage(sentNumMessage);
                browser.runtime.sendMessage(sentMaxMessage);
            }
            break;
        case _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.CHANGE_COLOR:
            searchInstance.ChangeHighlightColor(message.params[0]);
            break;
        case _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.CLEAR:
            searchInstance.Revert();
            break;
        case _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.JUMP_TO:
            searchInstance.JumpTo(message.params[0]);
            break;
        case _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.GET_NUM:
            let match = searchInstance.GetMatchInfo(message.params[0]);
            browser.runtime.sendMessage(new _message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.Message(_message_protocol_js__WEBPACK_IMPORTED_MODULE_0__.MessageType.SENT_NUM, [message.params[0], match]));
        default:
            break;
    }
}

browser.runtime.onMessage.addListener(SearchEventHandler);
})();
})();

/******/ })()
;
//# sourceMappingURL=content_script.js.map