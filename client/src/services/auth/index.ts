import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { GoogleAuthProvider } from "firebase/auth";

export const googleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.log(error);
    }
}