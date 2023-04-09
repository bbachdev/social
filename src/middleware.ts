export { default } from "next-auth/middleware"

//TODO: Update this to exclude multiple paths
export const config = { matcher: ["/home"] }