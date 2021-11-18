# Native Android and iOS Apps for the Turing Board

The hardware on the Turing Board is to be interfaced with via the Turing Board app available on both Android and iOS. This app is built with [React Native](https://reactnative.dev/).

### Demo

The user is to sign in with an account they can create on the app. From there, they will be taken to a Dashboard screen that opens up the utility of the Turing Board.

<p align="center">
    <img src="./README/UI.gif"/>
<p>

### Usage for Developers

First, clone the repository to your local file system.

```
$ git clone https://github.com/TuringBoard/turing-board-native-app
```

Before installing all the dependencies, ensure you have [Node](https://nodejs.org/en/) installed, version 12 or higher is required.

```
$ node -v
v12.18.2
```

Then, install the Expo CLI

```
$ npm install --global expo-cli
```

Install the React Native CLI

```
$ npm install -g react-native-cli
```

Now you may start installing the dependencies required.

```
$ npm install
```

After installing the node modules, you want to edit one of package files to avoid getting an annoying error regarding `AsyncStorage`. Go to `node_modules/@firebase/auth/dist/rn/index.js`. Change line 5 everytime after you do an `npm install` from:

```
var asyncStorage = require('react-native')
```

to:

```
var asyncStorage = require('@react-native-async-storage/async-storage')
```

If you receive the error that reads:

```
TypeError: undefined is not an object (evaluating '_react.PropTypes.number')
```

This is because the react-native-circular-slider dependecy is calling `PropTypes` from the `react` package. You need install `prop-types` by running:

```
npm install prop-types --save
```

and then change the import statements in `node_modules/react-native-circular-slider/src/CircularSlider.js` and `node_modules/react-native-circular-slider/src/ClockFace.js` from:

```
import {PropTypes} from 'react';
```

to:

```
import PropTypes from 'prop-types';
```
