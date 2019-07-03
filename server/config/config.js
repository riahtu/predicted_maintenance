// environment variables are passed from host where
// docker-compose is run to container via the
// docker-compose file

// module.exports = {
//     mongoURI: process.env.DB_URI || '',
//     cookieKey: process.env.DB_PASS || ''
// };

/**
 * Sign-In Application Client Id and Client Secret
 */

const signInApp = {
  ClientId: process.env.SIGN_IN_CLIENT_ID,
  ClientSecret: process.env.CLIENT_SECRET
};

const idcsTenancyId = process.env.IDCS_TENANCY_ID;
const appCallbackUrl = encodeURIComponent(process.env.APP_CALLBACK_URL);

const ids = {
  oracle: {
    ClientId: process.env.ORACLE_CLIENT_ID,
    ClientSecret: process.env.ORACLE_CLIENT_SECRET,
    //ClientTenant: process.env.ORACLE_CLIENT_TENANT,
    ClientSelfReg: process.env.ORACLE_CLIENT_SELF_REG,
    //IDCSHost: process.env.ORACLE_CLIENT_IDCS_HOST,
    AudienceServiceUrl: `https://${idcsTenancyId}.identity.oraclecloud.com`,
    //TokenIssuer: "https://identity.oraclecloud.com/",
    //scope: "urn:opc:idm:t.user.me openid",
    //logoutSufix: "/oauth2/v1/userlogout",
    //redirectURL: process.env.ORACLE_REDIRECT,
    tokenURL: `https://${idcsTenancyId}.identity.oraclecloud.com/oauth2/v1/authorize?client_id=${signInApp.ClientId}&response_type=code&redirect_uri=${appCallbackUrl}&scope=openid&state=1234`
  },
  server: {
    APP_DEFAULT_PORT: "5000",
    IDCS_COOKIE_NAME: "idcs_user_assertion",
    IDCS_STRATEGY_NAME: "IDCSOIDC",
    APP_SEC:
      "Basic " +
      Buffer.from(signInApp.ClientId + ":" + signInApp.ClientSecret).toString(
        "base64"
      ),
    MONGO_URI: process.env.MONGO_URI
  },
  adw: {
    user : process.env.NODE_ORACLEDB_USER || "",
    
    password : process.env.NODE_ORACLEDB_PASSWORD || "",
    
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "",
    
    externalAuth : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
  },
  
  
};

module.exports = ids;
