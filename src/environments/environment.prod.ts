const url1 : string = "https://appcomputadoras.cloudns.cl/wordPress/wp-json/wc/v3"
const authUrl1 : string = "https://appcomputadoras.cloudns.cl/wordPress/wp-json/jwt-auth/v1/token"
const tokenVerifyUrl1 : string = "https://appcomputadoras.cl/wordPress/wp-json/jwt-auth/v1/token/validate"


export const environment = {
  production: true,
  backend_api_url: url1,
  auth_url: authUrl1,
  token_verify_url: tokenVerifyUrl1,
  readOnlyKeys:{
    consumer_key: 'ck_f65eeb35ca9b915bc61c33428effd8315b59ff99',
    consumer_secret: 'cs_30180fa419f2496c77881bdaf95639b43d81c6e5'
  },
  writableKeys:{
    consumer_key: 'ck_cb785663dc9bb808aa8a05d3c4ee9fac9c724aa3',
    consumer_secret: 'cs_aabf27f649afd85d999211ef2d6a80bd07c9754e'
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
