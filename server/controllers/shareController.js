import File from "../models/fileModel.js"

import crypto from "crypto"
import Sharing from "../models/shareModel.js"
import { cloudfrontSignedUrl } from "../service/cloudfront.js"




export const createShareLink = async (req, res, next) => {
    const { fileId } = req.params
    const user =  req.user
    console.log(user);
    if(!fileId) return res.status(400).json({ error : "fileId is required "})

    const file = await File.findById(fileId).lean()
    if(!file) return res.status(404).json({ error : "file not found "})

    if(file.userId.toString() !== user._id.toString()) return res.status(403).json({ error : "You can not share this file "})

    
    const token = crypto.randomBytes(32).toString("hex")
    const share = await Sharing.create({fileId, userId: user._id, token})

    const shareUrl =`${process.env.CLIENT_URL}/share/${token}`;

    return res.status(201).json({shareUrl})

    
}


export const getSharedFile = async (req, res) => {
  const { token } = req.params;
  if(!token) return res.status(400).json({ error : "token is required "})

  const share = await Sharing.findOne({ token });

  if (!share) {
    return res.status(404).json({
      error: "Share link not found",
    });
  }

  const file = await File.findById(
    share.fileId
  );

  const url =  cloudfrontSignedUrl({ 
        key:`${file._id}${file.extension}` ,
        filename : file.name })

  res.json(url);
};
