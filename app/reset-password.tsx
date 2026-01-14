import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, StatusBar, Platform, ScrollView, Animated, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
const HEADER_MAX_HEIGHT = height * 0.32 + statusBarHeight;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ResetPasswordScreen() {
    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Keyboard listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Parallax animations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.8, 0.5],
        extrapolate: 'clamp',
    });

    const imageScale = scrollY.interpolate({
        inputRange: [-100, 0, HEADER_SCROLL_DISTANCE],
        outputRange: [1.5, 1, 0.8],
        extrapolate: 'clamp',
    });

    const textOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const handleResetPassword = () => {
        // Validate passwords
        if (!newPassword || !confirmPassword) {
            alert('Please enter both passwords');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        console.log('Password reset successful');
        // Navigate to login
        router.push('/login');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? -60 : 0}
                enabled
            >
                <Animated.ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    scrollEventThrottle={16}
                    bounces={true}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                >
                    {/* Header Image Section */}
                    <Animated.View style={[styles.headerImageSection, { height: headerHeight }]}>
                        <Animated.Image
                            source={require('@/assets/images/screen2_img1.png')}
                            style={[
                                styles.headerImage,
                                {
                                    opacity: imageOpacity,
                                    transform: [{ scale: imageScale }],
                                },
                            ]}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />

                        {/* Close Button */}
                        <Animated.View style={[styles.closeButtonContainer, { opacity: textOpacity }]}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleBack}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={28} color="#FFFFFF" />
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Title */}
                        <Animated.View style={[styles.headerTextContainer, { opacity: textOpacity }]}>
                            <Text style={styles.headerTitle}>Create a New Password</Text>
                        </Animated.View>

                        {/* Shadow Gradient */}
                        <View style={styles.bottomShadowContainer}>
                            <View style={[styles.gradientLayer, { opacity: 0.1 }]} />
                            <View style={[styles.gradientLayer, { opacity: 0.2 }]} />
                            <View style={[styles.gradientLayer, { opacity: 0.3 }]} />
                            <View style={[styles.gradientLayer, { opacity: 0.4 }]} />
                            <View style={[styles.gradientLayer, { opacity: 0.6 }]} />
                            <View style={[styles.gradientLayer, { opacity: 0.8 }]} />
                            <View style={[styles.gradientLayer, { opacity: 1 }]} />
                        </View>
                    </Animated.View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {/* New Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.yellowBorder} />
                                <Ionicons name="key-outline" size={20} color="#8B9DB8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter New Password"
                                    placeholderTextColor="#6B7A93"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#8B9DB8"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.yellowBorder} />
                                <Ionicons name="key-outline" size={20} color="#8B9DB8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Confirm Password"
                                    placeholderTextColor="#6B7A93"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#8B9DB8"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Reset Password Button */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetPassword}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.resetButtonText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2632',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerImageSection: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        marginTop: -statusBarHeight,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(26, 38, 50, 0.3)',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: statusBarHeight + 20,
        right: 30,
        zIndex: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        paddingTop: statusBarHeight,
        zIndex: 10,
    },
    headerTitle: {
        fontFamily: 'poppins-bold',
        letterSpacing: 1,
        fontSize: 30,
        fontWeight: '600',
        color: '#c0bebeff',
    },
    bottomShadowContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'space-between',
        zIndex: 1,
    },
    gradientLayer: {
        flex: 1,
        backgroundColor: '#1a2632',
    },
    formSection: {
        paddingHorizontal: 30,
        paddingTop: 30,
        backgroundColor: '#1a2632',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#243442',
        borderRadius: 12,
        height: 56,
        position: 'relative',
        paddingLeft: 18,
    },
    yellowBorder: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#FFB800',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        paddingRight: 15,
    },
    eyeIcon: {
        padding: 10,
    },
    resetButton: {
        backgroundColor: '#FFB800',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    resetButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
});
