import { DataTypes } from 'sequelize';

const Token = sequelize => {
	const Token = sequelize.define(
		'Token',
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type: {
				type: DataTypes.ENUM,
				values: ['single', 'multi'],
				allowNull: false
			},
			expiry: {
				type: DataTypes.DATE,
				allowNull: true
			}
		},
		{
			timestamps: true
		}
	);

	return Token;
};

export default Token;
