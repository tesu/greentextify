function searcher(node) {
    if ((node.previousSibling == null ||
            node.previousSibling.tagName == 'DIV' ||
            node.previousSibling.tagName == 'BR') && 
            node.nodeType == 3 && greentextRegex.test(node.textContent) &&
            node.parentNode.className != "greentext" &&
            node.parentNode.className != "unkfunc" && // legit greentext on 4chin
            node.parentNode.className != "quotelink") { // (wait what is this for again?)
            greenTextify(node);
    } else if(node.hasChildNodes()){
        for (var i = 0; i < node.childNodes.length; i++) {
            searcher(node.childNodes[i]);
        }
    }
}

function greenTextify(node) {
    if (node.previousSibling != null && node.previousSibling.className == "greentext") { // Last node was already greentexted
        var greenSpan = node.previousSibling;
    } else {
        var greenSpan = document.createElement('span'); // Create greentext node
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

function onModification(event) {
    searcher(event.relatedNode.parentNode);
}

greentextRegex = /^\s*(?:>|&gt;)[^>]/i;

window.onload = searcher(document);
document.addEventListener("DOMNodeInserted", onModification, false);
document.addEventListener("DOMCharacterDataModified", onModification, false);

//setInterval("searcher(document.getElementsByTagName('body') [0]);", 1000);