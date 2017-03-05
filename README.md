
# Using the web interface

It is deployed on GITHub pages as a static app.

## [Launch Web Client]([https://hcl337.github.io/ancillawebclient/])

# Running the project

1. Check out repository
2. run 'npm start' to test it out locally
3. To do a production build, run 'npm run build'

## Use it it out locally
npm start

## Deploy to GITHub Pages
npm run build
npm run deploy

It is deployed here: [https://hcl337.github.io/ancillawebclient/]

# Bootstrapping the project
This is how the project was created initially to get react to function.


Below are the commands use to create the project using [create react](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages) bootstrapper from Facebook. A subset are necessary when setting up a new computer.


```sh
brew install node
# In project base directory

# Now use the easy setup for react to get started
npm install -g create-react-app

# In the base code directory where we want to create our repo, run this
create-react-app ancillawebclient

# Install ESLint stuff
npm install -g eslint-config-react-app@0.3.0 eslint@3.8.1 babel-eslint@7.0.0 eslint-plugin-react@6.4.1 eslint-plugin-import@2.0.1 eslint-plugin-jsx-a11y@2.2.3 eslint-plugin-flowtype@2.21.0

npm install -g eslint
eslint --init

# Static type checking for React
npm install --save-dev flow-bin

# Can use React Storybook to visualize components individually
npm install -g getstorybook

# To run StoryBook, type
getstorybook

# Deployment on GITHub
npm install --save-dev gh-pages

# Using the material-ui library
npm install material-ui

# Flexbox
# https://www.npmjs.com/package/react-layout-components
npm install react-layout-components --save-dev

# To actually deploy to GITHub run
npm run deploy

# To run
npm start
```

# TODO


- Create a deploy branch https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages
- Update GITHub repository to have git pages enabled and point at it.
