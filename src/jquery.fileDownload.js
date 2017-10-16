/*
 * jQuery File Download Plugin v1.4.7
 *
 * https://github.com/Aternus/jquery.fileDownload
 *
 * Copyright (c) 2017 - Kiril Reznik
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm,
        htmlSpecialCharsPlaceHolders = {
            '<': 'lt;',
            '>': 'gt;',
            '&': 'amp;',
            '\r': '#13;',
            '\n': '#10;',
            '"': 'quot;',
            '\'': '#39;' /* single quotes just to be safe, IE8 doesn't support &apos;, so use &#39; instead */
        };

    $.fileDownload = function(fileUrl, options) {

        /**
         * Variables
         */
        var settings = $.extend(true, {}, $.fileDownload.defaults, options),
            deferred = new $.Deferred(),
            httpMethod = settings.httpMethod.toUpperCase(),
            $preparingDialog = null,
            $iframe,
            downloadWindow,
            formDoc,
            $form;

        /**
         * Get iFrame document (cross browser compatible).
         *
         * @param $iframe
         * @returns {Window|Document}
         */
        function getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        /**
         * HTML Special Chars Entity Encode.
         *
         * @param str
         * @returns string
         */
        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(htmlSpecialCharsRegEx, function(match) {
                return '&' + htmlSpecialCharsPlaceHolders[match];
            });
        }

        /**
         * Clean Up.
         *
         * @param isFailure
         */
        function cleanUp(isFailure) {
            setTimeout(function() {
                // cleanup download window
                if (downloadWindow) {
                    if (is_Android) {
                        downloadWindow.close();
                    }
                    if (is_iOS) {
                        if (downloadWindow.focus) {
                            // iOS safari doesn't allow a window to be closed unless it is focused
                            downloadWindow.focus();
                            if (isFailure) {
                                downloadWindow.close();
                            }
                        }
                    }
                }
                // cleanup iframe
                if ($iframe) {
                    $iframe.remove();
                }
            }, 0);
        }

        /**
         * Check File Download Complete
         */
        function checkFileDownloadComplete() {

            // the normalized complete cookie
            var completeCookie = (settings.cookieName + '=' + settings.cookieValue).toLowerCase();

            // file download success, cookie present
            if (document.cookie.toLowerCase().indexOf(completeCookie) > -1) {
                // remove cookie
                var removeCompleteCookie = settings.cookieName + '=; path=' + settings.cookiePath + '; expires=' + new Date(0).toUTCString() + ';';
                if (settings.cookieDomain) {
                    removeCompleteCookie += ' domain=' + settings.cookieDomain + ';';
                }
                document.cookie = removeCompleteCookie;
                // cleanup
                cleanUp(false);
                // execute user success callback
                internalCallbacks.onSuccess(fileUrl);
                return;
            }

            // check file download status
            if (downloadWindow || $iframe) {

                // has an error occurred?
                try {

                    var formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

                    if (formDoc && formDoc.body !== null && formDoc.body.innerHTML.length) {

                        var isFailure = true;

                        if ($form && $form.length) {
                            var $contents = $(formDoc.body).contents().first();
                            try {
                                if ($contents.length && $contents[0] === $form[0]) {
                                    isFailure = false;
                                }
                            }
                            catch (e) {
                                if (e && e.number == -2146828218) {
                                    // IE 8-10 throw a permission denied after the form reloads on the "$contents[0] === $form[0]" comparison
                                    isFailure = true;
                                } else {
                                    throw e;
                                }
                            }
                        }

                        if (isFailure) {
                            // IE 8-10 don't always have the full content available right away, they need a little bit to finish
                            setTimeout(function() {
                                cleanUp(true);
                                internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);
                            }, 100);

                            return;
                        }
                    }
                }
                catch (err) {
                    // 500 error > IE9
                    cleanUp(true);
                    internalCallbacks.onFail('', fileUrl, err);
                    return;
                }
            }

            // keep checking...
            setTimeout(checkFileDownloadComplete, settings.checkInterval);
        }

        /**
         * Mobile browser detection
         *
         * @see http://detectmobilebrowser.com/
         */
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase(),
            is_iOS,                  // has full support of features in iOS 4.0+, uses a new window to accomplish this.
            is_Android,              // has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. see above for specifying a message.
            is_OtherMobileBrowser;   // there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {
            is_iOS = true;
        } else if (userAgent.indexOf('android') !== -1) {
            is_Android = true;
        } else {
            is_OtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));
        }

        /**
         * Reject Android with anything but GET
         */
        // the stock android browser doesn't support file downloads initiated by non GET requests
        if (is_Android && httpMethod !== 'GET' && settings.androidPostUnsupportedMessageHtml) {
            if ($().dialog) {
                $('<div>').html(settings.androidPostUnsupportedMessageHtml)
                          .dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }
            return deferred.reject();
        }

        /**
         * Internal Callbacks
         */
        var internalCallbacks = {
            onPrepare: function(url) {
                // wire up a jquery dialog to display the preparing message, if specified
                if (settings.preparingMessageHtml) {
                    $preparingDialog = $('<div>')
                        .html(settings.preparingMessageHtml)
                        .dialog(settings.dialogOptions);
                } else if (settings.prepareCallback) {
                    settings.prepareCallback(url);
                }
            },
            onSuccess: function(url) {
                // remove the preparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }
                settings.successCallback(url);
                deferred.resolve(url);
            },
            onAbort: function(url) {
                // remove the preparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }
                settings.abortCallback(url);
                deferred.reject(url);
            },
            onFail: function(responseHtml, url, error) {
                // remove the preparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }
                // wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {
                    $('<div>')
                        .html(settings.failMessageHtml)
                        .dialog(settings.dialogOptions);
                }
                settings.failCallback(responseHtml, url, error);
                deferred.reject(responseHtml, url);
            },
        };

        // execute the onPrepare internal callback
        internalCallbacks.onPrepare(fileUrl);

        /**
         * Prepare Data.
         * Make settings.data as a parameters query string if it exists and isn't already
         */
        if (settings.data !== null && $.type(settings.data) !== 'string') {
            settings.data = $.param(settings.data);
        }

        /**
         * Run.
         */
        if (httpMethod === 'GET') {

            // GET
            if (settings.data !== null) {
                // merge any fileUrl query string parameters with our data
                if (fileUrl.indexOf('?') !== -1) {
                    // query string in the url
                    if (fileUrl.substring(fileUrl.length - 1) !== '&') {
                        fileUrl = fileUrl + '&';
                    }
                } else {
                    // no query string in the url
                    fileUrl = fileUrl + '?';
                }
                fileUrl = fileUrl + settings.data;
            }

            if (is_iOS || is_Android) {
                downloadWindow = window.open(fileUrl);
                downloadWindow.document.title = settings.popupWindowTitle;
                window.focus();
            } else if (is_OtherMobileBrowser) {
                window.location(fileUrl);
            } else {
                // create a temporary iframe that is used to request the fileUrl as a GET request
                $iframe = $('<iframe>')
                    .hide()
                    .prop('src', fileUrl)
                    .appendTo('body');
            }

        } else {

            // POST
            var formInnerHtml = '';

            // Data
            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split('&'), function() {

                    var kvp = this.split('=');

                    // when value contains the sign '=' then the kvp array does have more than 2 items. We have to join value back
                    var k = kvp[0];
                    kvp.shift();
                    var v = kvp.join('=');
                    kvp = [k, v];

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (key) {
                        var value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
                        formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '">';
                    }
                });
            }

            if (is_OtherMobileBrowser) {
                $form = $('<form>').appendTo('body');
                $form.hide()
                     .prop('method', settings.httpMethod)
                     .prop('action', fileUrl)
                     .html(formInnerHtml);
            } else {
                if (is_iOS) {
                    downloadWindow = window.open('about:blank');
                    downloadWindow.document.title = settings.popupWindowTitle;
                    formDoc = downloadWindow.document;
                    window.focus();
                } else {
                    $iframe = $('<iframe style="display:none" src="about:blank"></iframe>')
                        .appendTo('body');
                    formDoc = getiframeDocument($iframe);
                }
                formDoc.write('<html><head></head><body><form method="' + settings.httpMethod + '" action="' + fileUrl + '">' +
                              formInnerHtml + '</form>' + settings.popupWindowTitle + '</body></html>');
                $form = $(formDoc).find('form');
            }

            // submit the form and initiate the download
            $form.submit();
        }

        // poll to see if the file download has completed
        setTimeout(checkFileDownloadComplete, settings.checkInterval);

        var promise = deferred.promise();

        promise.abort = function() {
            cleanUp();
            internalCallbacks.onAbort(fileUrl);
        };

        return promise;
    };

    $.fileDownload.defaults = {
        /**
         * Message to display when the file download is being prepared before the browser's dialog appears.
         * Requires jQuery UI.
         *
         * @var string|null
         */
        preparingMessageHtml: null,
        /**
         * Message to display when a file download fails.
         * Requires jQuery UI.
         *
         * @var string|null
         */
        failMessageHtml: null,
        /**
         * Message to display when the user have an Android system and set a method which is not supported (non GET).
         * Set to null to disable the message and try to download anyway.
         * Dialog if jQuery UI is present, otherwise JS alert().
         *
         * @see http://code.google.com/p/android/issues/detail?id=1780
         *
         * @var string|null
         */
        androidPostUnsupportedMessageHtml: 'Unfortunately your Android browser doesn\'t support this type of file download. Please try again with a different browser.',
        /**
         * jQuery UI dialog options.
         * Requires jQuery UI.
         *
         * @var {modal:bool}
         */
        dialogOptions: {modal: true},
        /**
         * A prepare callback function.
         * Run while the download is being prepared and before the browser's dialog appears.
         *
         * @param url (string) the original url
         */
        prepareCallback: function(url) {
        },
        /**
         * A success callback function.
         * Executed after a file download successfully completed.
         *
         * @param url (string) the original url
         */
        successCallback: function(url) {
        },
        /**
         * An abort callback function.
         * Executed after a file download request was canceled.
         *
         * @param url (string)
         */
        abortCallback: function(url) {
        },
        /**
         * A fail callback function.
         * Executed after a file download has failed.
         *
         * @param responseHtml (string)    The html that came back in response to the file download.
         *                                 Depending on the browser this won't necessarily come back.
         *                                 > IE9 a cross domain error occurs because 500+ errors cause a cross domain issue
         *                                 due to IE subbing out the server's error message with a "helpful" IE built in message.
         * @param url (string)             The original url.
         * @param error (object)           Original error caught from exception.
         */
        failCallback: function(responseHtml, url, error) {
        },
        /**
         * The HTTP method to use. Defaults to "GET".
         *
         * @var string
         */
        httpMethod: 'GET',
        /**
         * The Data to attach to the request.
         * Must be an object, which will be passed to $.param() OR a string of "key=value" pairs.
         *
         * @var object|null
         */
        data: null,
        /**
         * Successful download check: the cookie check poll interval (in ms).
         *
         * @var int
         */
        checkInterval: 100,
        /**
         * Successful download check: the cookie name to check for.
         *
         * @var string
         */
        cookieName: 'fileDownload',
        /**
         * Successful download check: the cookie value to check for.
         *
         * @var string
         */
        cookieValue: 'true',
        /**
         * Successful download check: the cookie path to check for.
         *
         * @var string
         */
        cookiePath: '/',
        /**
         * Successful download check: the cookie domain to check for.
         * Useful when the cookie is served on a sub-domain (downloads.example.com).
         *
         * @var string|null
         */
        cookieDomain: null,
        /**
         * The title for the mobile browser download popup window.
         *
         * @var string
         */
        popupWindowTitle: 'Initiating file download...',
        /**
         * Encode all HTML entities for POST data.
         *
         * Needed if data is an object with properties whose values contain strings with quotation marks.
         * Algorithm:
         *     Replace all &,<,>,',",\r,\n characters.
         *
         * NOTE:   Some browsers will POST the string encoded whilst others will decode it before POSTing.
         *         It's recommended to decode the data server-side regardless for consistency.
         *
         * @var bool
         */
        encodeHTMLEntities: true,
    };

})(jQuery);
