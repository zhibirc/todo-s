# Todo-s

Your daily schedule and TODO list.

## About

This app can work both in a web browser or compile into mobile app using PhoneGap.

## Features

- add new tasks to the list and change their status;
- remove tasks which have already done;
- sort tasks by their status;
- change color theme;
- UI translation in 9 languages;
- lock/unlock UI;
- all existing tasks are stored locally and are restored when the application starts;
- user preferences are stored like tasks.

## API

### init()

Initializes the application. Invoke it once (in addition, inner mechanism prevents repeated invocations) when DOM tree is ready.

```javascript
APP.init();
```

### extend()

Uniform way to add new functionality to the app.

```javascript
APP.extend({
	newProperty: 'value',
	newMethod: function () {
		// code here
	}
});
```

## Notes

- sources are documented in details so minification before usage in production code is recommended;
- index.js file is used by PhoneGap and unnecessary (except initialization) when Todo-s is used as web application;
- performance is one of the primary basics of the app (it's even more important on mobile devices).

## Versions

Actual version of Todo-s is 1.2-beta.