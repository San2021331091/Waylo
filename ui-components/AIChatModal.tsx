import React from "react";
import {
    View,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "react-native-vector-icons/Ionicons";

interface AIChatModalProps {
    visible: boolean;
    onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({
                                                     visible,
                                                     onClose,
                                                 }:AIChatModalProps):React.JSX.Element => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" />

                {/* Close Button */}
                <TouchableOpacity
                    onPress={onClose}
                    className={`absolute right-5 bg-green-600 p-3 rounded-full z-10 shadow-lg ${Platform.OS === "android" ? 'top-[40]': 'top-[80]'}`}
                >
                    <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>

                {/* WebView */}
                <WebView
                    source={{ uri: "https://waylogpt-kif3bt.ai.copilot.live/" }}
                    className="flex-1"
                    javaScriptEnabled
                    domStorageEnabled
                    nestedScrollEnabled
                    scrollEnabled
                    startInLoadingState
                    overScrollMode="always"
                    injectedJavaScript={`
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            true;
          `}
                    renderLoading={() => (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#22c55e" />
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
};

export default AIChatModal;
