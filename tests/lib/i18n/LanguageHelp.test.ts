import { LanguageHelp } from '#lib/i18n/LanguageHelp';

describe('LanguageHelp builder', () => {
	const builder = new LanguageHelp()
		.setAliases('ποΈ | **Aliases**')
		.setUsages('π | **Command Usage**')
		.setExtendedHelp('π | **Extended Help**')
		.setExplainedUsage('β | **Explained usage**')
		.setPossibleFormats('π’ | **Possible formats**')
		.setExamples('π | **Examples**')
		.setReminder('β° | **Reminder**');

	test('GIVEN basic command display THEN parses correctly', () => {
		const commandHelp = builder.display(
			'add',
			null,
			{
				extendedHelp: [
					'Add songs to the playing queue and prepare for musical enjoyment!\nI can play from YouTube, Bandcamp, SoundCloud, Twitch, Vimeo, or Mixer.',
					'- To play from YouTube either give me something to search, a video link, or a playlist link.',
					'- To play from SoundCloud give me a SoundCloud link, or if you want me to search include either `--sc` or `--soundcloud` in your message.',
					"- To play from Mixer give me the URL of a Mixer streamer, I'm sorry but I cannot (yet) play Mixer VODs.",
					'- To play from Bandcamp, Twitch, or Vimeo just give me a URL to a video or playlist on those sources.'
				].join('\n'),
				explainedUsage: [['song', 'The song to queue. Can be either a URL or a video/song title.']],
				examples: [
					'The PokΓ©mon Theme song',
					'https://youtu.be/fJ9rUzIMcZQ',
					'--sc Imagine Dragons Believer',
					'https://soundcloud.com/vladkurt/imagine-dragons-beliver-vladkurt-remix',
					'https://vimeo.com/channels/music/239029778',
					'https://mixer.com/Ninja',
					'https://thedisappointed.bandcamp.com/album/escapism-2'
				]
			},
			's!'
		);

		const expectedOutput = `π | **Extended Help**
Add songs to the playing queue and prepare for musical enjoyment!
I can play from YouTube, Bandcamp, SoundCloud, Twitch, Vimeo, or Mixer.
- To play from YouTube either give me something to search, a video link, or a playlist link.
- To play from SoundCloud give me a SoundCloud link, or if you want me to search include either \`--sc\` or \`--soundcloud\` in your message.
- To play from Mixer give me the URL of a Mixer streamer, I'm sorry but I cannot (yet) play Mixer VODs.
- To play from Bandcamp, Twitch, or Vimeo just give me a URL to a video or playlist on those sources.

β | **Explained usage**
β **song**: The song to queue. Can be either a URL or a video/song title.

π | **Examples**
β s!add *The PokΓ©mon Theme song*
β s!add *https://youtu.be/fJ9rUzIMcZQ*
β s!add *--sc Imagine Dragons Believer*
β s!add *https://soundcloud.com/vladkurt/imagine-dragons-beliver-vladkurt-remix*
β s!add *https://vimeo.com/channels/music/239029778*
β s!add *https://mixer.com/Ninja*
β s!add *https://thedisappointed.bandcamp.com/album/escapism-2*
`;

		expect(commandHelp).toBe(expectedOutput);
	});

	test('GIVEN extended help w/o extendedHelp THEN parses correctly', () => {
		const commandHelp = builder.display(
			'sample',
			null,
			{
				reminder: ['This goes to 9000', 'Actually 9001'].join('\n')
			},
			's!'
		);

		const expectedOutput = `π | **Examples**
β s!sample

β° | **Reminder**
This goes to 9000
Actually 9001`;

		expect(commandHelp).toBe(expectedOutput);
	});
});
