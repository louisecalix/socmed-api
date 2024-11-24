import Profile from '../../models/profile.model.js';
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { encrypt_File } from '../../utils/encrypt_image.js';

import formidable from "formidable";
import { fileURLToPath } from "url";


// Getting __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class ProfileController {
  constructor() {
    this.profile = new Profile();
  }


  async getProfile(req, res) {
    // const { user_id } = req.params;s
    const user_id = res.locals.user_id;
    try {
      const userProfile = await this.profile.getProfile(user_id);
      res.json({ success: true,
        data: {
            profile_id: userProfile.profile_id,
            user_id: userProfile.user_id,
            firstname: userProfile.firstname,
            lastname: userProfile.lastname,
            course_strand: userProfile.course_strand,
            year_level: userProfile.year_level,
            section: userProfile.section,
            email: userProfile.email,
            username: userProfile.username,
            bio: userProfile.bio,
            followers_count: userProfile.followers_count,
            following_count: userProfile.following_count,
            pfp: userProfile.profile_pic,  // Profile picture
            header: userProfile.header_pic  // Header picture
        } });
    } 
    catch (err) {
      res.json({ success: false, message: err.toString() });
    } 
    finally {
      res.end();
    }
  }

  async updateProfile(req, res) {
    const user_id = res.locals.user_id;  
    const { bio } = req.body;

    try {
        const updatedBio = await this.profile.updateProfile(user_id, bio || null);
        res.json({ success: true, data: { bio: updatedBio } });
    } catch (err) {
        console.error('<error> Failed to update profile:', err);
        res.json({ success: false, message: err.toString() });
    } finally {
        res.end();
    }
}

    async getProfileByProfileID(req, res) {
        const { profile_id } = req.params;
        try {
            const userProfile = await this.profile.getProfileByProfileID(profile_id);
            res.json({ success: true,
              data: {
                  profile_id: userProfile.profile_id,
                  user_id: userProfile.user_id,
                  firstname: userProfile.firstname,
                  lastname: userProfile.lastname,
                  course_strand: userProfile.course_strand,
                  year_level: userProfile.year_level,
                  section: userProfile.section,
                  email: userProfile.email,
                  username: userProfile.username,
                  bio: userProfile.bio,
                  followers_count: userProfile.followers_count,
                  following_count: userProfile.following_count,
                  pfp: userProfile.profile_pic,  // Profile picture
                  header: userProfile.header_pic  // Header picture
              } });
          } 
          catch (err) {
            res.json({ success: false, message: err.toString() });
          } 
          finally {
            res.end();
          }
        }


  
async uploadPfp(req, res) {
    const user_id = res.locals.user_id;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
       

        const file = files.image && Array.isArray(files.image) ? files.image[0] : files.image;
        
        if (!file || !file.filepath) {
            console.error('File path is missing or incorrect field name.');
            return res.status(400).send('File path is missing or incorrect field name.');
        }

        try {
            // const image_type = fields.image_type || 'profile';  // Default to 'profile'
            const result = await this.profile.upload_pfp(user_id, file);

            // Return the encrypted filename in the response
            res.json({
                success: true,
                data: { result
                   
                },
            });

        } catch (error) {
            console.error(`Error uploading file: ${error.message}`);
            return res.status(500).send(`Failed to upload the file: ${error.message}`);
        }
    });
}

        
            // res.writeHead(200, {
            //     'Content-Type': file.mimetype,
            //     'Content-Disposition': `inline; filename="${file.originalFilename}"`,
            // });
            // const readStream = fs.createReadStream(file.filepath);
            // readStream.pipe(res);
       
  async uploadHeader(req, res) {

    const user_id = res.locals.user_id;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
       

        const file = files.image && Array.isArray(files.image) ? files.image[0] : files.image;
        
        if (!file || !file.filepath) {
            console.error('File path is missing or incorrect field name.');
            return res.status(400).send('File path is missing or incorrect field name.');
        }

        try {
           
            const result = await this.profile.upload_header(user_id, file);

           
            res.json({
                success: true,
                data: {
                    result
                    
                    
                },
            });

        } catch (error) {
            console.error(`Error uploading file: ${error.message}`);
            return res.status(500).send(`Failed to upload the file: ${error.message}`);
        }
    });
}
  async updateImage(req, res) {
      const user_id = res.locals.user_id;
      const image_id = req.params.image_id;
      const form = formidable({ multiples: true });

      form.parse(req, async (err, fields, files) => {
          if (err) {
              console.error('Error parsing the file:', err.message);
              return res.status(400).send('Error parsing the file.');
          }

          const file = files.image ? files.image[0] : null;
          // const image_id = fields.image_id; 

          if (!file || !file.filepath || !image_id) {
              console.error('File path or image_id is missing.');
              return res.status(400).send('Required fields are missing.');
          }

          try {
              const result = await this.profile.update_image(user_id, image_id, file);

              res.json({
                success: true, 
                data: {result}
              });

              res.end();

              
          } catch (error) {
              console.error(`Error updating file: ${error.message}`);
              return res.status(500).send(`Failed to update the file: ${error.message}`);
          }
      });
    }
  async removeUpload(req, res) {
      const user_id = res.locals.user_id;
      const image_id = req.params.image_id;

      console.log(user_id);
      console.log(image_id);

      try {
        
          const [rows] = await this.profile.db.execute(
              'SELECT file_path FROM upload_image WHERE user_id = ? AND image_id = ?',
              [user_id, image_id]
          );

          if (rows.length === 0) {
              return res.status(404).send('Image not found.');
          }

          const filePath = path.resolve(__dirname, `../../../${rows[0].file_path}`);

      
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`File removed from uploads folder: ${filePath}`);
          } else {
              console.warn(`File not found at path: ${filePath}`);
          }

      
          await this.profile.remove_upload(user_id, image_id);

          res.status(200).send({ message: 'Image and database entry removed successfully.' });
      } catch (error) {
          console.error(`Error removing upload: ${error.message}`);
          res.status(500).send(`Failed to remove the upload: ${error.message}`);
      }
  }





  }

  export default ProfileController;
