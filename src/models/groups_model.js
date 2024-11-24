import { connection } from "../core/database.js";

export class Group{
    constructor(){
    this.connect_db = connection;
    }

    async create_group(group_name, description, creator) {

        console.log('Creating group with:', { group_name, description, creator });

        try {
            const [result] = await this.connect_db.execute(
                'INSERT INTO group_page (group_name, description, created_by) VALUES (?, ?, ?)',
                [group_name, description, creator]
            );
  
            return  { group_id: result.insertId,
                    group_name: group_name,
                    description: description 


            };
        } catch (err) {
            console.error('<error> Group.create_group', err);
            throw err;
        }
    }

    async verifyUser(user_id, group_id){
        try{
            const [rows] = await this.connect_db.execute(
                'SELECT * FROM group_members WHERE user_id = ? AND group_id= ?',
                [user_id, group_id ]
            )
            return rows[0];

        }catch(err){
            console.error('<error> Group.get_group', err)
            throw err;
        }
    }


    
    async get_group(group_id){


        try{

            const [rows] = await this.connect_db.execute(
                'SELECT * FROM group_page WHERE group_id= ?',
                [group_id]
            );
            return rows[0];

        }catch(err){
            console.error('<error> Group.get_group', err)
            throw err;
        }
    }
    async get_all_groups() {
       try{
        const[allgroups] = await this.connect_db.execute(
            'SELECT * FROM group_page'
        );
        return allgroups;

       }catch(err){
            console.error('<error>.Group.get_all_groups', err);
            throw err;
        }
    }

    async get_usersGroup(user_id) {
        try {
            const [groups] = await this.connect_db.execute(
                'SELECT group_id FROM group_members WHERE user_id = ?',
                [user_id]
            );
    
            console.log('Groups found for user:', groups);
    
            if (groups.length === 0) {
                return { success: false, message: 'No groups found for this user.' };
            }
    
  
            const group_ids = groups.map(group => group.group_id);
            console.log('Group IDs:', group_ids);
    
          
            const placeholders = group_ids.map(() => '?').join(', ');
            
       
            const query = `SELECT group_name FROM group_page WHERE group_id IN (${placeholders})`;
    
     
            const [groupNames] = await this.connect_db.execute(query, [...group_ids]);
    
            console.log('Group names found:', groupNames);
    
            if (groupNames.length === 0) {
                return { success: false, message: 'No group names found for the given user ID.' };
            }
    
            return groupNames.map(group => group.group_name);
        } catch (err) {
            console.error('<error> Group.get_usersGroup', err);
            return { success: false, message: err.toString() };
        }
    }
    



    async delete_group(group_id){
        try{
            const[result] = await this.connect_db.execute(
                'DELETE FROM group_page WHERE group_id=?',
                [group_id]
            );
            return result;
        }catch (err) {
            console.error('<error> Group.delete_group', err);
            throw err;
        }
    }




    async update_role(group_id, user_id, role){

        try{

            const [result] = await this.connect_db.execute(
                'UPDATE group_members SET role = ? WHERE group_id= ? AND user_id = ?' ,
                [role, group_id, user_id]
            );

            return result;


        }catch(err){
            console.log('<error> Group.update_role', err);
            throw err;
        }

    }





    async update_groupInfo(group_id,group_name, description){
        try{
            console.log('group_id:', group_id);
            console.log('group_name:', group_name);
            console.log('description:', description);
            

            const [result] = await this.connect_db.execute(
                'UPDATE group_page SET group_name = ?, description = ? WHERE group_id= ?',
                [group_name, description, group_id]
            );
            return result;

        }catch(err){
            console.log('<error> Group.update_groupInfo', err);
            throw err;
        }
    }




    
    async add_group_admin(group_id, user_id){
        
        try{
            
            const values = [group_id, user_id, 'Admin', 'approved'];
            
            if (values.some(value => value === undefined)){
                console.error('One or more parameters are undefined:', values);
                throw new Error('One or more parameters are undefined');
            }
            
            const [result] = await this.connect_db.execute(
                'INSERT INTO group_members(group_id, user_id, role, status) VALUES (?,?,?,?)',
                [group_id, user_id, 'Admin', 'approved']
            );

            // const role = result.role;


            



            return {role: 'Admin'};
            
            
            
            
            
        }catch (err) {
            console.error('<error> Group.add_group_admin', err);
            throw err;
        }
    }




    async submit_joinRequest(group_id, user_id){
        try{
            const [existing] = await this.connect_db.execute(
                'SELECT * FROM group_members WHERE group_id= ? AND user_id= ?',
                [group_id, user_id]
            );

            if(existing.length > 0){
                throw new Error('User is already a member.');
            }

            const [join] = await this.connect_db.execute(
                'INSERT INTO group_members(group_id, user_id,role, status) VALUES(?,?,?,?)',
                [group_id, user_id, 'Member', 'pending']
            );

            return join;
        }catch (err) {
            console.error('<error> Group.submit_joinRequest:', err);
            throw err;
        }
    }
    
    
    
    async add_group_members(group_id, user_id){
        try{
            const values = [group_id, user_id];

            if (values.some(value => value === undefined)){
                console.error('One or more parameters are undefined:', values);
                throw new Error('One or more parameters are undefined');
            }

            const [result] = await this.connect_db.execute(
                'INSERT INTO group_members(group_id, user_id) VALUES(?,?)',
                [group_id, user_id]
            );

            return result;



        }catch (err) {
        console.error('<error> Group.add_group_members', err);
        throw err;
    }
    }

    async approve_group_members(group_id,user_id){

        try{
            console.log("User: ", user_id);
            const [row] = await this.connect_db.execute(
                'UPDATE group_members SET status = ? WHERE group_id=? AND user_id= ?',
                ['approved',group_id,user_id]
            );

            if (row.affectedRows === 0){
                throw new Error('Approval not found');
            }
            return row;
        }catch (err) {
            console.error('<error> Group.approve_group_members', err);
            throw err;
        }

    }

    async decline_group_members(group_id, user_id) {
        try {
            const [rows] = await this.connect_db.execute(
                'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
                [group_id, user_id]
            );
            if (rows.affectedRows === 0) {
                throw new Error('Approval not found');
            }
            return { message: 'Group Member: Deleted!' };
        } catch (err) {
            console.error('<error> Group.decline_group_members', err);
            throw err;
        }
    }
    


}

export default Group;
