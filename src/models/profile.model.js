import {connection}  from "../core/database.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encrypt_File } from "../utils/encrypt_image.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Profile {
    constructor() {
        this.db = connection;
    }

    /**
     * Get user's profile
     * @param {string} user_id
     * @returns {Object}
     * @throws {Error}
     */

    // CREATE PROFILE
    // async createProfile(user_id) {
    //     try {
    //         const [results,] = await this.db.execute(
    //             ''
    //         )
    //     }
    // }


    // CRUD - READ
    async getProfile(user_id) { 
        try {
            const [results,] = await this.db.execute(
                'SELECT profiles.profile_id , user_account.user_id, user_account.firstname, user_account.lastname, user_account.course_strand, user_account.year_level, user_account.section, user_account.email,  profiles.username,  profiles.bio, profiles.followers_count, profiles.following_count FROM user_account JOIN profiles ON user_account.user_id = profiles.user_id WHERE user_account.user_id = ?',
                [user_id]
            );
            const [pfp] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type= ?',
                [user_id, 'profile_pic' ]
            )

            const [hdr] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type= ?',
                [user_id, 'header_pic' ]
            )

            const profile_pic = pfp.length ? pfp[0].file_path : null;
            const header_pic = hdr.length ? hdr[0].file_path : null;
    
            
            return { ...results[0], profile_pic, header_pic };
        }
        catch(err) {
            console.error('<error> profile.getProfile', err);
            throw err;
        }
    }

    async getProfileByProfileID(profile_id) {
        try {
            const [results,] = await this.db.execute(
                'SELECT profiles.profile_id, user_account.user_id, user_account.firstname, user_account.lastname, user_account.course_strand, user_account.year_level, user_account.section, user_account.email, profiles.username, profiles.bio, profiles.followers_count, profiles.following_count FROM profiles JOIN user_account ON user_account.user_id = profiles.user_id WHERE profiles.profile_id = ?',
                [profile_id]
            );
    
            const [pfp] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = (SELECT user_id FROM profiles WHERE profile_id = ?) AND image_type = ?',
                [profile_id, 'profile_pic']
            );
    
            const [hdr] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = (SELECT user_id FROM profiles WHERE profile_id = ?) AND image_type = ?',
                [profile_id, 'header_pic']
            );
    
            const profile_pic = pfp.length ? pfp[0].file_path : null;
            const header_pic = hdr.length ? hdr[0].file_path : null;
    
            return { ...results[0], profile_pic, header_pic };
        } catch (err) {
            console.error('<error> profile.getProfileByProfileID', err);
            throw err;
        }
    }
    



    /**
     * Update user's profile
     * 
     * @param {string} user_id
     * @param {string} profile_pic
     * @param {string} header
     * @param {string} bio
     * @returns {Object}
     * @throws {Error}
     */

    
    async updateProfile(user_id, bio) {
        try {
            const [results] = await this.db.execute(
                'UPDATE profiles SET bio = ? WHERE user_id = ?',
                [bio, user_id]
            );
    
            // Return the updated bio directly
            return bio;
        } catch (err) {
            console.error('<error> profile.updateProfile', err);
            throw err;
        }
    }

    
    async uploadFile (user_id, file, image_type) {
        try {
            const oldPath = file.filepath;
            if (!oldPath) {
                throw new Error("File path is missing");
            }
    
            const uploadsDir = path.resolve(__dirname, '../../../static/uploads');
            if (!fs.existsSync(uploadsDir)) {
                await fs.promises.mkdir(uploadsDir, { recursive: true });
            }
    
          // Get the original filename and extension
          const originalFileName = file.originalFilename || file.newFilename;
          const fileExtension = path.extname(originalFileName);
          const baseFileName = path.basename(originalFileName, fileExtension);
  
          // Get the current timestamp and append it to the base filename
          const timestamp = Date.now();
          const encryptedFileName = encrypt_File(baseFileName + timestamp); // Including timestamp in the encryption
          const newFileName = encryptedFileName + fileExtension; // Add the extension back
          const newPath = path.join(uploadsDir, newFileName);
            const uploadPromise = new Promise((resolve, reject) => {
                const readStream = fs.createReadStream(oldPath);
                const writeStream = fs.createWriteStream(newPath);
    
                readStream.pipe(writeStream);
    
                writeStream.on('finish', async () => {
                    const imageUrl = `/uploads/${newFileName}`;
                    try {
                        const [result] = await this.db.execute(
                            'INSERT INTO upload_image(user_id, image_type, file_name, file_path) VALUES (?,?,?,?)',
                            [user_id, image_type, originalFileName, imageUrl]
                        );
                        resolve({
                            message: 'Successfully uploaded',
                            imageUrl: imageUrl,
                            originalFileName: originalFileName,
                            image_id: result.insertId
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
    
                writeStream.on('error', (error) => {
                    reject(new Error(`Error writing file: ${error.message}`));
                });
            });
    
            return await uploadPromise;
    
        } catch (error) {
            console.error(`Error in file upload process: ${error.message}`);
            throw new Error(`Error uploading file: ${error.message}`);
        }
    };
    

    
        async upload_pfp(user_id, file) {
            return this.uploadFile(user_id, file, 'profile_pic');
        }
    
        async upload_header(user_id, file) {
            return this.uploadFile(user_id, file, 'header_pic');
        }
    
      
    
        async update_image(user_id, image_id, file) {
            try {
                const oldPath = file.filepath;
                if (!oldPath) {
                    throw new Error("File path is missing");
                }
        
          
                const uploadsDir = path.resolve(__dirname, '../../static/uploads');

                if (!fs.existsSync(uploadsDir)) {
                    await fs.promises.mkdir(uploadsDir, { recursive: true });
                }
        
               
                const originalFileName = file.originalFilename || file.newFilename;
                const fileExtension = path.extname(originalFileName);
                const baseFileName = path.basename(originalFileName, fileExtension);
        
               
                const timestamp = Date.now();
                const encryptedFileName = encrypt_File(baseFileName + timestamp); 
                const newFileName = encryptedFileName + fileExtension; 
                const newPath = path.join(uploadsDir, newFileName);
        
                console.log(`Old path: ${oldPath}`);
                console.log(`New path: ${newPath}`);
        
                return new Promise((resolve, reject) => {
                 
                    const readStream = fs.createReadStream(oldPath);
                    const writeStream = fs.createWriteStream(newPath);
        
                 
                    readStream.pipe(writeStream);
        
                    writeStream.on('finish', async () => {
                        const imageUrl = `/uploads/${newFileName}`; 
        
                       
                        try {
                            const [result] = await this.db.execute(
                                'UPDATE upload_image SET file_name = ?, file_path = ? WHERE user_id = ? AND image_id = ?',
                                [newFileName, imageUrl, user_id, image_id]
                            );
        
                            resolve({
                                message: 'Successfully updated image',
                                imageUrl: imageUrl,
                                user_id: user_id,
                                image_id: result.insertId
                            });
                        } catch (error) {
                            reject(new Error(`Error updating database: ${error.message}`));
                        }
                    });
        
                    writeStream.on('error', (error) => {
                        reject(new Error(`Error writing file: ${error.message}`));
                    });
                });
        
            } catch (error) {
                console.error('<error> UploadFile.update_image', error);
                throw new Error(`Error updating image: ${error.message}`);
            }
        }
         
    
    async remove_upload(user_id, image_id) {
        try {
          
            const [rows] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_id = ?',
                [user_id, image_id]
            );
    
            if (rows.length === 0) {
                throw new Error("File not found in the database for the given user_id and image_id.");
            }
    
            const filePath = path.resolve(__dirname, `../../../${rows[0].file_path}`);
            
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File removed from uploads folder: ${filePath}`);
            } else {
                console.warn(`File not found at path: ${filePath}`);
            }
    
           
            const [result] = await this.db.execute(
                'DELETE FROM upload_image WHERE user_id = ? AND image_id = ?',
                [user_id, image_id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error("No rows were deleted; the specified entry may not exist.");
            }
    
            return { message: "File and database entry deleted successfully." };
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
            throw new Error(`Error deleting file: ${error.message}`);
        }
    }
    
    }

    


export default Profile;