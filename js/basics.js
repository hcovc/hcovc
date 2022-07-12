/**
 * The main code for HCoVC. The object space for the code is provided by
 *  hcovcSpace(), which must be defined before this is loaded.
 */
 /* global console, document, window, hcovcSpace */
 /* jshint esversion: 6 */

// Make other spaces first so they're safe to use here.
(function(oHcSpc){
    'use strict';
    
    // doc.ready() substitute.
    function whenDocReady(func) {
        // Loading hasn't finished yet
        if (document.readyState === 'loading') {  
            document.addEventListener('DOMContentLoaded', function() {
                func();
            });
        }
        else {
            func();
        }
    }

    
    oHcSpc.util = oHcSpc.util || {};
    oHcSpc.debug = oHcSpc.debug || {};
    
    // Add it to the basic oHcSpc space.
    oHcSpc.whenDocReady = whenDocReady;
    oHcSpc.getUtilObj = () => oHcSpc.util;

})(hcovcSpace());


// Modal
(function(oHc, doc, oEnc){
    'use strict';
    
    // EMAIL spec.
    const contactSpec = ['aXdwZXNvenw3YE5BY3JwM2l2dQ==', 11, 28, 1];

    // The ID for the button that will launch the modal build and display.
    const modalId = 'modal1';
    // The ID for the span that will hold the unencrypted text.
    const emspanId = 'theEm';
    
    // Button classes for any button.
    const btnTxtCls = 'btntxt';
    const btnWrap = 'btnwrap';
    
    // Semi-generic button builder.
    function buildAbutton(htmTxt, clsList=[], id='') {
        // The button Wrapper is will be the clickable part.
        let btnW = doc.createElement('div');
        clsList.push(btnWrap);
        for (const cls of clsList) {
            btnW.classList.add(cls);
        }
        // There should always be one, but it could be found using classes.
        if (id) {
            btnW.id = id;
        }
        let theSpan = doc.createElement('span');
        theSpan.innerHTML = htmTxt;
        theSpan.classList.add(btnTxtCls);
        btnW.appendChild(theSpan);
        return btnW;
    }
    
    // Decrypt the closure-defined spec for the data and put it in the elem.
    function addContact(elem) {
        if (elem !== null) {
            // The real one
            const cdat = contactSpec;
            const estr = oEnc.decMail(cdat);
            elem.innerHTML = estr;
        }
    }

    // Build the basic parts on the overlay element. Return the elem that will
    //  hold the content.
    function _buildModalSansContent(elemOverlay) {
        elemOverlay.classList.add('modal-overlay');
        let modDia = doc.createElement('div');
        modDia.classList.add('modal-dialog');
        let modInr = doc.createElement('div');
        modInr.classList.add('inner');
    
        modDia.appendChild(modInr);
        elemOverlay.appendChild(modDia);
        // Content will go in this element.
        return modInr;
    }
    
    // Make and attach the content, including a close button.
    function _buildModalContent(elemContentWrap, closeButtonId) {
        const buttonText = 'Close';
        const buttonClasses = ['btn-closer'];
        const inners = [
            '<p>contact email<br />\n',
            '<span id="' + emspanId + '" class="email"',
            '>tbd</span></p>'
        ];
        const bAb = buildAbutton(buttonText, buttonClasses, closeButtonId);
        elemContentWrap.innerHTML = inners.join('\n');
        elemContentWrap.appendChild(bAb);
    }
    
    
    // Launched by a button click (typically).
    function buildModal(event) {
        const closeButtonId = 'modalCloser';

        console.log('buildModal clicked.');
        event.preventDefault();
        let elemOverlay = doc.createElement('div');
        // Add the overlay and modal details, and get the wrapper elem.
        let elemContentWrap = _buildModalSansContent(elemOverlay);
        // Create the text and close button.
        _buildModalContent(elemContentWrap, closeButtonId);
        
        // This attaches the built form to the document, which must happen
        //  before adding a handler.
        let bods = doc.getElementsByTagName('body');
        bods[0].appendChild(elemOverlay);
        // Find the span that will get the decrypted data.
        let emTarg = doc.getElementById(emspanId);
        addContact(emTarg);
        const clsBtn = doc.getElementById(closeButtonId);
        clsBtn.addEventListener('click', function(event) {
            // Remove the entire modal on close.
            //console.info(closeButtonId, event);
            elemOverlay.remove();
            event.preventDefault();
        });
    }

    
    // Find element and setup the handler.
    function setupModalArea() {
        //console.info('Start modal setup...');
        // Find the ID that will have a button added, then add it.
        const lnchTrg = 'modalLaunch';
        let btnLoc = doc.getElementById(lnchTrg);
        // Build a button.
        if (btnLoc) {
            const bAb = buildAbutton('Show email', ['btn-opener'], modalId);
            btnLoc.appendChild(bAb);
        }
        
        let resElem = doc.getElementById(modalId);
        if (resElem) {
            //console.log('Found modal target:', resElem);
            resElem.addEventListener('click', buildModal);
            
        }
        else {
            console.warn(`Could not find modal button element ${modalId}.`);
        }
    }
    
    // Initialize this code when docReady happens
    oHc.setupModalArea = setupModalArea;

})(hcovcSpace(), document, hcovcSpace().getUtilObj());


// Encrypt/decrypt.
(function(oHc){
    'use strict';
    let oUtil = oHc.getUtilObj();

    function _strMod(strIn, iMin, iMax, doAdd=true) {
        // It's not safe to add to the chars; so decode add encode.
        const asArr = [...strIn];
        let incNum = iMin;
        let codes = [];
        for (const x of asArr) {
            const chad = doAdd ? incNum : -incNum;
            codes.push(x.charCodeAt(0) + chad);
            incNum++;
            if (incNum > iMax) { incNum = 1; }
        }
        const stout = codes.map(cin => String.fromCharCode(cin));
        return stout.join('');
    }


    // Assumes ascii or something close to it as an input; not robust.
    // Adds a digit to each char, then base64 encodes the resulting string.
    function encMail(email) {
        // Make these part of the parms someday...
        const iMin = 1;
        const iMax = 11;
        let sout = _strMod(email, iMin, iMax);
        const b64s = window.btoa(sout);
        return [b64s, iMax, b64s.length, iMin];
    }

    // Purposefully cryptic.
    function decMail(inps) {
        return _strMod(window.atob(inps[0]), inps[3], inps[1], false);
    }

    oUtil.encMail = encMail;
    oUtil.decMail = decMail;

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
                butn.addEventListener('click', function() {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            }
        },
        
        // Call the setup function.
        setupModalArea: oRoot.setupModalArea,

        // So I don't have to worry about commas.
        lintrap: false
    };

    // Holding space:
    oRoot.handlerIniters = initFuncs;

})(hcovcSpace());


// Unused debug code.
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

