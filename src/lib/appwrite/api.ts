import { ID,Query } from "appwrite";

import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

//create Appwrite function, being utilised by react-query


export async function createUserAccount( user: INewUser ) {
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        if(!newAccount) throw Error ;
        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username
        })

        return newUser ;
    }
    catch(e) {
        console.log(e) ;
        return e ;
    }
}

export async function saveUserToDB(user : {
    accountId: string,
    email: string ,
    name: string ,
    imageUrl: URL ,
    username?: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId, //To know which db to add
            appwriteConfig.usersCollectionId, //To know which collection to add.
            ID.unique(),
            user,
        )
        return newUser ;
    }
    catch(e) {
        console.log(e);
        return e;
    }
}

export async function signInAccount(user :{
    email: string,
    password: string
}) {
    try{
        const session =  await account.createEmailSession(user.email , user.password); //new Email Session
        return session;
    }
    catch(e) {
        console.log(e);
        return e ;
    }
}

export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal("accountId", currentAccount.$id)
            ]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }
    catch(e) {
        console.log(e);
    }
}

export async function signOutAccount(){
    try{
        const session = await account.deleteSession("current");
        return session;
    }
    catch(e) {
        console.log(e);
    }
}

export async function createPost(post: INewPost) {
    try{
        const uploadedFile = await uploadFile(post.file[0]);
        if(!uploadedFile) throw Error ;

        const fileUrl = getFilePreview(uploadedFile.$id) ;
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error ;
        }
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags,
            }
        )

        if(!newPost) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }
        return newPost;
    }
    catch(e) {
        console.log(e);
    }
}

export async function uploadFile(file: File) {
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile;
    }
    catch(e) {
        console.log(e);
    }
}

export async function getFilePreview(fileId: string) {
    try{
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
            )
            return fileUrl;
        }
        catch(e) {
            console.log(e);
        }
}
    
export async function deleteFile(fileId: string) {
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { success: 'ok' };
    }
    catch(e) {
        console.log(e);
    }
}
    