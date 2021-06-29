import streamifier from 'streamifier';
import { uploadFile } from 'google_driver';

import { getMeById, isExistUser, findOneAndUpdateUser } from 'models/user';
import { ExceptionError } from 'ulties';
import { decodeToken } from 'ulties/token';
import Error from 'entities/Error';

export const getMe = async (req, res) => {
  const { token_user } = req.cookies;
  try {
    if (!token_user) {
      throw new ExceptionError(Error.invalidToken());
    }
    const { userId } = await decodeToken(token_user);
    const me = await getMeById(userId);
    res.json(me);
  } catch (error) {
    res.status(401).json({ error });
  }
};

export const postMe = async (req, res) => {
  try {
    const { id, base64AvatarImage, ...rest } = req.body;
    const isExistMe = await isExistUser({ id });

    if (!isExistMe) {
      throw new ExceptionError({
        name: 'UpdateMe',
        msg: "User isn't exist",
      });
    }
    const data = rest || {};
    let uploadedImage;
    if (base64AvatarImage) {
      uploadedImage = await uploadFile({
        id,
        source: streamifier.createReadStream(
          Buffer.from(base64AvatarImage, 'base64'),
        ),
      });
      data.avatar = `https://drive.google.com/uc?id=${uploadedImage.data.id}`;
    }

    const me = await findOneAndUpdateUser({ id }, data);
    if (rest.frequentlyUsedIcon) {
      res.json(me);
      return;
    }

    me.friendIds?.forEach(friendId => {
      req.app
        .get('socketio')
        .to(friendId.toString())
        .emit('update_user', {
          userId: id,
        });
    });

    res.json(me);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};
