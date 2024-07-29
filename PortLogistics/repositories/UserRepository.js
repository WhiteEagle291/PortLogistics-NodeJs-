const UserModel = require('./UserModel.js');

class UserRepository {
  constructor() {}

  async createUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await UserModel.findOne({ username: username });
      return user;
    } catch (error) {
      throw error;
    }
  }


  async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserByUsername(username, updateData) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username: username },
        updateData,
        { new: true } // Return the updated document
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(username, updateData) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username: username },
        updateData,
        { new: true } // Return the updated document
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(username, newPassword) {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { username: username },
            { password: newPassword },
            { new: true } // Return the updated document
        );
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

  async getAllUsers() {
    try {
      const users = await UserModel.find({});
      return users;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserByUsername(username) {
    try {
      const result = await UserModel.deleteOne({ username: username });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(session) {
    try {
      if (session && session.user) {
        const user = await this.getUserByUsername(session.user.username);
        return user;
      } else {
        throw new Error('No user logged in');
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
