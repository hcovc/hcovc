/**
 * The main code for HCoVC. The object space for the code is provided by
 *  hcovcSpace(), which must be defined before this is loaded.
 */
 /* global console, document, window, hcovcSpace */
 /* jshint esversion: 6 */

// Make other spaces first so they're safe to use here.
(function(oHcSpc){
    'use strict';
    oHcSpc.util = oHcSpc.util || {};
    oHcSpc.debug = oHcSpc.debug || {};
})(hcovcSpace());


/* Bits from the old site that are often parts of other packages that are unused. */
(function(oRoot){
    'use strict';

    const sttClickableId = 'back-to-top';

    // Inits for the handlers. Call each item to set it up.
    let initFuncs = {

        scrollToTop: function() {
            const butn = document.getElementById(sttClickableId);
            if (butn !== null) {
                butn.addEventListener('click', function(event) {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            }
        },

        // So I don't have to worry about commas.
        lintrap: false
    };

    // Holding space:
    oRoot.handlerIniters = initFuncs;

})(hcovcSpace());
// hcovcSpace.handlerIniters.scrollToTop()


(function(oRoot, win, doc){
    'use strict';
    // Strictly debug code.
    const bcls = '.hcovc-3word';

    // Displays which image was loaded when load is complete. Was for srcset.
    function imageStatus(selectSpec=bcls) {

        win.addEventListener('load', () => {

        let boxes = doc.querySelectorAll(selectSpec);
        for (const box of boxes) {
            let imageEl = box.querySelector('img');
            let newElem = doc.createElement('p');
            newElem.innerHTML = `Image: <code>${imageEl.currentSrc}</code>`;
            box.appendChild(newElem);
          }
        });
    }
    oRoot.imageStatus = imageStatus;

})(hcovcSpace().debug, window, document);

