import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <View style={styles.shoppingBag}>
                        <View style={styles.bagHandle} />
                        <View style={styles.bagBody}>
                            <View style={styles.diamond} />
                        </View>
                    </View>
                </View>
                <Text style={styles.brandName}>Fuzzy</Text>
                <Text style={styles.tagline}>Your Premium Shopping Experience</Text>
            </View>

            {/* Buttons Section */}
            <View style={styles.buttonSection}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.link}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
    },
    logoSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    logoContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    shoppingBag: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bagHandle: {
        width: 60,
        height: 30,
        borderWidth: 7,
        borderColor: '#667eea',
        borderBottomWidth: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginBottom: -6,
    },
    bagBody: {
        width: 100,
        height: 90,
        backgroundColor: '#667eea',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    diamond: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        transform: [{ rotate: '45deg' }],
        opacity: 0.9,
    },
    brandName: {
        fontSize: 56,
        fontWeight: '800',
        color: '#1f2937',
        letterSpacing: 1,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
    buttonSection: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#667eea',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    signupButton: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#667eea',
    },
    signupButtonText: {
        color: '#667eea',
        fontSize: 18,
        fontWeight: '700',
    },
    guestButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    guestButtonText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#9ca3af',
        lineHeight: 20,
    },
    link: {
        color: '#667eea',
        fontWeight: '600',
    },
});
