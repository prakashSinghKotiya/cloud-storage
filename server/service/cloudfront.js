import { getSignedUrl } from "@aws-sdk/cloudfront-signer"





const distribution = process.env.CLOUDFRONT_DISTRIBUTION; // this will also get from cloudfront 
const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY // will create this using open ssl
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR; // we will get this from cloudfront keypair id 
const dateLessThan = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // after this it will expire 


export const cloudfrontSignedUrl = ({key, download = false , filename})=>{ // types of controller for get files using cf
 
const url = `${distribution}/${key}?response-content-disposition=${encodeURIComponent(`${download ? "attachment" : "inline"}; filename=${filename}`)}` 
                             // we have to update policy in cloudfront for these query-params of content disposition to use it 
const signedUrl = getSignedUrl({
  url,
  keyPairId,
  dateLessThan,
  privateKey,
});
console.log(signedUrl)
return signedUrl

} // we are only using cloudfront for get so it will load faster  insted of getting directly using aws s3 signed url 
//created private and public key by this command 
//Private Key: openssl genrsa -out private_key.pem 2048 
//Public Key: openssl rsa -in private_key.pem -pubout -out public_key.pem
