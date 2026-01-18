import { Ionicons } from '@expo/vector-icons';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.content}>
                <Ionicons name="person-outline" size={64} color="#8B9DB8" />
                <Text style={styles.placeholder}>Your Profile</Text>
                <Text style={styles.subtext}>Manage your account settings</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a2632',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    placeholder: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a2632',
        marginTop: 20,
    },
    subtext: {
        fontSize: 14,
        color: '#8B9DB8',
        marginTop: 8,
    },
});
