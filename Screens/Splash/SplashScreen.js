import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

const SplashScreen = props => {
    return (
        <View style={styles.screen}>
            <Image
                style={styles.logo}
                source={require("../../Assets/Images/logo.png")}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: 'center'
    },
    logo: {
        width: "70%",
        height: "70%",
        resizeMode: 'contain'
    }
})

export default SplashScreen