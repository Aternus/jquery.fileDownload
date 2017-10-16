# jquery.FileDownload

A jQuery plugin that allows for an AJAX-like file download experience.

## Getting Started

### Prerequisites
* jQuery 1.6+

### Installing
Include jQuery and `jquery.fileDownload.js` before the end of the `<body>`.

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>jquery.fileDownload</title>
</head>
<body>

<button class="download">Download Now!</button>

<!-- jquery.fileDownload -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdn.rawgit.com/Aternus/jquery.fileDownload/7956f750/src/jquery.fileDownload.js"></script>
<script type="text/javascript">
// download event handlers
</script>

</body>
</html>
```

### Basic Use
```js
// redefine defaults
$.fileDownload.defaults.httpMethod = 'POST';

// initiate a download
$('.download').on('click', function(e) {
    $.fileDownload('/path/to/file.ext');
    return false;
});
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
