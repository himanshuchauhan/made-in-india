// js for lazy-loading banner-background image
window.onload = function loadStuff() {
    var win, doc, img, header, enhancedClass;

    win = window;
    doc = win.document;
    img = new Image();
    header = doc.querySelector('.banner');
    enhancedClass = 'banner_enhanced';

    // Rather convoluted, but parses out the first mention of a background
    // image url for the enhanced header, even if the style is not applied.
    var bigSrc = (function() {
        // Find all of the CssRule objects inside the inline stylesheet
        var styles = doc.querySelector('style').sheet.cssRules;
        // Fetch the background-image declaration...
        var bgDecl = (function() {
            // ...via a self-executing function, where a loop is run
            var bgStyle, i, l = styles.length;
            for (i = 0; i < l; i++) {
                // ...checking if the rule is the one targeting the
                // enhanced header.
                if (styles[i].selectorText &&
                    styles[i].selectorText == '.' + enhancedClass) {
                    // If so, set bgDecl to the entire background-image
                    // value of that rule
                    bgStyle = styles[i].style.backgroundImage;
                    // ...and break the loop.
                    break;
                }
            }
            // ...and return that text.
            return bgStyle;
        }());
        // Finally, return a match for the URL inside the background-image
        // by using a fancy regex i Googled up, if the bgDecl variable is
        // assigned at all.
        return bgDecl && bgDecl.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1];
    }());

    // Assign an onLoad handler to the dummy image *before* assigning the src
    if (bigSrc) {
        img.src = bigSrc;
    }
    img.onload = function() {
        header.className += ' ' + enhancedClass;
    };
    // Finally, trigger the whole preloading chain by giving the dummy
    // image its source.

};







// JS for contact-form animations - needs refactoring


/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

(function(window) {

    'use strict';

    // class helper functions from bonzo https://github.com/ded/bonzo

    function classReg(className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ('classList' in document.documentElement) {
        hasClass = function(elem, c) {
            return elem.classList.contains(c);
        };
        addClass = function(elem, c) {
            elem.classList.add(c);
        };
        removeClass = function(elem, c) {
            elem.classList.remove(c);
        };
    } else {
        hasClass = function(elem, c) {
            return classReg(c).test(elem.className);
        };
        addClass = function(elem, c) {
            if (!hasClass(elem, c)) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function(elem, c) {
            elem.className = elem.className.replace(classReg(c), ' ');
        };
    }

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

    // transport
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(classie);
    } else {
        // browser global
        window.classie = classie;
    }

})(window);

(function() {
    'use strict';
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    [].slice.call(document.querySelectorAll('input.input_field')).forEach(function(inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        };

        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
})();
