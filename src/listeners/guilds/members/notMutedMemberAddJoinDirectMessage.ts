import { GuildSettings, readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n/languageKeys';
import { Events } from '#lib/types/Enums';
import { resolveOnErrorCodes } from '#utils/common';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import type { Guild, GuildMember, User } from 'discord.js';
import type { TFunction } from 'i18next';

const enum Matches {
	Guild = '%GUILD%',
	Member = '%MEMBER%',
	MemberName = '%MEMBERNAME%',
	MemberTag = '%MEMBERTAG%',
	MemberCount = '%MEMBERCOUNT%',
	Position = '%POSITION%'
}

@ApplyOptions<ListenerOptions>({ event: Events.NotMutedMemberAdd })
export class UserListener extends Listener {
	private readonly kTransformMessageRegExp = /%MEMBER%|%MEMBERNAME%|%MEMBERTAG%|%GUILD%|%POSITION%|%MEMBERCOUNT%/g;

	public async run(member: GuildMember) {
		const [messagesJoinDM, language] = await readSettings(member, (settings) => [
			settings[GuildSettings.Messages.JoinDM],
			settings.getLanguage()
		]);
		if (!messagesJoinDM) return;

		return resolveOnErrorCodes(
			member.user.send(this.transformMessage(messagesJoinDM, language, member.guild, member.user)),
			RESTJSONErrorCodes.CannotSendMessagesToThisUser
		);
	}

	private transformMessage(str: string, t: TFunction, guild: Guild, user: User) {
		return str.replace(this.kTransformMessageRegExp, (match) => {
			switch (match) {
				case Matches.Member:
					return `<@${user.id}>`;
				case Matches.MemberName:
					return user.username;
				case Matches.MemberTag:
					return user.tag;
				case Matches.Guild:
					return guild.name;
				case Matches.Position:
					return t(LanguageKeys.Globals.OrdinalValue, { value: guild.memberCount });
				case Matches.MemberCount:
					return guild.memberCount.toString();
				default:
					return match;
			}
		});
	}
}
