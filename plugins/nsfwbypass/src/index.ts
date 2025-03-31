import { findByStoreName, findByProps } from "@vendetta/metro"
import { after, instead } from "@vendetta/patcher"

const UserStore = findByStoreName("UserStore")

let patches = []

patches.push(after("getCurrentUser", UserStore, (_, user) => {
    if (user?.hasOwnProperty("nsfwAllowed")) {
        user.nsfwAllowed = true
    }
    if (user?.hasOwnProperty("ageVerificationStatus")) {
        user.ageVerificationStatus = 3
    }
    return user
}))

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}