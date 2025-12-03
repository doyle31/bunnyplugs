import { findByProps, findByStoreName } from "@vendetta/metro";
import { chroma, constants, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { rawColors } from "@vendetta/ui";

// Permissions
const { Permissions } = constants
const { computePermissions } = findByProps("computePermissions", "canEveryoneRole")

const GuildMemberStore = findByStoreName("GuildMemberStore")

export const BUILT_IN_TAGS = [
    i18n.Messages.AI_TAG,
    i18n.Messages.BOT_TAG_BOT,
    i18n.Messages.BOT_TAG_SERVER,
    i18n.Messages.SYSTEM_DM_TAG_SYSTEM,
    i18n.Messages.GUILD_AUTOMOD_USER_BADGE_TEXT,
    i18n.Messages.REMIXING_TAG
]

interface Tag {
    text: string
    textColor?: any
    backgroundColor?: any
    verified?: boolean | ((guild, channel, user) => boolean)
    condition?: (guild, channel, user) => boolean
    permissions?: string[]
}

const tags: Tag[] = [
    {
        text: "WEBHOOK",
        condition: (guild, channel, user) => user.isNonUserBot()
    },
    {
        text: "OWNER",
        //backgroundColor: rawColors.ORANGE_345,
        condition: (guild, channel, user) => guild?.ownerId === user.id
    },
    {
        text: "ADMIN",
        //backgroundColor: rawColors.RED_560,
        permissions: ["ADMINISTRATOR"]
    },
    {
        text: "MOD",
        //backgroundColor: rawColors.GREEN_345,
        permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
    },
    {
        text: "STAFF",
        //backgroundColor: rawColors.BLUE_345,
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    },
    {
        text: "VC Mod",
        //backgroundColor: "#059669#",
        permissions: ["MOVE_MEMBERS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"]
    },
    {
        text: "Chat Mod",
        //backgroundColor: "#7C3AED",
        permissions: ["MODERATE_MEMBERS"]
    }
]

const archtags: Tag[] = [
    {
        text: "WEBHOOK",
        condition: (guild, channel, user) => user.isNonUserBot()
    },
    {
        text: "OWNER",
        //backgroundColor: rawColors.ORANGE_345,
        condition: (guild, channel, user) => guild?.ownerId === user.id
    },
    {
        text: "SUDOER",
        //backgroundColor: rawColors.RED_560,
        condition: (guild, channel, user) => GuildMemberStore.getMember(guild?.id, user.id)?.roles?.includes("399814854413647884")
    },
    {
        text: "OP",
        backgroundColor: "#ff0000",
        condition: (guild, channel, user) => GuildMemberStore.getMember(guild?.id, user.id)?.roles?.includes("716842288831004718")
    },
    {
        text: "MOD",
        //backgroundColor: rawColors.GREEN_345,
        condition: (guild, channel, user) => GuildMemberStore.getMember(guild?.id, user.id)?.roles?.includes("399818870568779776")
    },
    {
        text: "TU",
        //backgroundColor: rawColors.BLUE_345,
        condition: (guild, channel, user) => GuildMemberStore.getMember(guild?.id, user.id)?.roles?.includes("406212176164945922")
    },
    {
        text: "HU",
        //backgroundColor: rawColors.BLUE_345,
        condition: (guild, channel, user) => GuildMemberStore.getMember(guild?.id, user.id)?.roles?.includes("461957316921524254")
    },
    {
        text: "VC Mod",
        //backgroundColor: "#059669#",
        permissions: ["MOVE_MEMBERS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"]
    },
    {
        text: "Chat Mod",
        //backgroundColor: "#7C3AED",
        permissions: ["MODERATE_MEMBERS"]
    }
]

export default function getTag(guild, channel, user) {
    let permissions
    if (guild) {
        const permissionsInt = computePermissions({
            user: user,
            context: guild,
            overwrites: channel?.permissionOverwrites
        })
        permissions = Object.entries(Permissions)
            .map(([permission, permissionInt]: [string, bigint]) =>
                permissionsInt & permissionInt ? permission : "")
            .filter(Boolean)
    }

    if (guild.id == "399812551963049995") {
        for (const tag of archtags) {
            if (tag.condition?.(guild, channel, user) ||
                (!user.bot && tag.permissions?.some(perm => permissions?.includes(perm)))) {

                let roleColor = storage.useRoleColor ? GuildMemberStore.getMember(guild?.id, user.id)?.colorString : undefined
                let backgroundColor = roleColor ? roleColor : tag.backgroundColor ?? rawColors.BRAND_500
                let textColor = (roleColor || !tag.textColor) ? (chroma(backgroundColor).get('lab.l') < 70 ? rawColors.WHITE_500 : rawColors.BLACK_500) : tag.textColor

                return {
                    ...tag,
                    textColor,
                    backgroundColor,
                    verified: typeof tag.verified === "function" ? tag.verified(guild, channel, user) : tag.verified ?? false,
                    condition: undefined,
                    permissions: undefined
                }
            }
        }
    } else {
        for (const tag of tags) {
            if (tag.condition?.(guild, channel, user) ||
                (!user.bot && tag.permissions?.some(perm => permissions?.includes(perm)))) {

                let roleColor = storage.useRoleColor ? GuildMemberStore.getMember(guild?.id, user.id)?.colorString : undefined
                let backgroundColor = roleColor ? roleColor : tag.backgroundColor ?? rawColors.BRAND_500
                let textColor = (roleColor || !tag.textColor) ? (chroma(backgroundColor).get('lab.l') < 70 ? rawColors.WHITE_500 : rawColors.BLACK_500) : tag.textColor

                return {
                    ...tag,
                    textColor,
                    backgroundColor,
                    verified: typeof tag.verified === "function" ? tag.verified(guild, channel, user) : tag.verified ?? false,
                    condition: undefined,
                    permissions: undefined
                }
            }
        }
    }
}
