const associations = models => {
	models.User.hasMany(models.Token);
	models.TokenUsage.belongsTo(models.Token, {
		constraints: true,
		onDelete: 'cascade'
	});
	models.TokenTarget.belongsTo(models.Token, {
		constraints: true,
		onDelete: 'cascade'
	});
	models.Token.belongsTo(models.User, {
		constraints: true,
		onDelete: 'cascade'
	});
	models.Token.hasMany(models.TokenTarget);
	models.Token.hasMany(models.TokenUsage);
};

export default associations;
