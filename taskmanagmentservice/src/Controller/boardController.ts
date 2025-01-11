import { Request, Response } from 'express';
import knex from '../db/knex';
import axios from 'axios';
import cloudinary from '../config/cloudinary';
import upload  from '../config/multer';
import { sendNotification } from '../services/notificationService';  
import sendEmail from '../services/emailservice';  


export const createBoard = async (req: Request, res: Response): Promise<any> => {
    const { name, description, collaborator_id, status } = req.body;
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;
  
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
      if (!userResponse.data) {
        return res.status(404).json({ error: 'User not found in userservice' });
      }
  
      
      const [board_id] = await knex('boards')
        .insert({ name, description, status, user_id })  
        .returning('id');
  
      await sendEmail({
        to: userResponse.data.email,
        subject: 'Board Created Successfully',
        text: `Your board "${name}" has been created successfully.`,
      });
  
      await sendNotification({
        user_id,
        message: `Your board "${name}" has been created successfully.`,
        timestamp: new Date()
      });
  
      if (collaborator_id) {
        const collaboratorResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
        
        if (!collaboratorResponse.data) {
          return res.status(404).json({ error: 'Collaborator not found in userservice' });
        }
  
        await knex('collaborators')
          .insert({ board_id, user_id: collaborator_id });
  
        await sendEmail({
          to: collaboratorResponse.data.email,
          subject: 'Added as Collaborator',
          text: `You have been added as a collaborator to the board: ${name}`,
        });
  
        await sendNotification({
          user_id: collaborator_id,
          message: `You have been added as a collaborator to board: ${name}`,
          timestamp: new Date()
        });
      }
  
      res.status(201).json({ board_id, message: 'Board created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create board' });
    }
};


export const addCollaborator = async (req: Request, res: Response): Promise<any> => {
  const { board_id, user_id } = req.body;
  const owner_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;

  if (!owner_id || !board_id || !user_id) {
    return res.status(400).json({ error: 'Board ID, User ID, and Owner ID are required' });
  }

  try {
    const board = await knex('boards').where({ id: board_id, user_id: owner_id }).first();
    if (!board) {
      return res.status(403).json({ error: 'You do not have permission to add collaborators to this board' });
    }

    await knex('board_collaborators').insert({ board_id, user_id });

    await sendNotification({
      user_id,
      message: `You have been added as a collaborator to board: ${board.name}`,
      timestamp: new Date()
    });

    const collaboratorEmailResponse = await axios.get(`http://userservice/api/users/${user_id}`);
    await sendEmail({
      to: collaboratorEmailResponse.data.email,
      subject: 'Added as Collaborator',
      text: `You have been added as a collaborator to the board: ${board.name}`,
    });

    res.status(201).json({ message: 'Collaborator added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
};

// Upload file to Cloudinary
export const uploadFile = (req: Request, res: Response): void => {
    upload(req, res, async (err: any) => {  
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      try {
        const result = await cloudinary.uploader.upload_stream(
          { resource_type: 'auto' }, 
          (error, result) => {
            if (error) {
              return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
            }
            const fileUrl = result?.secure_url; 
            res.status(200).json({ message: 'File uploaded successfully', fileUrl });
          }
        );
  
        req.pipe(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading file' });
      }
    });
};

export const getUserBoards = async (req: Request, res: Response): Promise<any> => {
  const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const boards = await knex('boards').where({ user_id }).select('*');
    res.status(200).json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

export const getBoardById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const board = await knex('boards').where({ id, user_id }).first();
    if (!board) {
      return res.status(404).json({ error: 'Board not found or unauthorized' });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
};


export const updateBoard = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { name, description, status } = req.body; 
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;
  
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const updated = await knex('boards')
        .where({ id, user_id })
        .update({ name, description, status, updated_at: knex.fn.now() }); 
  
      if (!updated) {
        return res.status(404).json({ error: 'Board not found or unauthorized' });
      }
  
      await sendNotification({
        user_id,
        message: `Your board "${name}" has been updated successfully.`,
        timestamp: new Date()
      });
  
      res.status(200).json({ message: 'Board updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update board' });
    }
  };
  
  
  
  export const deleteCollaborator = async (req: Request, res: Response): Promise<any> => {
    const { board_id, user_id } = req.params;
    const collaborator_id = Array.isArray(req.headers['collaborator_id']) ? req.headers['collaborator_id'][0] : req.headers['collaborator_id'] as string;
  
    if (!collaborator_id || !board_id || !user_id) {
      return res.status(400).json({ error: 'Collaborator ID, Board ID, and User ID are required' });
    }
  
    try {
      const board = await knex('boards').where({ id: board_id, user_id }).first();
      if (!board) {
        return res.status(403).json({ error: 'You do not have permission to delete collaborators from this board' });
      }
  
      const collaborator = await knex('board_collaborators')
        .where({ board_id, user_id: collaborator_id })
        .first();
      
      if (!collaborator) {
        return res.status(404).json({ error: 'Collaborator not found on this board' });
      }
  
      await knex('board_collaborators')
        .where({ board_id, user_id: collaborator_id })
        .del();
  
      await sendNotification({
        user_id: collaborator_id,
        message: `You have been removed as a collaborator from board: ${board.name}`,
        timestamp: new Date(),
      });
  
      const collaboratorEmailResponse = await axios.get(`http://localhost:4040/api/users/${collaborator_id}`);
      if (collaboratorEmailResponse.data) {
        await sendEmail({
          to: collaboratorEmailResponse.data.email,
          subject: 'Removed as Collaborator',
          text: `You have been removed as a collaborator from the board: ${board.name}`,
        });
      }
  
      res.status(200).json({ message: 'Collaborator removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove collaborator' });
    }
  };
  
export const deleteBoard = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const deleted = await knex('boards').where({ id, user_id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Board not found or unauthorized' });
    }

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};
export const getCollaborators = async (req: Request, res: Response): Promise<any> => {
    const { board_id } = req.params;
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'] as string;
  
    if (!user_id || !board_id) {
      return res.status(400).json({ error: 'User ID and Board ID are required' });
    }
  
    try {
      const board = await knex('boards').where({ id: board_id, user_id }).first();
      if (!board) {
        return res.status(403).json({ error: 'You do not have permission to view collaborators for this board' });
      }
  
    
      const collaborators = await knex('board_collaborators')
        .join('users', 'board_collaborators.user_id', '=', 'users.id')
        .where('board_collaborators.board_id', board_id)
        .select('users.id', 'users.email', 'users.name'); 
  
      if (!collaborators.length) {
        return res.status(404).json({ message: 'No collaborators found for this board' });
      }
  
      res.status(200).json(collaborators);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch collaborators' });
    }
  };
  