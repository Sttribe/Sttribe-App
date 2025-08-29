import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
    scheme: "myapp", // 👈 matches scheme in app.json
});

export default function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    console.log("Redirect URI:", redirectUri);

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId:
            "699272670821-o360cmc07156tgsq2b6t8mg3chi2h3n5.apps.googleusercontent.com",
        iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
        androidClientId:
            "699272670821-esgreslid17ugdv4d4q2cm5rp8brdiog.apps.googleusercontent.com",
        webClientId:
            "699272670821-1n1j0poh7807op52pa33mka6pd9vlgdj.apps.googleusercontent.com",
        redirectUri,
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            setAccessToken(authentication.accessToken); // 👈 store token
            fetchUserInfo(authentication.accessToken);
        }
    }, [response]);

    async function fetchUserInfo(token) {
        let res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        setUserInfo(user);
        console.log("User Info:", user);
        console.log("Access Token:", token);
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button
                title="Login with Google"
                disabled={!request}
                onPress={() => promptAsync()}
            />

            {userInfo && (
                <View style={{ marginTop: 20 }}>
                    <Text>Welcome {userInfo.name}</Text>
                    <Text>Email: {userInfo.email}</Text>
                    <Text>Token: {accessToken}</Text>
                </View>
            )}
        </View>
    );
}