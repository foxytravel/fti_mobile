import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Image, StyleSheet, ScrollView, Modal, Pressable } from 'react-native'
import Fonts from '../Constants/Fonts'

const RenderImageItem = props => {

    const [show, setShow] = useState(false)
    const [showImageUri, setShowImageUri] = useState('')

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={show}
            >
                <Pressable
                    onPress={() => setShow(!show)}
                    style={styles.modalScreen}>
                    <View style={styles.showImageContanier}>
                        <Image
                            style={styles.imagePreview}
                            source={{ uri: showImageUri }}
                        />
                    </View>
                </Pressable>
            </Modal>

            {props.image.length == 0 ? <TouchableOpacity
                onPress={() => {
                    props.openModal()
                    props.select()
                }}
                style={styles.attachmentContanier}
            >
                <Text style={styles.attachmentText}>Attachments</Text>
                <Image
                    style={styles.attachmentImage}
                    source={require('../Assets/Images/fileattach.png')}
                />
            </TouchableOpacity>
                :

                props.image.length == 1 ?
                    <View>
                        <TouchableOpacity
                            onPress={() => props.setImage()}
                            style={{ alignSelf: 'flex-end' }}>
                            <Image
                                style={styles.cancelImage}
                                source={require("../Assets/Images/cancel.png")}
                            />
                        </TouchableOpacity>
                        {
                            !props.image[0].doc && <Image
                                source={{ uri: props.image[0].path }}
                                style={styles.renderSingleImage}
                            />}
                        {
                            props.image[0].doc &&
                            <Image
                                style={[styles.renderSingleImage, { resizeMode: "contain" }]}
                                source={require('../Assets/Images/document.png')}
                            />
                        }
                    </View> :
                    <ScrollView
                        horizontal={true}
                    >
                        {props.image.map((data, index) => {
                            return (
                                <View key={index}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.delete(data.path)
                                        }}
                                        style={styles.cancelContanier}>
                                        <Image
                                            style={styles.cancelImage}
                                            source={require("../Assets/Images/cancel.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShow(!show)
                                            setShowImageUri(data.path)
                                        }}
                                    >{
                                            !data.doc &&
                                            <Image
                                                style={styles.renderImage}
                                                source={{ uri: data.path }}
                                            />
                                        }

                                        {
                                            data.doc &&
                                            <Image
                                                style={[styles.renderImage, { resizeMode: "contain" }]}
                                                source={require('../Assets/Images/document.png')}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </ScrollView>}
        </View>
    )
}

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    attachmentContanier: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderColor: "#223F9A",
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 20,
        height: 55,
        borderStyle: 'dashed',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    attachmentText: {
        color: 'grey',
        fontFamily: Fonts.Poppins_Medium,
        fontSize: 14
    },
    attachmentImage: {
        height: 15,
        width: 15,
        resizeMode: "contain"
    },
    cancelImage: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        marginBottom: 5,
        marginTop: 20,
    },
    cancelContanier: {
        alignSelf: 'flex-end'
    },
    showImageContanier: {
        width: "100%",
        height: "40%",
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: "hidden"
    },
    renderImage: {
        width: 50,
        height: 50,
        marginRight: 10
    },
    renderSingleImage: {
        width: "100%",
        height: 200
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    }
})

export default RenderImageItem