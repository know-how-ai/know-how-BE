const { DataTypes, Model } = require("sequelize");
const Users = require("./users");

class PointLogs extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        comment: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "point_logs",
        modelName: "PointLog",
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        engine: "InnoDB",
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id", order: "DESC" }],
          },
          {
            name: "user_id_idx",
            using: "BTREE",
            fields: [{ name: "user_id" }],
          },
        ],
      },
    );
  }

  static associate(db) {
    // db.PointLog.belongsTo(db.User, {
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // });
  }
}

module.exports = PointLogs;
