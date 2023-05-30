const { Client, Intents, MessageActionRow, MessageButton, CommandInteractionOptionResolver } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });
const { token, quietChatRules, guildId, quietChatId } = require(`./config.json`);

client.once('ready', () => {
    console.log('Ready!');
    
  const data = {
    name: 'asktojoin',
    description: 'Request to join a specific voice channel',
  };

  const commands = await client.guilds.cache.get(guildId)?.commands.set([data]);
  console.log('Slash command registered');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'asktojoin') {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You must be in a voice channel to use this command!");
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('agree')
                    .setLabel('I Agree')
                    .setStyle('SUCCESS'),
                new ButtonBuilder()
                    .setCustomId('disagree')
                    .setLabel('I Do Not Agree')
                    .setStyle('DANGER'),
            );

        await interaction.reply({ content: quietChatRules, components: [row], ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (!interaction.inGuild()) return;

    if (interaction.customId === 'agree') {
        try {
             const quietChannel = interaction.guild.channels.cache.get(quietChatId);
            await interaction.member.voice.setChannel(quietChannel);
            await interaction.reply({ content: 'You have been moved to the quiet channel.', ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    } else if (interaction.customId === 'disagree') {
        await interaction.reply({ content: 'You have chosen not to join the quiet channel.', ephemeral: true });
    }
});

client.login(token);
