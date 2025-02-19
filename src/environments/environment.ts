// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  backend: 'http://127.0.0.1:8000/api',
  base_url_backend: 'http://127.0.0.1:8000',
  // accet_url: "http://127.0.0.1:8000/storage",

  expirationTime: 0,

  default_statut_for_demands: "Non Traité",
};
