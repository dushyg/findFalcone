# FindingFalcone

## Problem statement

After the recent Falicornian war, King Shan has exiled Queen Al Falcone for 15 years. However, if he finds her before the 15 years are up, she has to go into exile for another 15 years!

King Shan has received intelligence that Al Falcone is hiding in one of six neighbouring planets. To solve this problem this application helps you to choose the planets to search, and the vehicles to use in Finding Falcone.

You need to search across 4 planets from a list and use one of the available vehicles.

Every vehicle can cover a maximum distance. So it cant be used for a planet that is at a distance greater than the max it can travel.

Once a planet is selected it is removed from list of available planets.

Once a vehicle is selected its available count is reduced by one in Vehicle Inventory.

To honor above constraints, if a planet or vehicle is set / changed, all planets and vehicles
to the right are reset.

Planet searched & vehicle used for search are grouped into a destination widget.
There is a typeahead control per widget that allows user to easily search planets from a list.

As soon as user finishes setting up all planets to be searched and vehicles used for the search, the 'Find' button is enabled to initiate the search.

## Running the application

1. Unzip the archive FEproblem1.zip
2. Open a terminal
3. Change into the unzipped directory FEproblem1 e.g cd FEproblem1
4. Install all the npm packages required by the application by typing 'npm install'
5. Build and start the application by typing 'npm start'
   This command will:
   a. Check the code for any tslint errors
   b. Build the app using angular cli and The build artifacts will be stored in the `dist/` directory.
   c. Run unit / integration tests using Jest  
   d. Create documentation for the application using compodoc library which can be accessed by clicking on the 'docs' link in application header.
   e. Serve the contents of the 'dist' directory using http-server web server at port 4200.
   f. A new tab will be opened in your default browser and application will be loaded in it.

## Directly running unit test cases from command line

1. Open a terminal
2. Change into the unzipped directory FEproblem1 e.g cd FEproblem1
3. Assuming you have run npm install earlier, type npm test or npm t
4. Test cases will start executing using Jest testing framework in the terminal.
5. Test report will also show code coverage for the application.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## CI / CD using Travis

This project using Travis CI for continiuos integration and deployment.
As soon as a new pull request is submitted on github, the code is checked for linting errors,
build errors, unit test case success. The code is then deployed to Surge web servers.

## Application deployment on Surge

This project is configured to be deployed to Surge web servers as part of CI/CD pipeline.
The application can be accessed at this url : http://findingfalcone-dushyg.surge.sh

'npm run build' script also runs the script 'npm run surge-create-200html'
It creates a 200.html which is a copy of dist/index.html to allow Surge application server to handle urls not associated with any deployed resources and redirect such requests to application home page.

## Responsive mobile first application design

This project uses CSS Grid, Flexbox and css media queries to enable the app to be used on a wide range of devices.

## Mocking Http API calls

This project uses angular-in-memory-web-api to mock http api calls in development mode.
This is so that UI development is not hampered in case the api goes down.
This also reduces load on api servers during development.

## Webpack customizations

This project uses @angular-builders/custom-webpack for extending webpack configuration that comes with angular cli.
Default webpack config can be overridden in custom-webpack.config.js file.

## Documentation

Various methods and classes from the code and its usage has been documented using compodoc tool. Documentation can be accessed using the docs link in application header in production mode.
Documentation can also be served locally using the command 'npm run serve:doc' and opening up http://127.0.0.1:8080

## Angular onPush Change Detection

The application uses onPush change detection strategy for various components avoid unncessary re-renders.

## Lazy loading 'result module'

To improve initial page load times, this application makes use of angular lazy loading feature so that any code from a feature module is downloaded only when it is needed (that feature is used by the user for the first time)

## Webpack bundle analyzer

This project uses webpack-bundle-analyzer to monitor size of various code modules / artifacts

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

In order to serve the documentation generated by compodocs library, the application will start http-server with 'npm start' command. This is because 'ng serve' command by default uses webpack-dev-server which serves the application from memory and does not serve the dist directory which contains documentation code.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Building just the code using Angular CLI

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help with Angular CLI

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Developer notes

## Facade Service with a subject

This application follows 'Facade Service with a subject' design pattern to provide encapsulation to all the http services and state implementation.
Application state is stored in a BehaviorSubject which is then exposed as an observable stream of IFalconAppState objects.
Creating this facade helps to change implementation to a store based state storage implementation like ngrx / redux later on if app complexity increases.

## Setting up Jest testing framework

Refer to steps in https://www.npmjs.com/package/jest-preset-angular

npm install -D jest jest-preset-angular @types/jest

Basically add following key value pair in package.json:

"jest": {
"preset": "jest-preset-angular",
"setupFilesAfterEnv": [
"./setupJest.ts"
]
}

Add setupJest.ts file at root of the project with following contents:
import 'jest-preset-angular';

Delete or rename src/test.ts (which has karma specific settings) so that it doesnt conflict with Jest.
Jest uses jsdom to run the tests in place of a browser instance unlike Karma.

## Setting up angular-in-memory-web-api

follow steps in https://www.npmjs.com/package/angular-in-memory-web-api
npm i -D angular-in-memory-web-api

a. Create a class that implements InMemoryDbService.
It has a method createDb(reqInfo?: RequestInfo): {}

To conditionally handle post or get requests provide below method:
post(reqInfo: RequestInfo)
See src\app\finder-board\services\mockData\app.data.ts for implementation details.

b. Add below module in app module imports:

environment.production
? []
: HttpClientInMemoryWebApiModule.forRoot(AppData, {
delay: 100,
host: constants.apiDomain,
apiBase: '/',
rootPath: '/',
passThruUnknownUrl: true,
}),
]
