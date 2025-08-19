import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { ArrowLeft, CreditCard, PlusCircle } from "lucide-react-native";
import { router } from "expo-router";

export default function PaymentMethodScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
            </View>

            <ScrollView>
                {/* Existing Payment Methods */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Saved Cards</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <CreditCard size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>Visa •••• 1234</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <CreditCard size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>MasterCard •••• 5678</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Add New Payment Method */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Add New</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <PlusCircle size={20} color="#111827" />
                            </View>
                            <Text style={styles.menuItemText}>Add Credit/Debit Card</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#111827",
        marginLeft: 10,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: "#111827",
    },
});