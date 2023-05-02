import { Client, Message, Channel, TextChannel } from 'discord.js';
import { PlayerData } from './PlayerData';
import {bubble, cdr, flask, help, mana, pob, rareRing, shock, tanky, upgrade} from './helpStrings.js';

export class MessageHandler {

    readonly client : Client;

    constructor(client : Client) {
        this.client = client;

        client.on('ready', () => {
           client.user?.setActivity('Type help in chat');
        });
    }

    async handleMessage(message: Message) {
        if (message.author.bot) return;

        if(message.content.startsWith("check") || message.channelId === "988474586490368110") {
            if(message.content.includes("pastebin.com") || message.content.includes("pobb.in")) {
                await this.handlePoB(message);
            }
        }

        if(message.content.match(/^help$/) || message.content.match(/help list/)) {
            await this.sendMessage(message, help);
        }

        if(message.content.match(/[Hh]elp tank/)) {
            await this.sendMessage(message, tanky);
        }

        if (message.content.match(/[Hh]elp mana/))  {
            await this.sendMessage(message, mana);
        }

        if (message.content.match(/[Hh]elp rare/) || message.content.match(/[Hh]elp ring/)) {
            await this.sendMessage(message, rareRing);
        }

        if (message.content.match(/[Hh]elp upgrade/)) {
            await this.sendMessage(message, upgrade);
        }

        if (message.content.match(/[Hh]elp cdr/)) {
            await this.sendMessage(message, cdr);
        }

        if (message.content.match(/[Hh]elp dps/) || message.content.match(/[Hh]elp pob/)) {
            await this.sendMessage(message, pob);
        }

        if (message.content.match(/[Hh]elp shock/)) {
            await this.sendMessage(message, shock);
        }

        if (message.content.match(/[Hh]elp bubble/)) {
            await this.sendMessage(message, bubble);
        }

        if (message.content.match(/[Hh]elp flask/)) {
            await this.sendMessage(message, flask);
        }
    }

    async sendMessage(message: Message, helpStr: string) {
        const channel : Channel | null = await this.client.channels.fetch(message.channelId);
        (channel as TextChannel).send(helpStr);
        return Promise.resolve();
    }

    async handlePoB(message: Message) {

        const playerData  = new PlayerData(message);
        try {
            await playerData.initlizeData();
        }
        catch(err) {
            console.log("This has failed " + message.content);
            this.sendMessage(message, "Something has failed here, check for 404 or Check PoB Manually!");
            return Promise.resolve(false);
        }

        const messageString = 

            `\`\`\`----------------------PoB Check----------------------
[Life: ${playerData.playerStats['Life']}]   [EnergyShield: ${playerData.playerStats['EnergyShield']}]   [Ward: ${playerData.playerStats['Ward']}]   [Mana: ${playerData.playerStats['Mana']}]   [ChaosResist: ${playerData.playerStats['ChaosResist']}]   [Armour: ${playerData.playerStats['Armour']}]

Loop Status - ${playerData.bodyLoopSpeed}

FR Damage - ${playerData.frDamage}
Ward More Than FR Damage - ${playerData.frWard}

Cooldown - ${playerData.cdr}%
Skeleton Duration - ${playerData.skeletonDuration}
To Dusts - ${playerData.totalDust}
Less Duration Mastery - ${playerData.lessDurationMastery}

Loop Rings - ${playerData.loopRings}

MindOverMatter - ${playerData.MindOverMatter}
Pathfinder - ${playerData.pathfinder}
Staff Defense Mastery - ${playerData.staffDefenseMastery}

[Life Recoup - ${playerData.lifeRecoup}] [Mana Recoup - ${playerData.manaRecoup}]

Swap Weapons - ${playerData.swapWandCount}
[Flasks Increased Effect - ${playerData.flaskIncEffect}] [Physical Hits As Ele Damage - ${playerData.physAsEle}]

[Summon Skeletons  - ${playerData.skeletonGem.qualityId} ${playerData.skeletonGem.level}/${playerData.skeletonGem.quality}]  [Minion Speed     - ${playerData.minionSpeed.qualityId} ${playerData.minionSpeed.level}/${playerData.minionSpeed.quality}] [Skeleton CWDT    - ${playerData.skeletonCWDT.qualityId} ${playerData.skeletonCWDT.level}/${playerData.skeletonCWDT.quality}]
[Forbidden Rite    - ${playerData.forbiddenRite.qualityId} ${playerData.forbiddenRite.level}/${playerData.forbiddenRite.quality}]       [FR CWDT          - ${playerData.frCWDT.qualityId} ${playerData.frCWDT.level}/${playerData.frCWDT.quality}]
[Body CWDT         - ${playerData.bodyCWDT.qualityId} ${playerData.bodyCWDT.level}/${playerData.bodyCWDT.quality}]  [Weapon CWDT      - ${playerData.weaponCWDT.qualityId} ${playerData.weaponCWDT.level}/${playerData.weaponCWDT.quality}]
\`\`\``;
        this.sendMessage(message, messageString);

        
        if(playerData.fixArray.length!=0) {

            let finalMessage = '';

            for(let i = 0; i < playerData.fixArray.length; i++) {
                finalMessage = finalMessage + playerData.fixArray[i] + '\n';
            }

            const finalMsg = `\`\`\`diff
${finalMessage}
\`\`\``
            this.sendMessage(message, finalMsg);
        } else {
            const finalMessage = '+ Looks good. If build broken, check Pantheon, Gem Levels, Gem Links. See channel #check-list. Also check flask calculator https://returnx.github.io/cwdt/';

            const finalMsg = `\`\`\`diff
${finalMessage}
\`\`\``

            this.sendMessage(message, finalMsg);
        }
    }
}