import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const TEXT_RED = '#d42525';
const RED_ACCENT = '#ff6f6f';

export default function AddBusinessModal({ visible, onClose, onSubmit }) {
  const [businessData, setBusinessData] = useState({
    name: '',
    about: '',
    address: '',
    category: '',
    imageUrl: '',
  });

  const handleBusinessChange = (field, value) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { name, about, address, category, imageUrl } = businessData;
    if (!name || !about || !address || !category || !imageUrl) {
      alert('Please fill all fields');
      return;
    }
    onSubmit(businessData);
    setBusinessData({ name: '', about: '', address: '', category: '', imageUrl: '' });
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
          <Text style={{ fontSize: RFValue(18), fontFamily: 'Outfit-Bold', marginBottom: 15 }}>
            Add Your Business
          </Text>

          {['name', 'about', 'address', 'category', 'imageUrl'].map((field) => (
            <View key={field} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold', color: TEXT_RED }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 10,
                  fontSize: RFValue(14),
                }}
                value={businessData[field]}
                onChangeText={(text) => handleBusinessChange(field, text)}
                placeholder={`Enter ${field}`}
              />
            </View>
          ))}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, backgroundColor: '#ccc', padding: 12, borderRadius: 10, marginRight: 10, alignItems: 'center' }}
            >
              <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={{ flex: 1, backgroundColor: RED_ACCENT, padding: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ fontSize: RFValue(14), fontFamily: 'Outfit-Bold', color: '#fff' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
