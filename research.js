const SwappedNodeKey = "Re_SearchSwappedNode";

/**
 * Retrieve an array containing all Text {@link Node}s within the document's body.
 */
function AggregateTextNodes() {
    let list = [];
    let subqueue = [];
    subqueue.push(document.body);

    while (subqueue.length > 0) {
        let parent = subqueue.shift();
        // push subnodes into the queue
        for (let child of parent.children) {
            subqueue.push(child);
        }

        for (let node of parent.childNodes) {
            // The contents of script elements will show up as text nodes so filter them here
            if (node.nodeType == Node.TEXT_NODE && node.parentElement && node.parentElement.tagName !== "SCRIPT") {
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

const DefaultHighlightOptions = {
    color: "white",
    backgroundColor: "green",
}
/**
 * Helper function for {@link HighlightReplacement}. Creates an element holding slices of a given string, divided according to a sorted, two-dimensional array of index ranges.
 * @param {string} str 
 * @param {Array} segmentRanges Two-dimensional array of the form [[x, y],...]. Follows the same index semantics of {@link String.prototype.substring}.
 * @param {string} textColor Color string compatible with {@link CSSStyleDeclaration}.
 * @param {string} backgroundColor Color string compatible with {@link CSSStyleDeclaration}.
 * @returns Returns an element that may contain multiple text segments contained in their own <a> elements.
 */
function SeperateString(str, segmentRanges, textColor = "", backgroundColor = "") {
    let stringPointer = 0;
    let container = document.createElement('span');
    let rightBound = segmentRanges[segmentRanges.length - 1][1];

    for (let pair of segmentRanges) {
        let enc = CreateTextElement(str.substring(pair[0], pair[1]));
        enc.style.color = textColor;
        enc.style.backgroundColor = backgroundColor;
        if (pair[0] > stringPointer) {
            container.appendChild(CreateTextElement(str.substring(stringPointer, pair[0])));
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
        this.wrapper = SeperateString(text, matchRanges, colorOptions.color, colorOptions.backgroundColor);
        this.swap = textnode;
    }
    /** Swaps the wrapper element with the Text node it originally replaced. This also reassigns all fields to null to avoid potential memory leaks. */
    Unswap() {
        this.wrapper.replaceWith(this.swap);
        this.wrapper = null;
        this.head = null;
        this.mid = null;
        this.tail = null;
    }
    /** Swaps the Text node with the wrapper it is meant to replace. */
    Swap() {
        this.swap.parentElement.replaceChild(this.wrapper, this.swap);
    }
}
/**
 * This class should be the container for state information.
 */
class Searcher {
    constructor(colorOptions = DefaultHighlightOptions) {
        /** List of all Text nodes present in the DOM body. */
        this.TextNodes = AggregateTextNodes();
        /** List of all {@link HighlightReplacement} created by the last search call. */
        this.ReplacedText = [];
        this.colors = SafeConfigParse(DefaultHighlightOptions, colorOptions);
        
    }
    /**
     * Call this if text on the DOM has changed.
     */
    update() {
        this.revert();
        this.TextNodes = AggregateTextNodes();
    }
    /**
     * Call to restore the original document.
     */
    revert() {
        for (let swapped of this.ReplacedText) {
            swapped.Unswap();
        }
        this.ReplacedText = [];
    }
    /**
     * Carry out a search of all strings within {@link TextNodes} and highlight matched text in the DOM.
     * @param {string} searchstr 
     */
    search(searchstr) {
        if (this.ReplacedText.length > 1) this.revert();

        let re = new RegExp(searchstr);
        if (!re.global) re = new RegExp(re.source, "g");
        for (let tnode of this.TextNodes) {
            let matches = [...tnode.data.matchAll(re)]
            if (matches.length > 0) {
                let ranges = matches.map((result) => [result.index, result.index + result[0].length]);
                let swappedElement = new HighlightReplacement(ranges, tnode);
                this.ReplacedText.push(swappedElement);
                swappedElement.Swap();
            }
        }
    }
}