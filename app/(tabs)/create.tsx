import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';


// Helper function to decode base64 to ArrayBuffer
function decode(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };


  // omor!!!
  const uploadImage = async (uri: string): Promise<string> => {
    try {
      console.log('Starting upload for URI:', uri);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      console.log('Uploading to:', fileName);
      console.log('File size (base64):', base64.length);

      // Upload using ArrayBuffer
      const { data, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, decode(base64), {
          contentType: contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      
      if (image) {
        console.log('Starting image upload...');
        imageUrl = await uploadImage(image.uri);
        console.log('Image uploaded successfully:', imageUrl);
      }

      console.log('Creating post...');
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      console.log('Post created successfully!');
      Alert.alert('Success', 'Post created!', [
        { 
          text: 'OK', 
          onPress: () => {
            setContent('');
            setImage(null);
            router.push('/(tabs)');
          }
        }
      ]);
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
          <Text style={styles.pickImageText}>
            {image ? ' Change Image' : ' Add Image'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handleCreatePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickImageButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickImageText: {
    fontSize: 16,
    color: '#333',
  },
  postButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#999',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});