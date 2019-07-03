module.exports = {
  user : process.env.NODE_ORACLEDB_USER || "rkane2342",
  
  password : process.env.NODE_ORACLEDB_PASSWORD || "Winter@@2019",
  
  connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "db1_high",
  
  externalAuth : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };

