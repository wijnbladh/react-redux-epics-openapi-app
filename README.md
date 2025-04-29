# Update 2025-04-29

You probably no longer need the side-effect mechanics described in this repository. Please have a look at [React Query](https://ui.dev/why-react-query). I'd still recommend getting familiar with the OpenAPI/Swagger stuffs.

# What is this

React is a no-brainer for UI rendering and Redux is nice for managing the single source of truth about the application state. While those tools are probably familiar to most developers, this repository contains a sample project that includes two more things:

- `redux-observable` or "Epics" for managing your dirty side-effects (usually this means backend data fetches and any other logic you do not want to couple with a UI component or a Redux reducer)
- OpenApi / Swagger comms library for more easily managed / shared communications contract with the backend(s)

## About the backend request Epics

There is a method called `createRequest` in `src/store/app/requestSlice.ts`. You should use that to create all your backend requests. See the samples in `src/store/api/postSlice.ts`.

The point here is to get the backend request states into Redux store since then your components can query about their state in order to show some UI elements or you can have some extra logic to run whenever some backend fetch finishes (these are epics too, but not ones created via `createRequest`, see for example `reactToAllUsersFetched`).

## About OpenApi comms library

This app uses https://jsonplaceholder.typicode.com/ as a mock backend. You'll find some of that API modelled into `docs/openapi/swagger.yaml`. From this model we generate most of the data classes and backend requests.

If you need to re-generate the comms library, make sure you have Java JRE installed and available on command line (`java -version` should print something reasonable). Then run this:

`./generate_openapi_files.sh`

And/or have a look inside that file to see what it does.

## (The rest:) Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
