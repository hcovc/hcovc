/**
 * The Promise-based script loader. The object space for the code is provided
 * by hcovcSpace(), which must be defined before this is loaded.
 */
 /* global document, console, hcovcSpace */
 /* jshint esversion: 6 */

// Promise based loader used to load all the other JS files.
(function(oRoot){
    'use strict';

    // Determine the local now time, make an ISO string.
    function getNowLocalISO() {
        // UTC
        const now = new Date();
        // Local
        const nowLocal = new Date(+now - now.getTimezoneOffset() * 60 * 1000);
        //console.log(nowLocal.toISOString());
        return nowLocal.toISOString();
    }

    // Returns a Promise. Resolves to the source spec string srcSpec.
    // Any Truthy value for show logs file loading information.
    function loadScript(srcSpec, show){
        return new Promise(function(resolve, reject){
            if (show) {
                console.info(`Loading "${srcSpec}".`);
            }
            let script = document.createElement('script');
            script.src = srcSpec;
            // If you wonder how a file got loaded...this may help.
            script.dataset.yfpLoadstart = getNowLocalISO();
            script.onload = () => {
                if (show) {
                    console.info(`Done loading "${srcSpec}".`);
                }
                script.dataset.yfpLoaddone = getNowLocalISO();
                resolve(srcSpec);
            };
            script.onerror = (err) => {
                if (show) {
                    console.error(err);
                }
                reject(srcSpec);
            };

            // Start the loading process by attaching it.
            let head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
        });
    }

    oRoot.loadScript = loadScript;

})(hcovcSpace());
