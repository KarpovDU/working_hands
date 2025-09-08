import { mergeConfig, getDefaultConfig } from '@react-native/metro-config'

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
