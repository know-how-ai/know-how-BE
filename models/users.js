const { DataTypes, Model } = require("sequelize");

class Users extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(32),
          allowNull: false,
          unique: "email_UNIQUE",
        },
        username: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },
        reset_question: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        reset_answer: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
        last_logged_in: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.DATEONLY,
        },
        point: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "users",
        modelName: "User",
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "email_UNIQUE",
            unique: true,
            using: "BTREE",
            fields: [{ name: "email" }],
          },
        ],
      },
    );
  }

  static associate(db) {
    // db.User.hasMany(db.PointLog);
  }
}

module.exports = Users;
