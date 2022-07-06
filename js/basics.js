/**
 * The main code for HCoVC. The object space for the code is provided by
 *  hcovcSpace(), which must be defined before this is loaded.
 */
 /* global console, jQuery, document, window, hcovcSpace */
 /* jshint esversion: 6 */

// Make other spaces first so they're safe to use here.
(function(oHcSpc){
    'use strict';
    oHcSpc.util = oHcSpc.util || {};
    oHcSpc.debug = oHcSpc.debug || {};
})(hcovcSpace());


/* Bits from the old site that are often parts of other packages that are unused. */
(function(oRoot, $){
    'use strict';

    // I never figured out exactly what "a" did, but making a JQ collection is
    //  adequate.
    function aModFromJp(qspec) {
        // Returns an JQ collection.
        return $(qspec);
    }

    function _sttHandler(elem) {
        // Stop the anchor from causing its action.
        elem.preventDefault();
        return aModFromJp('html, body').animate({
            scrollTop: 0
        }, 'slow'),
        // No idea what this does or why. Was no ; but jshint whined.
        !1;
    }

    // Inits for the handlers.
    let clickers = {

        // Init the scroll to top button. The orig did preventDefault elsewhere.
        scrollToTop: function() {
            aModFromJp('a#back-to-top').click(_sttHandler);
        },

        // Don't worry about commas.
        lintrap: false
    };

    // Holding space:
    oRoot.handlerIniters = clickers;

})(hcovcSpace(), jQuery);
// hcovcSpace.handlerIniters.scrollToTop()

(function(oRoot, win, doc){
    'use strict';
    const bcls = '.hcovc-3word';

    function imageStatus(selectSpec=bcls) {

        win.addEventListener('load', () => {

          let boxes = doc.querySelectorAll(selectSpec);
          for (const box of boxes) {
              let image = box.querySelector('img');

              let newElem = doc.createElement('p');
              newElem.innerHTML = `Image: <code>${image.currentSrc}</code>`;
              box.appendChild(newElem);
          }
        });
    }
    oRoot.imageStatus = imageStatus;

})(hcovcSpace().debug, window, document);

