import { DataTypes } from 'sequelize';

const TokenUsage = sequelize => {
	const TokenUsage = sequelize.define(
		'TokenUsage',
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			matrixId: {
				type: DataTypes.STRING,
				allowNull: false
			},
			newUser: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			timestamps: true
		}
	);

	return TokenUsage;
};

export default TokenUsage;
