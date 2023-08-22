const {
    QueryType,
    useMasterPlayer,
    useQueue
} = require('discord-player');
const {
    ApplicationCommandOptionType,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'play',
    description: "play a song!",
    voiceChannel: true,
    options: [{
        name: 'song',
        description: 'the song you want to play',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],

    async execute({
        inter,
        client
    }) {
        const player = useMasterPlayer()

        const song = inter.options.getString('song');
        const urlSplit = song.split('&');
        let res = null;
        let songId = null;
        for(const splitValue of urlSplit){
            if(splitValue.startsWith('list')){
                const playlistId = splitValue.split('=')[1];
                res = await player.search(`https://www.youtube.com/playlist?list=${playlistId}`, {
                    requestedBy: inter.member,
                    searchEngine: QueryType.AUTO
                });
            }
            if(splitValue.startsWith('index')){
                songId = parseInt(splitValue.split('=')[1]);
            }
        }
        if(res == null){
            res = await player.search(song, {
                requestedBy: inter.member,
                searchEngine: QueryType.AUTO
            });
        }
        const NoResultsEmbed = new EmbedBuilder()
            .setAuthor({
                name: `No results found... try again ? ❌`
            })
            .setColor('#2f3136')

        if (!res || !res.tracks.length) return inter.editReply({
            embeds: [NoResultsEmbed]
        });

        const queue = await player.nodes.create(inter.guild, {
            metadata: inter.channel,
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.volume,
            leaveOnEmpty: client.config.opt.leaveOnEmpty,
            leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
        });

        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel);
        } catch {
            await player.deleteQueue(inter.guildId);

            const NoVoiceEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `I can't join the voice channel... try again ? ❌`
                })
                .setColor('#2f3136')

            return inter.editReply({
                embeds: [NoVoiceEmbed]
            });
        }

        const playEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Loading your ${res.playlist ? 'playlist' : 'track'} to the queue... ✅`
            })
            .setColor('#2f3136')

        await inter.editReply({
            embeds: [playEmbed]
        });

        if (res.playlist) {
            let index = 1;
            for (param of song.split('&')) {
                if (param.startsWith('index')) {
                    index = param.split('=')[1];
                    break;
                }
            }
            queue.addTrack(res.tracks);
            if (songId != null) {
                queue.node.skipTo(res.tracks[songId - 1]);
            } 
           // queue.skipTo(res.tracks[index - 1]);

        } else {
            queue.addTrack(res.tracks[0])
        }

        if (!queue.isPlaying()) await queue.node.play();
        // await queue.shuffle();
    },
};