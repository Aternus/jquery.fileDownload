# jquery.FileDownload Changelog

## 2017.10.16 - 1.4.7
* Forked from [johnculviner](https://github.com/johnculviner/jquery.fileDownload)

## 6/01/2013 - 1.4.1
* Merged pull fixing constant location. Thanks Djemo!
* Added iframe removal after success/failure of download. Thanks for the idea joshua5822!

## 6/01/2013 - 1.4.1

* Merged pull fixing constant location. Thanks Djemo!
* Added iframe removal after success/failure of download. Thanks for the idea joshua5822!

## 5/05/2013 - 1.4.0

* Added deferred support since promises are very useful and becoming ubiquitous
* Removed default error message alert() as it conflicted with promise support which is more useful
* Updated attr use to prop
* Due to above points jQuery 1.6+ is now required
* Merged in 'prepareCallback' - thanks loraderon
* Merged in some changes for more concise and compressable JS - thanks LeoDutra

## 11/08/2012

* Replaced base controller in demo with FileDownloadAttribute that allows setting cookie name and path on a per action basis. - contributed by https://github.com/rdefreitas

## 09/18/2012 - 1.3.3

* Removed iframe removal after file download all-together. This caused issues for Firefox under certain conditions and certainly isn't necessary. (Just keeps the DOM clean..)

## 09/06/2012 - 1.3.2

* Fixed a bug that intermittently occured in Firefox where a file download would complete but the built in browser save dialog would not appear
* Merged in a pull from doronhorwitz surrounding special character encoding. Thanks doronhorwitz!
* Added jQuery.noConflict() to avoid $ conflicts that were occuring for some users

## 06/26/2012 - 1.3.1

* Fixed a regression bug where POST file downloads weren't working properly in IE 6 or IE 7

## 06/13/2012 - 1.3.0

* Added mobile browser support. The Android browser is [unable](http://code.google.com/p/android/issues/detail?id=1780) to support file downloads initiated by a non-GET requests
* Thanks to [itsadok](https://github.com/itsadok) for fixing a bug dealing with character encoding and escaping with non-GET requests

## 04/10/2012 - 1.2.1

* The iframe used in the POST was accidentally visible, this has been fixed

## 04/09/2012 - 1.2.0

* Added ability to specify an _httpMethod_ to perform the file download using. Useful for doing FORM submits that result in a file download
* Added _data_ object which can be used with any _httpMethod_ request to set parameters. This can be a key=value string or an object

## 04/09/2012 - 1.1.0

* Added new options arguments to make it very easy to pop up a jQuery Dialog, you just provide a "preparingMessageHtml" and/or "failMessageHtml"

## 03/22/2012 - 1.0.1

* Added more robust handling of certain kinds of file download errors in < IE9\. These versions of IE can disallow access to an iframe after an error has occured because the browser will display it's built in error page which exists in 'another domain' blocking JavaScript access to the iframe
* Switched iframe creation over to appendTo rather than append

## 03/21/2012 - 1.0.0

* Initial release
