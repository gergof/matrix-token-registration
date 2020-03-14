const associations = models => {
	models.User.hasMany(models.Token);
	models.TokenUsage.belongsTo(models.Token, { foreignKeyConstraint: true });
	models.TokenTarget.belongsTo(models.Token, { foreignKeyConstraint: true });
	models.Token.belongsTo(models.User, { foreignKeyConstraint: true });
	models.Token.hasMany(models.TokenTarget);
	models.Token.hasMany(models.TokenUsage);
};

export default associations;
