import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { GoogleAuthProvider } from "firebase/auth";

export const googleLogin = () => {
    try {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
            }).catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
}