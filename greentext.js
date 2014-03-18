function searcher(node) {
    if (node.nodeType == 3 && greentextRegex.test(node.textContent) && // Check if greentext is valid
        node.parentNode.className != "greentext" && // Already greentexted
        node.parentNode.className != "unkfunc" && // *real* greentext
        node.parentNode.className != "quotelink" && // quotelink (wait what is this for again?)
        (node.previousSibling == null ||
        node.previousSibling.tagName == 'DIV' ||
        node.previousSibling.tagName == 'BR')) {
            greenTextify(node);
    } else {
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

    if (greenSpan.nextSibling != null && 
        greenSpan.nextSibling.nodeType != 1 || 
        greenSpan.nextSibling.tagName != 'DIV' && 
        greenSpan.nextSibling.tagName != 'BR') {
            greenTextify(greenSpan.nextSibling);
    }
}

function onModification(event) {
    searcher(event.relatedNode);
}

greentextRegex = new RegExp('^[\t\s\r\n]*(>|&gt;)[^>]'); // Greentext Regex

window.onload = searcher(document.getElementsByTagName('body') [0]); // Onload
document.getElementsByTagName('body') [0].addEventListener("DOMNodeInserted", onModification, false);
document.getElementsByTagName('body') [0].addEventListener("DOMCharacterDataModified", onModification, false);

//setInterval("searcher(document.getElementsByTagName('body') [0]);", 1000);