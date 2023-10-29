import { Client, Account, Databases, Storage, Avatars } from "appwrite"

export const appwriteConfig = {
    url : import.meta.env.VITE_APPWRITE_URL,
    projectID : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId : import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId : import.meta.env.VITE_APPWRIE_STORAGE_ID,
    usersCollectionId : import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postsCollectionId : import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    savesCollectionId : import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}


export const client = new Client() ;

client.setProject(appwriteConfig.projectID)
client.setEndpoint(appwriteConfig.url)


export const databases = new Databases(client) ;
export const storage = new Storage(client) ;
export const account = new Account(client) ;
export const avatars = new Avatars(client) ; 