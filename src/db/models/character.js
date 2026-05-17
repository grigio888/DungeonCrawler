import { DataTypes } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
export function defineCharacterModel(sequelize) {
	return sequelize.define(
		'Character',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
			kind: {
				type: DataTypes.STRING(32),
				allowNull: false,
				defaultValue: 'player'
			},
			name: {
				type: DataTypes.STRING(128),
				allowNull: false
			},
			gender: {
				type: DataTypes.STRING(16),
				allowNull: false,
				defaultValue: 'female'
			},
			level: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1
			},
			classes: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: []
			},
			jobLevel: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
				field: 'job_level'
			},
			exp: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			equipment: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: {}
			},
			skills: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: []
			},
			skillPoints: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				field: 'skill_points'
			},
			zeny: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			statusEffects: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: [],
				field: 'status_effects'
			},
			position: {
				type: DataTypes.JSON,
				allowNull: true
			}
		},
		{
			tableName: 'characters',
			underscored: true,
			timestamps: true
		}
	);
}
