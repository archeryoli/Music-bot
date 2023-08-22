const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
module.exports = (queue, track) => {

    if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;
    const embed = new EmbedBuilder()
    .setAuthor({name: `Started playing ${track.title} in ${queue.channel.name} 🎧`, iconURL: track.thumbnail})
    .setColor('#2f3136')

    const shuffle = new ButtonBuilder()
    .setLabel('Shuffle')
    .setCustomId(JSON.stringify({ffb: 'shuffle'}))
    .setStyle('Primary')

    const back = new ButtonBuilder()
    .setLabel('Back')
    .setCustomId(JSON.stringify({ffb: 'back'}))
    .setStyle('Primary')

    const skip = new ButtonBuilder()
    .setLabel('Skip')
    .setCustomId(JSON.stringify({ffb: 'skip'}))
    .setStyle('Primary')

    const resumepause = new ButtonBuilder()
    .setLabel('Resume & Pause')
    .setCustomId(JSON.stringify({ffb: 'resume&pause'}))
    .setStyle('Danger')

    const loop = new ButtonBuilder()
    .setLabel('Loop')
    .setCustomId(JSON.stringify({ffb: 'loop'}))
    .setStyle('Secondary')
    
    const lyrics = new ButtonBuilder()
    .setLabel('lyrics')
    .setCustomId(JSON.stringify({ffb: 'lyrics'}))
    .setStyle('Secondary')

    const kick = new ButtonBuilder()
         .setLabel('Kick Bot')
         .setCustomId(JSON.stringify({ffb: 'stop'}))
         .setStyle('Danger')

    const queueButton = new ButtonBuilder()
        .setLabel('Queue')
        .setCustomId(JSON.stringify({ffb: 'queue'}))
        .setStyle('Success')

    const row1 = new ActionRowBuilder().addComponents(back, kick, resumepause, shuffle, skip)
    const row2 = new ActionRowBuilder().addComponents(queueButton)
    queue.metadata.send({ embeds: [embed], components: [row1, row2] })

}
