import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"
import { Message, MessagesState } from "../../utils/types";

export const saveMessage = async (RuserID: string, message: Message) => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = RuserID > SuserID ? RuserID + SuserID : SuserID + RuserID;
        const ref = doc(db, "messages", title);
        await setDoc(doc(ref, "message", message.id), message);
    } catch (error) {
        console.log(error);
    }
}

export const saveUnseenMessage = async (message: Message) => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = SuserID;
        console.log("unseen")
        const ref = doc(db, "unseenMessages", title);
        await setDoc(doc(ref, "message", message.id), message);
    } catch (error) {
        console.log(error);
    }
}

export const updateMessage = async (RuserID: string, messageID: string, value: string) => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = RuserID > SuserID ? RuserID + SuserID : SuserID + RuserID;
        const ref = doc(db, "messages", title);
        // console.log(value);
        await updateDoc(doc(ref, "message", messageID), {
            seen: value
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteUnseenMessage = async (messageID: string) => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = SuserID;
        const ref = doc(db, "unseenMessages", title);
        // console.log(value);
        await deleteDoc(doc(ref, "message", messageID));
    } catch (error) {
        console.log(error);
    }
}

export const getMessages = async (RuserID: string) => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = RuserID > SuserID ? RuserID + SuserID : SuserID + RuserID;
        const docRef = collection(doc(db, "messages", title), "message");
        const q = query(docRef, orderBy("id"));
        const querySnapshot = await getDocs(q);
        const res: Message[] = [];
        querySnapshot.forEach((doc) => {
            res.push(doc.data() as Message);
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getUnseenMessages = async () => {
    try {
        const SuserID = localStorage.getItem('userID') || '';
        const title = SuserID;
        const docRef = collection(doc(db, "unseenMessages", title), "message");
        const querySnapshot = await getDocs(docRef);
        const res = { 'userID': [] } as MessagesState;
        querySnapshot.forEach((doc) => {
            const data = doc.data() as Message;
            console.log(data);
            const userID = SuserID !== data.from ? data.from : data.to;
            if (userID) {
                if (!res[userID]) res[userID] = [];
                res[userID].push(data);
            }
        });
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}