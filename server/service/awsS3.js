import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const s3lient = new S3Client({
    region: 'ap-south-1',
    credentials:{
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
   
})

export const createUploadUrl = async({key , contentType})=>{
    const command = new PutObjectCommand({  //putobjectcommand is used for uploading its like post req
        Bucket: "kotiyacloudstoragee",
        Key : key,
        ContentType : contentType,
    })

    const url = await getSignedUrl(s3lient, command , {
        expiresIn: 300 , //5min 
        signableHeaders : new Set(["content-type"]) // this will sign the url 
    })

    return url
}

export const getUploadedurl = async({key , download = false , filename})=>{ // we are not using this inted of this we are using cloudfront to get url so it will load faster 
    const command = new GetObjectCommand({  //putobjectcommand is used for uploading its like post req
        Bucket: "kotiyacloudstoragee",
        Key : key,
        ResponseContentDisposition : `${download ? "attacment" : "inline" }; filename=${encodeURIComponent(filename)}`,
    })

    const url = await getSignedUrl(s3lient, command , {
        expiresIn: 300 , //5min 
    })

    return url
}

export const getUploadedAwsMetadata = async(key )=>{
    const command = new HeadObjectCommand({  
        Bucket: "kotiyacloudstoragee",
        Key : key,
    })
     return await s3lient.send(command)  }

export const deleteUploadedAwsFile = async(key )=>{
    const command = new DeleteObjectCommand({   //single file delete
        Bucket: "kotiyacloudstoragee",
        Key : key,
    })

     return await s3lient.send(command)

}     

export const deleteUploadedAwsFiles = async(keys )=>{
    const command = new DeleteObjectsCommand({   //multi delete deleting directores and files and dir inside that directory
        Bucket: "kotiyacloudstoragee",
        Delete: {
         Objects: keys,  // this will  be an array of keys
         Quiet: false, // set true to skip individual delete responses
    },
    })

     return await s3lient.send(command)

}     
