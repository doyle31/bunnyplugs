import { findByStoreName, findByProps } from "@vendetta/metro"
import { after, instead } from "@vendetta/patcher"

const UserStore = findByStoreName("UserStore")

let patches = []

patches.push(after("getCurrentUser", UserStore, (_, user) => {
    if (user?.hasOwnProperty("flags")) {
        user.flags = 801
    }
}))

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}