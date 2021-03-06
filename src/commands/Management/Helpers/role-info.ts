import { LanguageKeys } from '#lib/i18n/languageKeys';
import { SkyraCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { PermissionLevels } from '#lib/types/Enums';
import { BrandingColors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { MessageEmbed, Permissions } from 'discord.js';

@ApplyOptions<SkyraCommand.Options>({
	description: LanguageKeys.Commands.Management.RoleInfoDescription,
	detailedDescription: LanguageKeys.Commands.Management.RoleInfoExtended,
	permissionLevel: PermissionLevels.Moderator,
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks],
	runIn: [CommandOptionsRunTypeEnum.GuildAny]
})
export class UserCommand extends SkyraCommand {
	public async run(message: GuildMessage, args: SkyraCommand.Args) {
		const role = args.finished ? message.member.roles.highest : await args.pick('roleName');
		const roleInfoTitles = args.t(LanguageKeys.Commands.Management.RoleInfoTitles);

		const permissions = role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
			? args.t(LanguageKeys.Commands.Management.RoleInfoAll)
			: role.permissions.toArray().length > 0
			? role.permissions
					.toArray()
					.map((key) => `+ **${args.t(`permissions:${key}`, key)}**`)
					.join('\n')
			: args.t(LanguageKeys.Commands.Management.RoleInfoNoPermissions);

		const description = args.t(LanguageKeys.Commands.Management.RoleInfoData, {
			role,
			hoisted: args.t(role.hoist ? LanguageKeys.Globals.Yes : LanguageKeys.Globals.No),
			mentionable: args.t(role.mentionable ? LanguageKeys.Globals.Yes : LanguageKeys.Globals.No)
		});

		const embed = new MessageEmbed()
			.setColor(role.color || BrandingColors.Secondary)
			.setTitle(`${role.name} [${role.id}]`)
			.setDescription(description)
			.addField(roleInfoTitles.PERMISSIONS, permissions);
		return send(message, { embeds: [embed] });
	}
}
