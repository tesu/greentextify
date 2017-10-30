var greentextClasses = ['greentext', 'greentext-light']

function searcher(node) {
    if (!node) return;
    if ((node.previousSibling == null ||
            node.previousSibling.tagName == 'DIV' ||
            node.previousSibling.tagName == 'BR') &&
            node.nodeType == 3 && greentextRegex.test(node.textContent) &&
            !node.parentNode.isContentEditable  &&
            node.parentNode.tagName      != 'A' &&
            node.parentNode.tagName      != 'S' &&
            !greentextClasses.includes(node.parentNode.className) &&
            node.parentNode.className    != 'quote' ) { // legit greentext on 4chan
            greenTextify(node);
    } else if(node.hasChildNodes()){
        for (var i = 0; i < node.childNodes.length; i++) {
            searcher(node.childNodes[i]);
        }
    }
}

function getNodeColor(node) {
    var style = getComputedStyle(node);
    var [, r, g, b] = style.color.match(/rgb\((.*), (.*), (.*)\)/);
    return { r, g, b };
}

function isLightColor(originalColor) {
    var color = originalColor;
    var a = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    // regular style has perceived brightness of ~0.49 and light of ~0.24
    // so decide using the midpoint
    return a < 0.36;
}

function greenTextify(node) {
    var greenSpan;
    if (node.previousSibling != null
        && greentextClasses.includes(node.previousSibling.className)) { // Last node was already greentexted
            greenSpan = node.previousSibling;
    } else {
        var parentColor = getNodeColor(node.parentNode);
        greenSpan = document.createElement('span'); // Create greentext node
        greenSpan.setAttribute('class', isLightColor(parentColor) ? 'greentext-light' : 'greentext'); // Create make span green
        node.parentNode.insertBefore(greenSpan, node); // Insert span into position
    }
    greenSpan.appendChild(node);

    // DON'T USE SPECIAL G+ WORKAROUND ANYMORE
    /* if (greenSpan.nextSibling != null) { // nextSibling exists
        // Special G+ Workaround
        if (greenSpan.nextSibling.className == "proflinkWrapper" && greenSpan.nextSibling.nextSibling.nodeType == 3) {
            greenTextify(greenSpan.nextSibling.nextSibling, 0); // nextSibling is profile link wrapper, continue greentext after it
        }
    } */

    if (greenSpan.nextSibling != null && // fuck order of operations holy shit
        (greenSpan.nextSibling.nodeType != 1 ||
        greenSpan.nextSibling.tagName != 'DIV' &&
        greenSpan.nextSibling.tagName != 'BR')) {
            greenTextify(greenSpan.nextSibling);
    }
}

var greentextRegex = /^\s*(?:>|&gt;)(?:[^<.>_]|>+[^>\s]+)/i;

var obs = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        searcher(mutation.target);
    });
});

window.addEventListener('load', function() {
    searcher(document);
    obs.observe(document, {attributes: false, childList: true, characterData: true, subtree: true});
});

// function onModification(event) {
//     searcher(event.relatedNode);
// }

// document.addEventListener("DOMNodeInserted", onModification, false);
// document.addEventListener("DOMCharacterDataModified", onModification, false);
// setInterval("searcher(document.getElementsByTagName('body') [0]);", 1000);
