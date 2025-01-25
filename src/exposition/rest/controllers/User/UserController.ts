import {
  Body,
  Delete,
  Get,
  HttpError,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { CreateUserDto } from '@application/dtos/CreateUserDto';
import { UpdateUserDto } from '@application/dtos/UpdateUserDto';
import { BusinessError } from '@application/errors/BusinessError';
import { ValidationError } from '@application/errors/ValidationError';
import { CreateUserUseCase } from '@application/usecases/CreateUserUseCase';
import { DeleteUserUseCase } from '@application/usecases/DeleteUserUseCase';
import { GetAllUsersUseCase } from '@application/usecases/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '@application/usecases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '@application/usecases/UpdateUserUseCase';
import { Service } from 'typedi';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@JsonController('/users')
@Service()
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Get()
  async getAllUsers() {
    try {
      return await this.getAllUsersUseCase.execute();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpError(400, error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    try {
      return await this.getUserByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpError(404, error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       200:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    try {
      return await this.createUserUseCase.execute(userData);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw new HttpError(400, error.message);
      }
      if (error instanceof ValidationError) {
        throw new HttpError(400, error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update a user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    try {
      return await this.updateUserUseCase.execute(id, userData);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpError(404, error.message);
      }
      throw error;
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.deleteUserUseCase.execute(id);
      return { success: true };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpError(404, error.message);
      }
      throw error;
    }
  }
}