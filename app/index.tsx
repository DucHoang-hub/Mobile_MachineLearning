import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Onboarding data with 3 screens
const ONBOARDING_DATA = [
    {
        image: require('@/assets/images/screen1_img1.png'),
        title: 'Relaxing Furniture',
        description: 'The best payment method connects your money to friends, family, brands, and experiences.',
    },
    {
        image: require('@/assets/images/screen1_img2.png'),
        title: 'Home Decor',
        description: 'Experience the perfect blend of comfort and style with our curated furniture collection.',
    },
    {
        image: require('@/assets/images/screen1_img3.png'),
        title: 'Office Furniture',
        description: 'Transform your space into a haven of elegance and comfort with premium furniture.',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(1));
    const [slideAnim] = useState(new Animated.Value(0));
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Auto-play timer
    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            handleNext();
        }, 5000); // Auto change every 5 seconds

        return () => clearTimeout(autoPlayTimer);
    }, [currentIndex]);

    // Rotation animation
    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 5000, // 5 seconds - faster rotation
                useNativeDriver: true,
                easing: (t) => t, // Linear easing for smooth continuous rotation
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleNext = () => {
        // Fade out animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -width, // Slide to left
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Change index - loop back to first screen after last
            if (currentIndex < ONBOARDING_DATA.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                // Last screen, go back to first screen
                setCurrentIndex(0);
            }

            // Fade in animation
            slideAnim.setValue(width); // Start from right
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const currentData = ONBOARDING_DATA[currentIndex];

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }], // Horizontal slide
                    },
                ]}
            >
                {/* Furniture Image + Rotating Circle - NO CONTAINER */}
                <View style={styles.imageSection}>
                    {/* Static Outer Circle Border */}
                    <View style={styles.outerCircleBorder} />

                    {/* Rotating Semi-Circle Background */}
                    <Animated.View
                        style={[
                            styles.rotatingCircle,
                            { transform: [{ rotate }] }
                        ]}
                    >
                        <View style={styles.semiCircle} />
                    </Animated.View>

                    {/* Furniture Image Container */}
                    <View style={styles.furnitureImageContainer}>
                        {/* Preload all images to avoid delay */}
                        {ONBOARDING_DATA.map((item, index) => (
                            <Image
                                key={index}
                                source={item.image}
                                style={[
                                    styles.furnitureImage,
                                    {
                                        opacity: index === currentIndex ? 1 : 0,
                                        transform: index === 2 ? [{ scale: 0.7 }] : [] // Image 3 smaller
                                    }
                                ]}
                                resizeMode="contain"
                            />
                        ))}
                    </View>
                </View>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Content Card - WRAPS TEXT + BUTTON */}
                <View style={styles.illustrationCard}>
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{currentData.title}</Text>
                            <View style={styles.underline} />
                        </View>

                        <Text style={styles.description}>
                            {currentData.description}
                        </Text>
                    </View>

                    {/* Arrow Button */}
                    <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2632',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bokehCircle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.15,
    },
    bokeh1: {
        width: 80,
        height: 80,
        backgroundColor: '#4a6278',
        top: '8%',
        left: '10%',
    },
    bokeh2: {
        width: 50,
        height: 50,
        backgroundColor: '#5a7288',
        top: '12%',
        right: '15%',
    },
    bokeh3: {
        width: 60,
        height: 60,
        backgroundColor: '#4a6278',
        bottom: '45%',
        left: '8%',
    },
    bokeh4: {
        width: 45,
        height: 45,
        backgroundColor: '#5a7288',
        bottom: '48%',
        right: '12%',
    },
    content: {
        width: width * 0.9,
        maxWidth: 400,
    },

    // Image section (no background card)
    imageSection: {
        position: 'relative',
        height: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    // Content card (wraps text + button)
    illustrationCard: {
        backgroundColor: '#243442',
        borderRadius: 30,
        padding: 30,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
    },

    // Rotating Semi-Circle
    rotatingCircle: {
        position: 'absolute',
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    semiCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 10,
        borderColor: 'transparent',
        borderTopColor: '#2d4153',
        borderRightColor: '#2d4153',
    },

    // Outer circle border (static, doesn't rotate)
    outerCircleBorder: {
        position: 'absolute',
        width: 282,
        height: 282,
        borderRadius: 141,
        borderWidth: 12,
        borderColor: '#1e2f3d',
    },

    // Furniture Image
    furnitureImageContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    furnitureImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    // Pagination dots
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4a6278',
    },
    activeDot: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e5b944',
    },

    // Text Content
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    underline: {
        width: 100,
        height: 3,
        backgroundColor: '#e5b944',
        marginTop: 8,
        borderRadius: 2,
    },
    description: {
        fontSize: 16,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    arrowButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    arrow: {
        fontSize: 32,
        color: '#1a2632',
        fontWeight: '600',
    },
});
