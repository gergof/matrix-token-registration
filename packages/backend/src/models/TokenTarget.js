import { DataTypes } from 'sequelize';

const TokenTarget = sequelize => {
	const TokenTarget = sequelize.define(
		'TokenTarget',
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			targetType: {
				type: DataTypes.ENUM,
				values: ['room'],
				allowNull: false
			},
			target: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			timestamps: true
		}
	);
	
	return TokenTarget;
};

export default TokenTarget;
