// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const url1 : string = "https://appcomputadoras.cloudns.cl/wordPress/wp-json/wc/v3"
const authUrl1 : string = "https://appcomputadoras.cloudns.cl/wordPress/wp-json/jwt-auth/v1/token"
const tokenVerifyUrl1 : string = "https://appcomputadoras.cl/wordPress/wp-json/jwt-auth/v1/token/validate"


export const environment = {
  production: false,
  backend_api_url: url1,
  auth_url: authUrl1,
  token_verify_url: tokenVerifyUrl1,
  readOnlyKeys:{
    consumer_key: 'ck_f2298e52b30995494ac599b75be7acaff55f357d',
    consumer_secret: 'cs_8bcce7b4350e2f39a609746ed551f330caf39d5e'
  },
  writableKeys:{
    consumer_key: 'ck_558ea79d770e2de394614871d2111a47998ba422',
    consumer_secret: 'cs_5bf9960f54e1702d69c7e383465b84954a8d1f46'
  },
  states: [
    {value: 'JL', name: 'Jalisco'},
    {value: 'AG', name: 'Aguas calientes'},
    {value: 'DF', name: 'Distrito Federal'},
    {value: 'MC', name: 'Michoacán'},
    {value: 'SN', name: 'Sinaloa'},
    {value: 'YN', name: 'Cucatán'}
  ]
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
