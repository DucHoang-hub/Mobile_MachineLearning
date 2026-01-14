import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, StatusBar, Platform, ScrollView, Animated, Image, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44; // iOS notch area
const HEADER_MAX_HEIGHT = height * 0.32 + statusBarHeight;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Typewriter animation for "Hello Again!"
    const [displayedText, setDisplayedText] = useState('');
    const fullText = 'Hello Again!';

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

    // Typewriter animation effect
    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 80); // 80ms per character - smooth like iPhone

        return () => clearInterval(timer);
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

    const handleSignIn = () => {
        // Handle sign in logic
        console.log('Sign in with:', email, password);
        // Navigate to home screen
        router.push('/(tabs)');
    };

    const handleSocialLogin = (platform: string) => {
        console.log('Login with:', platform);
        // Navigate to home screen
        router.push('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Make status bar translucent for edge-to-edge */}
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
                    {/* Header Image Section - Animated */}
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
                        {/* Overlay gradient for better text visibility */}
                        <View style={styles.imageOverlay} />

                        {/* Welcome Text on Image - Fades out on scroll */}
                        <Animated.View style={[styles.welcomeTextContainer, { opacity: textOpacity }]}>
                            <Text style={styles.welcomeTitle}>
                                {displayedText}
                                {displayedText.length < fullText.length && <Text style={styles.cursor}>|</Text>}
                            </Text>
                            <Text style={styles.welcomeSubtitle}>Welcome back. You have been missed!</Text>
                        </Animated.View>

                        {/* Bottom shadow gradient - multiple layers for smooth fade */}
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
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email id</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.yellowBorder} />
                                <Ionicons name="mail-outline" size={20} color="#8B9DB8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Email"
                                    placeholderTextColor="#6B7A93"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.yellowBorder} />
                                <Ionicons name="key-outline" size={20} color="#8B9DB8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Password"
                                    placeholderTextColor="#6B7A93"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    onFocus={() => {
                                        // Scroll to make password field visible above keyboard
                                        setTimeout(() => {
                                            scrollViewRef.current?.scrollTo({
                                                y: 300, // Adjust this value based on field position
                                                animated: true,
                                            });
                                        }, 100);
                                    }}
                                />
                            </View>
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.rememberMeContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                    {rememberMe && <Ionicons name="checkmark" size={14} color="#1a2632" />}
                                </View>
                                <Text style={styles.rememberMeText}>Remember me</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => router.push('/forgot-password')}
                            >
                                <Text style={styles.forgotPassword}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={handleSignIn}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </TouchableOpacity>

                        {/* OR Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login Buttons */}
                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.socialButton, styles.facebookButton]}
                                onPress={() => handleSocialLogin('Facebook')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="logo-facebook" size={28} color="#FFFFFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.socialButton, styles.googleButton]}
                                onPress={() => handleSocialLogin('Google')}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={require('@/assets/images/google_logo.png')}
                                    style={styles.googleLogo}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.socialButton, styles.appleButton]}
                                onPress={() => handleSocialLogin('Apple')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="logo-apple" size={28} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account ? </Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => router.push('/signup')}
                            >
                                <Text style={styles.signUpLink}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
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
        marginTop: -statusBarHeight, // Pull up to cover status bar
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
        backgroundColor: 'rgba(26, 38, 50, 0.3)', // Dark overlay
    },
    welcomeTextContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        paddingTop: statusBarHeight, // Account for status bar
        zIndex: 10, // Keep text above shadow gradient
    },
    welcomeTitle: {
        fontSize: 42, // Larger for cursive impact
        fontWeight: '400', // Normal weight for cursive fonts
        color: '#FFFFFF',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Apple Chancery' : 'cursive', // Artistic cursive font
        letterSpacing: 1, // More spacing for cursive readability
        fontStyle: 'italic', // Italicized for elegant cursive look
    },
    cursor: {
        fontSize: 42,
        fontWeight: '300',
        color: '#FFFFFF',
        opacity: 0.8,
        fontStyle: 'italic',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#E0E0E0',
        fontWeight: '400',
    },
    bottomShadowContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'space-between',
        zIndex: 1, // Stay below welcome text
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
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 5,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#6B7A93',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#FFB800',
        borderColor: '#FFB800',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#8B9DB8',
    },
    forgotPassword: {
        fontSize: 14,
        color: '#FF4444',
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#FFB800',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#3a4a5a',
    },
    dividerText: {
        fontSize: 14,
        color: '#6B7A93',
        marginHorizontal: 15,
        fontWeight: '500',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 25,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        // No border needed - logo has white background that blends in
    },
    googleLogo: {
        width: 40,
        height: 40,
    },
    appleButton: {
        backgroundColor: '#000000',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signUpText: {
        fontSize: 14,
        color: '#8B9DB8',
    },
    signUpLink: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
