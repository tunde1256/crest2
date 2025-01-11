import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import upload from '../middleware/multerConfig';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await UserModel.getAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch users', error });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const user = await UserModel.getById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch user', error });
    }
  }

  static async createUser(req: Request, res: Response): Promise<any> {
    const { fullname, email, password, gender, phoneNumber } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await UserModel.create({ fullname, email, password: hashedPassword, gender, phoneNumber });
  
      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create user', error });
    }
  }
  
  static async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    try {
      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to login', error });
    }
  }

  static async uploadProfilePicture(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const profilePictureUrl = req.file.path;
      const updated = await UserModel.update(Number(id), { profilePicture: profilePictureUrl });
      if (updated === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Profile picture uploaded successfully', profilePictureUrl });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to upload profile picture', error });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const { fullname, email, password, gender, phoneNumber } = req.body;
    try {
      const updateData: any = { fullname, email, gender, phoneNumber };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updated = await UserModel.update(Number(id), updateData);
      if (updated === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update user', error });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const deleted = await UserModel.delete(Number(id));
      if (deleted === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete user', error });
    }
  }

  static async logout(req: Request, res: Response): Promise<any> {
    try {
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to logout', error });
    }
  }
}
