import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
const HEADER_MAX_HEIGHT = height * 0.32 + statusBarHeight;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function OTPVerificationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const phoneNumber = params.phone || '+91 635 546 23098'; // Default or from params

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

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

    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = numericValue;
            setOtp(newOtp);

            // Auto-focus next input
            if (numericValue && index < 4) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 5) {
            alert('Please enter all 5 digits');
            return;
        }

        console.log('Verifying OTP:', otpCode);
        // Navigate to reset password
        router.push('/reset-password');
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

                        {/* Title at Bottom */}
                        <Animated.View style={[styles.headerTextContainer, { opacity: textOpacity }]}>
                            <Text style={styles.headerTitle}>OTP Verification</Text>
                        </Animated.View>

                        {/* Bottom shadow gradient */}
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
                        {/* Instruction Text */}
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>
                                We have sent a verification code to
                            </Text>
                            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                        </View>

                        {/* OTP Input Boxes */}
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                    autoFocus={index === 0}
                                />
                            ))}
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={handleVerify}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.verifyButtonText}>Verify</Text>
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
        paddingTop: 40,
        backgroundColor: '#1a2632',
    },
    instructionContainer: {
        marginBottom: 40,
    },
    instructionText: {
        fontSize: 16,
        color: '#8B9DB8',
        textAlign: 'left',
        marginBottom: 8,
        lineHeight: 24,
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'left',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 12,
    },
    otpInput: {
        flex: 1,
        height: 60,
        backgroundColor: '#243442',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    otpInputFilled: {
        borderColor: '#4CAF50', // Green border when filled
        backgroundColor: '#2a3f52',
    },
    verifyButton: {
        backgroundColor: '#FFB800',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    verifyButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
});
