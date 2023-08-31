import React from 'react'
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { Card, View } from 'native-base'
import Fonts from '../Constants/Fonts'
import CustomButton from './CustomButton'

const CancelledItem = props => {
    return (
        <Card style={styles.screen}>

            <View style={styles.dateContanier}>
                <Image
                    style={styles.calImage}
                    source={require("../Assets/Images/calendarblue.png")}
                />
                <Text
                    style={styles.date}
                >{props.date}</Text>
            </View>

            <Text style={styles.title}>{props.title}</Text>

            <View style={{ marginVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', height: 100 }}>
                    <Image
                        style={{ width: 18, height: 18, resizeMode: "contain" }}
                        source={require("../Assets/Images/downblue.png")}
                    />
                    <Image
                        style={{ width: 4, height: 4, resizeMode: "contain" }}
                        source={require("../Assets/Images/dot.png")}
                    />
                    <Image
                        style={{ width: 4, height: 4, resizeMode: "contain" }}
                        source={require("../Assets/Images/dot.png")}
                    />
                    <Image
                        style={{ width: 4, height: 4, resizeMode: "contain" }}
                        source={require("../Assets/Images/dot.png")}
                    />
                    <Image
                        style={{ width: 18, height: 18, resizeMode: "contain" }}
                        source={require("../Assets/Images/downorange.png")}
                    />
                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', height: 100 }}>
                    <View>
                        <Text style={styles.start}>{props.start}</Text>
                        <Text style={styles.startingDate}>{props.startingDate}</Text>
                    </View>

                    <View>
                        <Text style={styles.start}>{props.arrive}</Text>
                        <Text style={styles.startingDate}>{props.closingDate}</Text>
                    </View>
                </View>
            </View>

            {/* DIVIDER  */}

            <View style={{ backgroundColor: '#00000080', height: 1, width: "100%", alignSelf: 'center', marginVertical: 20 }}></View>

            <Text style={styles.name}>Chartering Party Name: <Text style={{ color: "#223F9A" }}>{props.name}</Text></Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100 }}>
                <View >
                    <Text style={styles.drivername}>{props.drivername}</Text>
                    <Text style={styles.phoneno}>{props.phoneno}</Text>
                    <Text style={styles.pickups}>Total Pick ups: {props.pickups}</Text>
                    <TouchableOpacity
                        onPress={props.action}
                        style={{ marginTop: 10, borderColor: "#223F9A", borderWidth: 1, padding: 3, borderRadius: 6, justifyContent: "center", alignItems: 'center' }}>


                        <Text style={{ fontFamily: Fonts.Poppins_Regular, fontSize: 10, lineHeight: 16 }}>View Travel Itinerary</Text>

                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: "#00000080", width: 1, height: 100 }}></View>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{ width: 23, height: 15, resizeMode: 'contain', marginRight: 10 }}
                            source={require('../Assets/Images/littlebus.png')}
                        />
                        <Text style={styles.drivername}>Status</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: "#D80404", fontSize: 16, fontFamily: Fonts.Poppins_Bold }}>Cancelled</Text>
                        <Image
                            style={{ width: 23, height: 15, resizeMode: 'contain', marginRight: 10 }}
                            source={require('../Assets/Images/cancel.png')}
                        />
                    </View>

                </View>

            </View>

        </Card>
    )
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        borderRadius: 15
    },
    dateContanier: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    calImage: {
        width: 14,
        height: 16,
        resizeMode: 'contain'
    },
    date: {
        fontFamily: Fonts.Poppins_Light,
        color: "#223F9A",
        fontSize: 12,
        lineHeight: 18,
        marginLeft: 10
    },
    title: {
        fontSize: 15,
        fontFamily: Fonts.Poppins_Medium,
        lineHeight: 27,
        marginTop: 10
    },
    start: {
        fontFamily: Fonts.Poppins_Regular,
        fontSize: 12,
        lineHeight: 21
    },
    startingDate: {
        fontSize: 10,
        fontFamily: Fonts.Poppins_Light,
        lineHeight: 16
    },
    name: {
        fontFamily: Fonts.Poppins_Medium,
        fontSize: 15,
        lineHeight: 27,
        marginBottom: 20
    },
    drivername: {
        fontSize: 12,
        fontFamily: Fonts.Poppins_Regular,
        lineHeight: 18
    },
    phoneno: {
        fontFamily: Fonts.Poppins_Bold,
        lineHeight: 25,
        fontSize: 16
    },
    pickups: {
        fontSize: 10,
        fontFamily: Fonts.Poppins_Regular,
        lineHeight: 18
    }
})

export default CancelledItem