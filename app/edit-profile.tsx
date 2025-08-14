import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Phone, Shield } from 'lucide-react-native';

export default function EditProfile() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Account Details</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={['#8B5CF6', '#A78BFA']}
                        style={styles.profileGradient}
                    >
                        <Image
                            source={{ uri: 'https://ui-avatars.com/api/?name=Laxman+Chidurala&background=8B5CF6&color=fff&size=128' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>Laxman Chidurala</Text>

                        <View style={styles.profileInfo}>
                            <View style={styles.profileInfoItem}>
                                <Mail size={18} color="#fff" />
                                <Text style={styles.profileInfoText}>chiduralalaxman@gmail.com (Verified)</Text>
                            </View>
                            <View style={styles.profileInfoItem}>
                                <Phone size={18} color="#fff" />
                                <Text style={styles.profileInfoText}>8261825905 (Verified)</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Sections */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <User size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>First Name: Laxman</Text>
                        </View>
                    </View>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <User size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>Last Name: Chidurala</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Contact & Payment</Text>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Phone size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>Phone: 8261825905</Text>
                        </View>
                    </View>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Mail size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>UPI ID: Not provided</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Security</Text>
                    <View style={[styles.menuItem, styles.dangerItem]}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, styles.dangerIcon]}>
                                <Shield size={20} color="#EF4444" />
                            </View>
                            <Text style={[styles.menuItemText, styles.dangerText]}>
                                Two-Factor Authentication
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>App Version 1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#111827',
    },
    profileCard: {
        margin: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    profileGradient: {
        padding: 24,
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    profileName: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    profileInfo: {
        alignItems: 'center',
    },
    profileInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileInfoText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#FFFFFF',
        marginLeft: 8,
        opacity: 0.9,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#111827',
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#111827',
    },
    dangerItem: {
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    dangerIcon: {
        backgroundColor: '#FEE2E2',
    },
    dangerText: {
        color: '#EF4444',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    versionText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: '#9CA3AF',
    },
});
