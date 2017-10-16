# jquery.FileDownload

A jQuery plugin that allows for an AJAX-like file download experience.

## Getting Started

### Prerequisites
* jQuery 1.6+

### Installing
```html

```

## Supported Browsers
* Internet Explorer 6+
    * Works fine for standard use cases except in < IE9 where JavaScript access to 
    the *failed* response HTML does not (and can't) work reliably 
    due to browser iframe constraints.
* Firefox 11+
    * Reasonably sure it will work on earlier versions.
* Chrome 17+
    * Reasonably sure it will work on earlier versions.
* iOS 5.0+
    * Reasonably sure it will work on earlier versions.
* Android 4.0+
    * Non-GET requests do not work due to a long-standing 
    [bug](http://code.google.com/p/android/issues/detail?id=1780) in the Android browser.
    This is handled 'gracefully' with a message to the user.

## Alternatives
[FileSaver.js](https://github.com/eligrey/FileSaver.js/) might be a better solution if you need to support modern browsers only.

## Versioning

We use [SemVer](http://semver.org/) for versioning.
For the versions available, see the [tags on this repository](https://github.com/Aternus/jquery.fileDownload/tags). 

## Authors

* **John Culviner** - *Initial work* - [johnculviner](https://github.com/johnculviner)

See also the list of [contributors](https://github.com/Aternus/jquery.fileDownload/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* 1337 Red Balloons.
