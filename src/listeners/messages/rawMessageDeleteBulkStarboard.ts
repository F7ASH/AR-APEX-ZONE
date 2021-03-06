import { GuildSettings, readSettings } from '#lib/database';
import { api } from '#lib/discord/Api';
import { Events } from '#lib/types/Enums';
import { getStarboard } from '#utils/functions';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GatewayMessageDeleteBulkDispatch } from 'discord-api-types/v9';
import type { DiscordAPIError, Guild } from 'discord.js';

@ApplyOptions<ListenerOptions>({ event: Events.RawMessageDeleteBulk })
export class UserListener extends Listener {
	public async run(guild: Guild, data: GatewayMessageDeleteBulkDispatch['d']): Promise<void> {
		for (const id of data.ids) getStarboard(guild).delete(id);

		// Delete entries from starboard if it exists
		const { starboards } = this.container.db;
		const results = await starboards
			.createQueryBuilder()
			.delete()
			.where('guild_id = :guild', { guild: data.guild_id })
			.andWhere('message_id IN (:...ids)', { ids: data.ids })
			.returning('*')
			.execute();

		// Get channel
		const channel = await readSettings(guild, GuildSettings.Starboard.Channel);
		if (!channel) return;

		const filteredResults: string[] = [];
		for (const result of results.raw) if (result.star_message_id) filteredResults.push(result.star_message_id);

		if (filteredResults.length === 0) return;
		if (filteredResults.length === 1) {
			await api()
				.channels(channel)
				.messages(filteredResults[0])
				.delete({ reason: 'Starboard Management: Message Deleted' })
				.catch((error: DiscordAPIError) => this.container.client.emit(Events.Error, error));
			return;
		}

		await api()
			.channels(channel)
			.messages['bulk-delete'].post({ data: { messages: filteredResults }, reason: 'Starboard Management: Message Deleted' })
			.catch((error: DiscordAPIError) => this.container.client.emit(Events.Error, error));
	}
}
