import { DataTypes } from 'sequelize';

const User = sequelize => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			matrixId: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			role: {
				type: DataTypes.ENUM,
				values: ['admin', 'user'],
				allowNull: false
			}
		},
		{
			timestamps: true,
			classMethods: {
				associate: models => {
					User.hasMany(models.Token);
				}
			}
		}
	);
	return User;
};

export default User;
