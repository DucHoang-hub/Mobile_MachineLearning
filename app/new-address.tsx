import { useTheme } from '@/contexts/ThemeContext';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Định nghĩa kiểu dữ liệu cho Form
interface AddressForm {
  name: string;
  phoneNumber: string;
  streetAddress: string;
  landmark: string;
  city: string;
  pinCode: string;
  addressType: 'Home' | 'Office' | 'Other';
}

const AddAddressScreen: React.FC = () => {
  const [form, setForm] = useState<AddressForm>({
    name: '',
    phoneNumber: '',
    streetAddress: '',
    landmark: '',
    city: '',
    pinCode: '',
    addressType: 'Home',
  });
  const { isDarkMode, colors } = useTheme();

  const updateForm = (key: keyof AddressForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <Stack.Screen options={{ headerShown: false }}/>

        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: colors.surface}]}>
        <TouchableOpacity
            onPress={() => {
                router.replace('/page-listing');
                }
            }
            style={styles.backButton}
        >
          <Text style={[styles.backIcon, {color: colors.text}]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Add New Address</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text}]}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            onChangeText={(v) => updateForm('name', v)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text}]}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your number"
            keyboardType="phone-pad"
            onChangeText={(v) => updateForm('phoneNumber', v)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text}]}>Street Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            onChangeText={(v) => updateForm('streetAddress', v)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text}]}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your landmark"
            onChangeText={(v) => updateForm('landmark', v)}
          />
        </View>

        {/* City & Pin Code Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={[styles.label, {color: colors.text}]}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              onChangeText={(v) => updateForm('city', v)}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.label, {color: colors.text}]}>Pin Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pin"
              keyboardType="numeric"
              onChangeText={(v) => updateForm('pinCode', v)}
            />
          </View>
        </View>

        {/* Address Type (Radio Buttons) */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: colors.text}]}>Address Type</Text>
          <View style={styles.radioContainer}>
            {(['Home', 'Office', 'Other'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.radioButton}
                onPress={() => updateForm('addressType', type)}
              >
                <View style={[
                  styles.outerCircle,
                  form.addressType === type && styles.selectedOuterCircle
                ]}>
                  {form.addressType === type && <View style={styles.innerCircle} />}
                </View>
                <Text style={styles.radioText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2533',
  },
  backIcon: {
    fontSize: 24,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a2533',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f6f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  radioContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f6f8',
    borderRadius: 8,
    padding: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  outerCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedOuterCircle: {
    borderColor: '#1a2533',
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#1a2533',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#1a2533',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddAddressScreen;