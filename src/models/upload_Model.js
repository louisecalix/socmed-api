import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connection } from '../core/database.js';
import { encrypt_File } from '../utils/encrypt_image.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UploadFile {
    constructor() {
        this.connect = connection;
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
                        const [result] = await this.connect.execute(
                            'INSERT INTO upload_image(user_id, image_type, file_name, file_path) VALUES (?,?,?,?)',
                            [user_id, image_type, originalFileName, imageUrl]
                        );
                        resolve({
                         
                            url: imageUrl,
                          
                           
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

    async upload_id(user_id, file) {
        return this.uploadFile(user_id, file, 'id_pic');
 
   }

   async update_image(user_id, image_id, file) {
    try {
        const oldPath = file.filepath;
        if (!oldPath) {
            throw new Error("File path is missing");
        }

        const uploadsDir = path.resolve(__dirname, '../../uploads');
        const newPath = path.join(uploadsDir, file.originalFilename);

      
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const rawData = fs.readFileSync(oldPath);


        await fs.promises.writeFile(newPath, rawData);

        const imageUrl = `/uploads/${file.originalFilename}`;
        console.log(`Updating image with ID: ${image_id} for user: ${user_id}`);

   
        const [result] = await this.connect.execute(
            'UPDATE upload_image SET file_name = ?, file_path = ? WHERE user_id = ? AND image_id = ?',
            [file.originalFilename, imageUrl, user_id, image_id]
        );

        return {
            message: 'Successfully updated image',
            imageUrl: imageUrl, 
        };
    } catch (error) {
        console.error('<error> UploadFile.update_image', error);
        throw new Error(`Error updating image: ${error.message}`);
    }
}

async remove_upload(user_id, image_id) {
    try {
      
        const [rows] = await this.connect.execute(
            'SELECT file_path FROM upload_image WHERE user_id = ? AND image_id = ?',
            [user_id, image_id]
        );

        if (rows.length === 0) {
            throw new Error("File not found in the database for the given user_id and image_id.");
        }

        const filePath = path.resolve(__dirname, `../../${rows[0].file_path}`);
        
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File removed from uploads folder: ${filePath}`);
        } else {
            console.warn(`File not found at path: ${filePath}`);
        }

       
        const [result] = await this.connect.execute(
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

export default UploadFile;

