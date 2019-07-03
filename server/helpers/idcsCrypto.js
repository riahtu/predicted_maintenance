const crypto = require("crypto");
let tenantName = undefined;
let obfuscationKey = undefined;
let tenantCert = undefined;

// The loginCtx and errorCtx are both obfuscated by encrypting them with an
// key derived from the IDCS tenant name.
//
// To generate the key perform the following steps:
// 1) acquire the tenant name
//    The most readily available source of this value is an IDCS Access Token.
//    An IDCS AT is a JWT and the value of the user.tenant.name claim contains
//    the string we need.
// 2) translate the tenant name to lowercase ASCII
// 3) Perform a SHA-256 Message Digest on lowercase tenant name
//
// The results of that is 32 bytes
// The first 16 bytes of that will be used as the key

// To decrypt the loginCtx:
//
// * Use a cipher of type AES 128 CBC with PKCS5 Padding
// * The Initialization Vector (IV) is 16 bytes of NUL (i.e. ASCII code 0)
// * The encrypted data is a Base64 encoded UTF-8 string

const setTenantName = t => {
  let tenantName = t;
  let hash = crypto
    .createHash("sha256")
    .update(tenantName)
    .digest();
  console.log("Hash length is " + hash.byteLength);
  obfuscationKey = hash.slice(0, 16);
  console.log("Key length is " + obfuscationKey.byteLength);
};

exports.setTenantName = setTenantName;

function decrypt(encrypted) {
  const iv = Buffer.alloc(16);
  iv.fill(0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", obfuscationKey, iv);
  var decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  // console.log("loginCtx decrypted: " + decrypted);

  return decrypted;
}
exports.decrypt = decrypt;

// The signature on the POST data is not that complicated

// we need the tenant certificate (which we get from the JWKS URI)
// and then it's a simple SHA 256 verifier

function setTenantCert(cert) {
  // this is a trick.
  // "crypto" doesn't seem to have a simple function to load a PEM cert.
  // So to make sure I have a valid cert I just encrypt a nonsense string
  try {
    crypto.publicEncrypt(cert, Buffer.from("foo"));

    // No exception means everything went fine.
    // in that case save the cert into the const
    tenantCert = cert;
  } catch (err) {
    console.error("Tenant certificate does not appear to be valid!");
  }
}
exports.setTenantCert = setTenantCert;

// verifySignature is used to verify the signature of an incoming POST
// i.e. the handoff from IDCS to the custom login app
// Params:
// * what   : the string literal "loginCtx" or "errorCtx"
// * data   : the POST param's content
// * sig    : the signature (req.body.signature)
function verifySignature(what, data, sig) {
  const verifier = crypto.createVerify("sha256");
  verifier.update(what, "utf8");
  verifier.update(data, "utf8");

  console.log("Verifying signature");
  if (verifier.verify(tenantCert, sig, "base64")) {
    console.log("Signature verified");
    return;
  } else {
    console.error("Signature did NOT verify!");
    throw "Invalid request. Please see server side logs.";
  }
}

exports.verifySignature = verifySignature;

const SALT_LENGTH = 8;
const TOTAL_LENGTH = 4;
const DATA_LENGTH = 4;
const TAG_LENGTH = 2;

// TODO: cleanup code...
function decryptSocial(encryptedString, clientSecret) {
  // convert encryptedStrign to array of bytes
  const data = Buffer.from(encryptedString, "base64");

  // console.log('client secret: ' + clientSecret);
  //buffer
  const salt = data.slice(0, SALT_LENGTH);
  // console.log('salt: ' + salt);
  // console.log('data length: before: ' + data.length);
  data = data.slice(SALT_LENGTH, data.length);
  // console.log('data length: after: ' + data.length);
  const headerOffset = 0;
  const totalLength = data.readInt32LE(headerOffset);
  headerOffset += TOTAL_LENGTH;
  // console.log('data length: ' + data.length);
  // console.log('total length: ' + totalLength);

  if (totalLength != data.length) {
    return null;
  }
  const dataLength = data.readInt32LE(headerOffset);
  headerOffset += DATA_LENGTH;
  const ivLength = data[headerOffset++];
  headerOffset++;
  // console.log('iv.length: ' + ivLength);

  const encryptedHmacData = data.slice(headerOffset, headerOffset + dataLength);
  headerOffset += dataLength;
  //buffer
  const iv = data.slice(headerOffset, headerOffset + ivLength);

  // HMAC header format - [ U32(LEN) | U32(DATALEN) | U16(TAGLEN) | DATA |
  // TAG ]
  // Resetting header offset for encrypted hmac data processing
  headerOffset = 0;
  const encryptedDataTotalLength = encryptedHmacData.readInt32LE(headerOffset);
  headerOffset += TOTAL_LENGTH;
  if (encryptedDataTotalLength != encryptedHmacData.length) {
    console.log("something is broken");
  }
  const encryptedDataLength = encryptedHmacData.readInt32LE(headerOffset);
  headerOffset += DATA_LENGTH;

  headerOffset += TAG_LENGTH;
  //buffer
  const encryptedData = encryptedHmacData.slice(
    headerOffset,
    headerOffset + encryptedDataLength
  );

  //buffer
  const decryptionKey = generateSocialKey(salt, clientSecret);

  const decipher = crypto.createDecipheriv("aes-128-cbc", decryptionKey, iv);
  const decrypted = decipher.update(encryptedData);
  decrypted += decipher.final("utf8");
  console.log("userData  decrypted: " + decrypted);
  return decrypted;
}

function generateSocialKey(salt, clientSecret) {
  //buffer
  const secretBytes = Buffer.concat([salt, Buffer.from(clientSecret, "utf8")]);
  const keyBytes = crypto
    .createHash("sha256")
    .update(secretBytes)
    .digest();

  //byte[] macKeyBytes = Arrays.copyOfRange(keyBytes, 0, 16);
  const aesKeyBytes = keyBytes.slice(16, 32);
  return aesKeyBytes;
}

exports.decryptSocial = decryptSocial;
