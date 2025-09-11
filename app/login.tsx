import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { router } from "expo-router";


WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
    scheme: "myapp", // 👈 must match your app.json
});

export default function App() {
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId:
            "699272670821-o360cmc07156tgsq2b6t8mg3chi2h3n5.apps.googleusercontent.com",
        iosClientId:
            "699272670821-10p4ag0ssha0h5o9ea9v1b3d3l73cd10.apps.googleusercontent.com",
        androidClientId:
            "699272670821-esgreslid17ugdv4d4q2cm5rp8brdiog.apps.googleusercontent.com",
        webClientId:
            "699272670821-1n1j0poh7807op52pa33mka6pd9vlgdj.apps.googleusercontent.com",
        redirectUri,
        responseType: "id_token", // 👈 ask Google for ID token (important!)
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;

            // 👇 Use Firebase credential
            const credential = GoogleAuthProvider.credential(id_token);

            signInWithCredential(auth, credential)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const token = await user.getIdToken(); // 👈 Firebase ID token
                    console.log("✅ Firebase User:", user);
                    console.log("🔥 Firebase Token:", token);
                    setUserInfo(user);

                    router.push('/(tabs)');
                })
                .catch((err) => console.error("Firebase login error", err));
        }
    }, [response]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button
                title="Login with Google"
                disabled={!request}
                onPress={() => promptAsync()}
            />

            {userInfo && (
                <View style={{ marginTop: 20 }}>
                    <Text>Welcome {userInfo.displayName}</Text>
                    <Text>Email: {userInfo.email}</Text>
                </View>
            )}
        </View>
    );
}
