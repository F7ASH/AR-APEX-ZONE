import { Serializer, SerializerUpdateContext } from '#lib/database';
import { LanguageKeys } from '#lib/i18n/languageKeys';
import type { Awaitable } from '@sapphire/utilities';

export class UserSerializer extends Serializer<string> {
	private readonly kProtocol = /^https?:\/\//;

	public parse(args: Serializer.Args, { t, entry }: SerializerUpdateContext) {
		const value = args.next();
		try {
			const { hostname } = new URL(this.kProtocol.test(value) ? value : `https://${value}`);
			if (hostname.length <= 128) return this.ok(hostname);
			return this.error(t(LanguageKeys.Serializers.MinMaxMaxInclusive, { name: entry.name, max: 128 }));
		} catch {
			return this.error(t(LanguageKeys.Serializers.MinMaxMaxInclusive, { name: entry.name, max: 128 }));
		}
	}

	public isValid(value: string, { t, entry }: SerializerUpdateContext): Awaitable<boolean> {
		try {
			const { hostname } = new URL(this.kProtocol.test(value) ? value : `https://${value}`);
			return hostname.length <= 128;
		} catch {
			throw new Error(t(LanguageKeys.Serializers.InvalidUrl, { name: entry.name }));
		}
	}

	public validate(data: string, { entry, t }: SerializerUpdateContext) {
		try {
			const { hostname } = new URL(this.kProtocol.test(data) ? data : `https://${data}`);
			if (hostname.length > 128) throw t(LanguageKeys.Serializers.MinMaxMaxInclusive, { name: entry.name, max: 128 });
			return hostname;
		} catch {
			throw t(LanguageKeys.Serializers.InvalidUrl, { name: entry.name });
		}
	}

	public stringify(data: string) {
		return `https://${data}`;
	}
}
