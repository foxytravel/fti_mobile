import React from 'react'
import { View, Text } from 'react-native'
import Fonts from '../Constants/Fonts'

const ViewItem = props => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontFamily: Fonts.Poppins_Regular, lineHeight: 21 }}>{props.title}</Text>
            <Text style={{ fontSize: 14, fontFamily: Fonts.Poppins_Regular, lineHeight: 21 }}>{props.value}<Text style={{ color: "#223F9A" }}> {props.date ? props.date : ''}</Text></Text>
        </View>
    )
}

export default ViewItem