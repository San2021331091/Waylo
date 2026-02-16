import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Platform,
    Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
    request,
    PERMISSIONS,
    RESULTS,
    check,
} from "react-native-permissions";

interface AIChatModalProps {
    visible: boolean;
    onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({
    visible,
    onClose,
}) => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const uri = process.env.METRO_PUBLIC_WAYLO_GPT_URL;

    if(!uri)
        throw new Error("METRO_PUBLIC_WAYLO_GPT_URL is not defined in .env file");

    useEffect(() => {
        if (visible) {
            requestMicrophonePermission();
        }
    }, [visible]);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === "android") {
            const permission = PERMISSIONS.ANDROID.RECORD_AUDIO;

            const result = await check(permission);

            if (result === RESULTS.GRANTED) {
                setHasPermission(true);
                setLoading(false);
                return;
            }

            const requestResult = await request(permission);

            if (requestResult === RESULTS.GRANTED) {
                setHasPermission(true);
            } else {
                setHasPermission(false);
            }

            setLoading(false);
        } else {
    
            setHasPermission(true);
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" />

                <TouchableOpacity
                    onPress={onClose}
                    className={`absolute right-5 bg-green-600 p-3 rounded-full z-10 shadow-lg ${
                        Platform.OS === "android" ? "top-[40]" : "top-[80]"
                    }`}
                >
                    <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>

                {loading && (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#22c55e" />
                    </View>
                )}

                {!loading && hasPermission && (
                    <WebView
                        source={{
                            uri: uri,
                        }}
                        className="flex-1"
                        javaScriptEnabled
                        domStorageEnabled
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback
                        mixedContentMode="always"
                        startInLoadingState
                        renderLoading={() => (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator
                                    size="large"
                                    color="#22c55e"
                                />
                            </View>
                        )}
                    />
                )}

                {!loading && !hasPermission && (
                    <View className="flex-1 justify-center items-center px-6">
                        <Text className="text-center text-red-500">
                            Microphone permission is required.
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default AIChatModal;
