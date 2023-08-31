import React from 'react'
import { Modal, StyleSheet, Pressable, View, TouchableOpacity, Text } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from "react-native-customized-image-picker";

import Fonts from '../Constants/Fonts'

const CustomImagePickerModal = props => {

    const pickADocument = async () => {
        try {
            const rest = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.xls, DocumentPicker.types.xlsx],
            });
            for (const res of rest) {
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                );
            
            }
            for (let index = 0; index < rest.length; index++) {
                const element = rest[index];
                element.path=element.uri
                element.doc=true
                
            }
            // res.path = res.uri
            // res.doc = true
            if (props.selector == "1") {
                console.log("For the image 1")
                props.imageUrl1(rest)

                props.pressHandler()
            } else if (props.selector == "2") {
                props.imageUrl2(rest)
                props.pressHandler()
            } else {
                props.imageUrl3(rest)
                props.pressHandler()

            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const openGallery = () => {
        ImagePicker.openPicker({
            multiple: true,
            cropping: true
        }).then(image => {
            if (props.selector == "1") {
                console.log("For the image 1", image)
                props.imageUrl1(image)
                props.pressHandler()
            } else if (props.selector == "2") {
                props.imageUrl2(image)
                props.pressHandler()
            } else {
                props.imageUrl3(image)
                props.pressHandler()
            }
        });
    }

    const openCamera = () => {
        ImagePicker.openCamera({

        }).then(image => {
            let arr = []
            for (let index = 0; index < image.length; index++) {
                const element = image[index];
                element.mime = "image/jpeg"
                arr.push(element)
            }
            console.log(arr)

            if (props.selector == "1") {
                console.log("For the image 1", arr)
                props.imageUrl1(arr)
                props.pressHandler()
            } else if (props.selector == "2") {
                props.imageUrl2(arr)
                props.pressHandler()
            } else {
                props.imageUrl3(arr)
                props.pressHandler()
            }
        });
    }

    return (
        <Modal
            visible={props.visible}
            animationType="fade"
            transparent={true}
            {...props}
        >
            <Pressable
                onPress={props.pressHandler}
                style={styles.modalScreen}>

                <View style={styles.modalContanier}>

                    <View style={styles.pickerContanier}>
                        <Text style={styles.chooseMedia}>Choose Media</Text>
                    </View>

                    <View style={styles.optionsContanier}>
                        <TouchableOpacity
                            onPress={() => pickADocument()}
                            style={{}}>
                            <Text style={styles.options}>DOCUMENT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openGallery()}
                        >
                            <Text style={styles.options}>GALLERY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openCamera()}
                        >
                            <Text style={styles.options}>CAMERA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContanier: {
        backgroundColor: 'white',
        height: "17%",
        width: "90%",
        alignSelf: 'center',
        paddingVertical: 20,
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    chooseMedia: {
        fontFamily: Fonts.Poppins_Regular,
        fontSize: 20
    },
    options: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_Regular
    },
    optionsContanier: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    pickerContanier: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default CustomImagePickerModal