const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const baseConfig = getDefaultConfig(__dirname);
const customConfig = {
    resolver: {
        extraNodeModules: {
            "react-dom": require.resolve("./shim/react-dom.js"),
        },
    },
};

const merged = mergeConfig(baseConfig, customConfig);

module.exports = withNativeWind(merged, { input: "./global.css" });
