import { ID,Query } from "appwrite";

import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

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