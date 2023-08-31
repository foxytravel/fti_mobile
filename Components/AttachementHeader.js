import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Fonts from '../Constants/Fonts'

const AttachmentHeader = props => {
    return (
        <View style={styles}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        marginTop: 30,
        color: "#212121",
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Fonts.Poppins_Regular
    }
})

export default AttachmentHeader