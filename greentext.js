function searcher(node) {
    if (!node) return;
    if ((node.previousSibling == null ||
            node.previousSibling.tagName == 'DIV' ||
            node.previousSibling.tagName == 'BR') && 
            node.nodeType == 3 && greentextRegex.test(node.textContent) &&
            !node.parentNode.isContentEditable  &&
            node.parentNode.tagName      != 'A' &&
            node.parentNode.tagName      != 'S' &&
            node.parentNode.className    != 'greentext' &&
            node.parentNode.className    != 'quote' ) { // legit greentext on 4chan
            greenTextify(node);
    } else if(node.hasChildNodes()){
        for (var i = 0; i < node.childNodes.length; i++) {
            searcher(node.childNodes[i]);
        }
    }
}

function greenTextify(node) {
    var greenSpan;
    if (node.previousSibling != null && node.previousSibling.className == "greentext") { // Last node was already greentexted
        greenSpan = node.previousSibling;
    } else {
        greenSpan = document.createElement('span'); // Create greentext node
        greenSpan.setAttribute('class', 'greentext'); // Create make span green
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