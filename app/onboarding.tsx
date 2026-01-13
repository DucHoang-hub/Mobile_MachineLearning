import { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Fuzzy',
        description: 'Discover amazing products from top brands at unbeatable prices',
        emoji: '🛍️',
        backgroundColor: '#667eea',
    },
    {
        id: '2',
        title: 'Secure Shopping',
        description: 'Shop with confidence using our secure payment gateway',
        emoji: '🔒',
        backgroundColor: '#764ba2',
    },
    {
        id: '3',
        title: 'Fast Delivery',
        description: 'Get your orders delivered quickly right to your doorstep',
        emoji: '🚀',
        backgroundColor: '#f093fb',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentIndex(viewableItems[0]?.index || 0);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/welcome');
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
            <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const Paginator = () => {
        return (
            <View style={styles.paginatorContainer}>
                {slides.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 20, 10],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            style={[styles.dot, { width: dotWidth, opacity }]}
                            key={i.toString()}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <Paginator />

                <View style={styles.buttonContainer}>
                    {currentIndex < slides.length - 1 ? (
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => router.replace('/welcome')}
                        >
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            currentIndex === slides.length - 1 && styles.getStartedButton,
                        ]}
                        onPress={scrollTo}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width,
        height: height * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emojiContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 100,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    paginatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#667eea',
        marginHorizontal: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    skipText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#667eea',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        minWidth: 120,
        alignItems: 'center',
    },
    getStartedButton: {
        flex: 1,
        marginLeft: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
